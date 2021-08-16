import React, { useState } from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { IconButton } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';
import { turkishA1KeysDelete } from '../../../../../../api/turkishA1/keys/methods';
import useDialogs from '../../../../../../api/dialogs/dialogConsumer';
import useSnackbars from '../../../../../../api/notifications/snackbarConsumer';
import { useTranslation } from 'react-i18next';

export default DeleteKey = ({ _id }) => {
  const { showDialog } = useDialogs();
  const { showSnackbar } = useSnackbars();
  const [t, i18n] = useTranslation();

  const proceed = () => {
    turkishA1KeysDelete.call({ _id }, (err, res) => {
      if (err) {
        showSnackbar({ message: err.message, severity: 'error' });
      } else {
        showSnackbar({ message: t('done'), severity: 'success' });
      }
    });
  };

  return (
    <div>
      <Tooltip title={t('delete')}>
        <IconButton
          onClick={() =>
            showDialog({ text: t('delete_confirmation'), proceed })
          }
        >
          <DeleteOutlineIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};
