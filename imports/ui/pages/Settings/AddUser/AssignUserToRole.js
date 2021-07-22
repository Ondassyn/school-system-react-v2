import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Typography } from '@material-ui/core';
import TransitionModal from '../../../components/TransitionModal/TransitionModal';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import useSnackbars from '../../../../api/notifications/snackbarConsumer';

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';

import { addUsersToRoles } from '../../../../api/users/methods';

const useStyles = makeStyles(theme => ({
  buttons: {
    margin: theme.spacing(3, 0),
    alignItems: 'right',
  },
  formControl: {
    alignItems: 'center',
  },
}));

export default AssignUserToRole = () => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const { showSnackbar } = useSnackbars();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');

  const showModal = () => setModalIsOpen(true);

  const closeModal = () => setModalIsOpen(false);

  const onSubmit = () => {
    if (!role || !userId) {
      showSnackbar({ message: t('empty_field'), severity: 'error' });
      return;
    }

    addUsersToRoles.call({ userId, role }, (err, res) => {
      if (err)
        showSnackbar({
          message: err?.message ?? t('something_wrong'),
          severity: 'error',
        });
      else showSnackbar({ message: t('done'), severity: 'success' });
    });
    closeModal();
  };

  const form = (
    <form onSubmit={onSubmit}>
      <FormControl className={classes.formControl}>
        <Typography variant="subtitle1">{t('assign_role')}</Typography>
        <TextField
          label={t('user_id')}
          onChange={e => setUserId(e.target.value)}
        />
        <TextField
          label={t('role_title')}
          onChange={e => setRole(e.target.value)}
        />

        <div className={classes.buttons}>
          <Button variant="outlined" onClick={closeModal}>
            {t('cancel')}
          </Button>
          <Button variant="outlined" color="primary" onClick={onSubmit}>
            <CheckOutlinedIcon />
            {t('assign')}
          </Button>
        </div>
      </FormControl>
    </form>
  );

  return (
    <div>
      <Button variant="outlined" onClick={showModal}>
        {t('assign_role')}
      </Button>
      <TransitionModal form={form} isOpen={modalIsOpen} close={closeModal} />
    </div>
  );
};
