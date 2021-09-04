import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FunctionsIcon from '@material-ui/icons/Functions';
import { Box, Tooltip, Typography } from '@material-ui/core';

import useSnackbars from '../../../../../../api/notifications/snackbarConsumer';
import { Button, IconButton } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { calculateRating } from '../../../../../../api/kbo/percentages/calculateRating';

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

export const CalculateRating = ({ setBlocking, examNumbers, currentYear }) => {
  const classes = useStyles();
  const { showSnackbar } = useSnackbars();
  const [t, i18n] = useTranslation();

  const calculate = async () => {
    setBlocking(true);
    let errorMessage = '';
    examNumbers.map(item => {
      calculateRating({
        t,
        academicYear: currentYear,
        examNumber: item,
      }).catch(value => (errorMessage = value));
    });
    setBlocking(false);
    showSnackbar({
      message: errorMessage || t('done'),
      severity: errorMessage ? 'error' : 'success',
    });
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
