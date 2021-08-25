import React, { useState } from 'react';

import readXlsxFile from 'read-excel-file';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { makeStyles } from '@material-ui/core/styles';
import FunctionsIcon from '@material-ui/icons/Functions';
import { Tooltip } from '@material-ui/core';

import useSnackbars from '../../../../../../api/notifications/snackbarConsumer';
import { Button, IconButton } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { userIsInRole } from '../../../../../../api/users/methods';
import { calculateRating } from '../../../../../../api/ielts/results/calculateRating';

const useStyles = makeStyles(theme => ({}));

export const CalculateRating = ({ setBlocking }) => {
  const classes = useStyles();
  const { showSnackbar } = useSnackbars();
  const [t, i18n] = useTranslation();

  const calculate = async () => {
    setBlocking(true);

    calculateRating({
      t,
    })
      .then(value => showSnackbar({ message: value, severity: 'success' }))
      .catch(value => showSnackbar({ message: value, severity: 'error' }));
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
