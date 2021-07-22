import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';

import { IconButton } from '@material-ui/core';

export default function AlertDialog({
  title,
  text,
  isOpen,
  close,
  proceed,
  setAlert,
}) {
  const [open, setOpen] = useState(true);

  const wrappedClose = () => {
    if (close) close();
    setOpen(false);
    setAlert(null);
  };

  const wrappedProceed = () => {
    proceed();
    setOpen(false);
    setAlert(null);
  };

  return (
    <div>
      <Dialog
        open={isOpen ? isOpen : open}
        onClose={wrappedClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton color="secondary" onClick={wrappedClose}>
            <CloseIcon />
          </IconButton>
          <IconButton color="primary" onClick={wrappedProceed} autoFocus>
            <DoneIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
