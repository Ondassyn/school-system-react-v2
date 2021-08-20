import React, { useState } from 'react';

import readXlsxFile from 'read-excel-file';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { makeStyles } from '@material-ui/core/styles';
import AddBox from '@material-ui/icons/AddBox';
import TransitionModal from '../../../../../components/TransitionModal/TransitionModal';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Box, Tooltip, Typography } from '@material-ui/core';

import Input from '@material-ui/core/Input';
import GetAppIcon from '@material-ui/icons/GetApp';

import { uploadTxt } from '../../../../../../api/turkishA1/results/uploadTxt';
import { uploadXlsx } from '../../../../../../api/turkishA1/results/uploadXlsx';
import useSnackbars from '../../../../../../api/notifications/snackbarConsumer';
import { Button, IconButton } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { userIsInRole } from '../../../../../../api/users/methods';

const useStyles = makeStyles(theme => ({
  formRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  formControl: {
    display: 'flex',
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(2, 0, 1, 0),
  },
  box: {
    padding: theme.spacing(1),
  },
}));

export const Upload = ({
  setBlocking,
  settings,
  currentYear,
  results,
  students,
}) => {
  const classes = useStyles();
  const { showSnackbar } = useSnackbars();
  const [t, i18n] = useTranslation();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [examNumber, setExamNumber] = useState('');
  const [file, setFile] = useState(null);
  const [filetype, setFiletype] = useState('');
  const [grade, setGrade] = useState('');

  const showModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const processTxt = async data => {
    if (!data) {
      showSnackbar({ message: t('no_data'), severity: 'error' });
      return;
    }

    closeModal();
    setBlocking(true);
    await uploadTxt({ t, data, academicYear: currentYear, examNumber })
      .then(value => showSnackbar({ message: value, severity: 'success' }))
      .catch(value => showSnackbar({ message: value, severity: 'error' }));
    setBlocking(false);
  };

  const processXlsx = async data => {
    if (!data) {
      showSnackbar({ message: t('no_data'), severity: 'error' });
      return;
    }

    closeModal();

    setBlocking(true);
    await readXlsxFile(data).then(rows => {
      uploadXlsx({ t, rows, academicYear: currentYear, examNumber })
        .then(value => showSnackbar({ message: value, severity: 'success' }))
        .catch(value => showSnackbar({ message: value, severity: 'error' }));
    });

    setBlocking(false);
  };

  const downloadFile = () => {
    const fileName = 'upload_example';
    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    if (!grade) {
      showSnackbar({ message: t('grade_not_selected'), severity: 'error' });
      return;
    }

    const schoolStudents = students.filter(s => +s.grade === +grade);

    const headers = [
      'schoolId',
      'studentId',
      'grade',
      'division',
      'studentSurname',
      'studentName',
      'dinleme',
      'okuma',
      'yazma',
      'konusma',
    ];

    let dataToExport = [];

    schoolStudents.map(s => {
      let studentRecord = {
        [headers[0]]: s.schoolId,
        [headers[1]]: s.studentId,
        [headers[2]]: s.grade,
        [headers[3]]: s.division,
        [headers[4]]: s.surname,
        [headers[5]]: s.name,
      };

      let studentResult = results.find(r => r.studentId === s.studentId);
      if (studentResult) {
        studentRecord[headers[6]] = studentResult.results.find(
          e => e.sectionName === headers[6]
        )?.result;
        studentRecord[headers[7]] = studentResult.results.find(
          e => e.sectionName === headers[7]
        )?.result;
        studentRecord[headers[8]] = studentResult.results.find(
          e => e.sectionName === headers[8]
        )?.result;
        studentRecord[headers[9]] = studentResult.results.find(
          e => e.sectionName === headers[9]
        )?.result;
      }
      dataToExport.push(studentRecord);
    });

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const onSubmit = e => {
    e.preventDefault();

    if (!file) {
      showSnackbar({ message: t('file_not_found'), severity: 'error' });
      return;
    }

    if (!currentYear) {
      showSnackbar({
        message: t('year_not_selected'),
        severity: 'error',
      });
      return;
    }

    if (!examNumber) {
      showSnackbar({
        message: 'exam_number_not_selected',
        severity: 'error',
      });
      return;
    }

    if (!filetype) {
      showSnackbar({
        message: 'file_type_not_selected',
        severity: 'error',
      });
      return;
    }

    if (filetype === 'txt') {
      let fileReader = new FileReader();
      fileReader.onloadend = () => processTxt(fileReader.result);
      fileReader.readAsText(file);
    } else {
      processXlsx(file);
    }
  };

  const form = (
    <form onSubmit={onSubmit} className={classes.formRoot}>
      <FormControl className={classes.formControl}>
        <InputLabel>{t('exam_number')}</InputLabel>
        <Select
          value={examNumber}
          onChange={e => setExamNumber(e.target.value)}
        >
          {settings
            .map(e => e.examNumber)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map(item => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
        </Select>
        {/* <FormHelperText>Placeholder</FormHelperText> */}
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel>{t('grade')}</InputLabel>
        <Select value={grade} onChange={e => setGrade(e.target.value)}>
          {settings
            .map(e => e.grade)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map(item => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
        </Select>
        {/* <FormHelperText>Placeholder</FormHelperText> */}
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel>{t('file_type')}</InputLabel>
        <Select value={filetype} onChange={e => setFiletype(e.target.value)}>
          <MenuItem key={'txt'} value={'txt'}>
            .TXT
          </MenuItem>
          <MenuItem key={'xlsx'} value={'xlsx'}>
            .XLSX
          </MenuItem>
        </Select>
        {/* <FormHelperText>Placeholder</FormHelperText> */}
      </FormControl>

      {filetype === 'xlsx' && (
        <FormControl className={classes.formControl}>
          <Box
            className={classes.box}
            border={1}
            borderColor="primary.main"
            borderRadius="borderRadius"
            width={300}
          >
            <Typography>{t('example_download')}</Typography>
            <Button
              variant="contained"
              size="small"
              color="primary"
              startIcon={<GetAppIcon />}
              className={classes.button}
              onClick={downloadFile}
              disabled={!Roles.userIsInRole(Meteor.userId(), 'school')}
            >
              {t('example')}
            </Button>
            <FormHelperText>{t('example_note')}</FormHelperText>
          </Box>
        </FormControl>
      )}

      <FormControl className={classes.formControl}>
        <Input
          className={classes.fileInput}
          color="primary"
          type="file"
          onChange={e => setFile(e.target.files[0])}
          inputProps={{
            accept: filetype === 'txt' ? '.csv, .txt' : '.xlsx, .xls',
          }}
        />
      </FormControl>

      <Button
        className={classes.button}
        variant="outlined"
        color="primary"
        onClick={onSubmit}
      >
        {t('upload')}
      </Button>
    </form>
  );

  return (
    <div>
      <Tooltip title={t('upload')}>
        <IconButton onClick={showModal}>
          <AddBox fontSize="large" color="primary" />
        </IconButton>
      </Tooltip>
      <TransitionModal form={form} isOpen={modalIsOpen} close={closeModal} />
    </div>
  );
};
