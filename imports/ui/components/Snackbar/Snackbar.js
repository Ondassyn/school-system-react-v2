import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function CustomSnackbar({ message, isOpen, close, severity }) {
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={isOpen ? isOpen : true}
      autoHideDuration={6000}
      onClose={close}
      key={vertical + horizontal}
    >
      <Alert onClose={close} severity={severity ? severity : 'success'}>
        {message}
      </Alert>
    </Snackbar>
  );
}
