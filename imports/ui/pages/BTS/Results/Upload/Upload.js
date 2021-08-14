import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AddBox from '@material-ui/icons/AddBox';
import TransitionModal from '../../../../components/TransitionModal/TransitionModal';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Tooltip } from '@material-ui/core';

import Input from '@material-ui/core/Input';

import { upload } from '../../../../../api/bts/results/upload';
import useSnackbars from '../../../../../api/notifications/snackbarConsumer';
import { Button, IconButton } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

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
    margin: theme.spacing(2),
  },
}));

export const Upload = ({ setBlocking, settings, currentYear }) => {
  const classes = useStyles();
  const { showSnackbar } = useSnackbars();
  const [t, i18n] = useTranslation();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [examNumber, setExamNumber] = useState('');
  const [day, setDay] = useState('');
  const [file, setFile] = useState(null);

  const showModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const processData = async data => {
    if (!data) {
      showSnackbar({ message: t('no_data'), severity: 'error' });
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

    if (!day) {
      showSnackbar({ message: 'day_not_selected', severity: 'error' });
      return;
    }

    closeModal();
    setBlocking(true);
    await upload({ data, academicYear: currentYear, examNumber, day })
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
    let fileReader = new FileReader();
    fileReader.onloadend = () => processData(fileReader.result);
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
        <InputLabel>{t('day')}</InputLabel>
        <Select value={day} onChange={e => setDay(e.target.value)}>
          {settings
            .map(e => e.day)
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
        <Input
          className={classes.fileInput}
          color="primary"
          type="file"
          onChange={e => setFile(e.target.files[0])}
          inputProps={{ accept: '.csv, .txt' }}
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
