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

import { uploadTxt } from '../../../../../../api/kbo/results/uploadTxt';
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
  currentYear,
  results,
  students,
  exam_numbers,
}) => {
  const classes = useStyles();
  const { showSnackbar } = useSnackbars();
  const [t, i18n] = useTranslation();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [examNumber, setExamNumber] = useState('');
  const [file, setFile] = useState(null);

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
    await uploadTxt({
      t,
      data,
      academicYear: currentYear,
      examNumber,
    })
      .then(value => showSnackbar({ message: value, severity: 'success' }))
      .catch(value => showSnackbar({ message: value, severity: 'error' }));
    setBlocking(false);
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

    let fileReader = new FileReader();
    fileReader.onloadend = () => processTxt(fileReader.result);
    fileReader.readAsText(file);
  };

  const form = (
    <form onSubmit={onSubmit} className={classes.formRoot}>
      <FormControl className={classes.formControl}>
        <InputLabel>{t('exam_number')}</InputLabel>
        <Select
          value={examNumber}
          onChange={e => setExamNumber(e.target.value)}
        >
          {exam_numbers.map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
        {/* <FormHelperText>Placeholder</FormHelperText> */}
      </FormControl>

      <FormControl className={classes.formControl}>
        <Input
          className={classes.fileInput}
          color="primary"
          type="file"
          onChange={e => setFile(e.target.files[0])}
          inputProps={{
            accept: '.csv, .txt',
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
