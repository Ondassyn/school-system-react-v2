import React, { useState } from 'react';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { btsKeysDelete } from '../../../../../api/bts/btsKeys/methods';
import useDialogs from '../../../../../api/dialogs/dialogConsumer';
import useSnackbars from '../../../../../api/notifications/snackbarConsumer';

import './style.scss';
export default DeleteKey = props => {
  const { showDialog } = useDialogs();
  const { showSnackbar } = useSnackbars();

  const proceed = () => {
    btsKeysDelete.call({ _id: props._id }, (err, res) => {
      if (err) {
        showSnackbar({ message: err.message, severity: 'error' });
      } else {
        showSnackbar({ message: 'Deleted successfully', severity: 'success' });
      }
    });
  };

  return (
    <div>
      <DeleteOutlineIcon
        className="icon"
        onClick={() => showDialog({ text: 'Are you sure?', proceed })}
      />
    </div>
  );
};
