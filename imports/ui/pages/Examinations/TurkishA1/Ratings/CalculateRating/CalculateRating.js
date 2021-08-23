import React, { useState } from 'react';

import readXlsxFile from 'read-excel-file';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { makeStyles } from '@material-ui/core/styles';
import FunctionsIcon from '@material-ui/icons/Functions';
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
import { calculateRating } from '../../../../../../api/turkishA1/results/calculateRating';

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

export const CalculateRating = ({ setBlocking, settings, currentYear }) => {
  const classes = useStyles();
  const { showSnackbar } = useSnackbars();
  const [t, i18n] = useTranslation();

  const calculate = async () => {
    setBlocking(true);
    settings
      .map(e => e.examNumber)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map(item => {
        calculateRating({
          t,
          academicYear: currentYear,
          examNumber: item,
          settings,
        })
          .then(value => showSnackbar({ message: value, severity: 'success' }))
          .catch(value => showSnackbar({ message: value, severity: 'error' }));
      });
    setBlocking(false);
  };

  return (
    <div>
      <Tooltip title={t('calculate')}>
        <IconButton onClick={calculate}>
          <FunctionsIcon fontSize="large" color="primary" />
        </IconButton>
      </Tooltip>
    </div>
  );
};
