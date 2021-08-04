import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, MenuItem, Select, Typography } from '@material-ui/core';
import TransitionModal from '../../../components/TransitionModal/TransitionModal';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import useSnackbars from '../../../../api/notifications/snackbarConsumer';

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';

import {
  addUsersToRoles,
  addUserWithRole,
} from '../../../../api/users/methods';
import { resetWarningCache } from 'prop-types';

const useStyles = makeStyles(theme => ({
  buttons: {
    margin: theme.spacing(3, 0),
    alignItems: 'right',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  selectLabel: {
    padding: theme.spacing(1),
  },
  select: {
    width: '90%',
  },
  optionalSelect: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default AddUser = ({ schools }) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const { showSnackbar } = useSnackbars();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordDuplicate, setPasswordDuplicate] = useState('');
  const [schoolId, setSchoolId] = useState('');

  const showModal = () => setModalIsOpen(true);

  const closeModal = () => {
    setModalIsOpen(false);
    reset();
  };

  const reset = () => {
    setUsername('');
    setPasswordDuplicate('');
    setPassword('');
    setRole('');
  };

  const onSubmit = () => {
    if (!role || !username || !password) {
      showSnackbar({ message: t('empty_field'), severity: 'error' });
      return;
    }

    if (password !== passwordDuplicate) {
      showSnackbar({ message: t('passwords_do_not_match'), severity: 'error' });
      return;
    }

    addUserWithRole.call({ username, password, role, schoolId }, (err, res) => {
      if (err) {
        showSnackbar({ message: err.message, severity: 'error' });
      } else {
        showSnackbar({ message: t('done'), severity: 'success' });
      }
    });

    closeModal();
  };

  const form = (
    <form onSubmit={onSubmit} className={classes.root}>
      {/* <FormControl className={classes.formControl}> */}
      <Typography variant="h6">{t('add_user')}</Typography>
      <TextField
        label={t('username')}
        onChange={e => setUsername(e.target.value)}
      />
      <TextField
        label={t('password')}
        type="password"
        onChange={e => setPassword(e.target.value)}
      />
      <TextField
        label={t('reenter_password')}
        type="password"
        onChange={e => setPasswordDuplicate(e.target.value)}
      />
      <Typography
        className={classes.selectLabel}
        variant="subtitle1"
        color="textSecondary"
      >
        {t('role')}
      </Typography>
      <Select
        label="role"
        className={classes.select}
        value={role}
        onChange={e => setRole(e.target.value)}
      >
        {Roles.getAllRoles()
          .fetch()
          .map(e => (
            <MenuItem key={e._id} value={e._id}>
              {e._id}
            </MenuItem>
          ))}
      </Select>
      {role === 'school' && (
        <div className={classes.optionalSelect}>
          <Typography
            className={classes.selectLabel}
            variant="subtitle1"
            color="textSecondary"
          >
            {t('school')}
          </Typography>
          <Select
            label="schoolId"
            className={classes.select}
            value={schoolId}
            onChange={e => setSchoolId(e.target.value)}
          >
            {schools.map(e => (
              <MenuItem key={e.schoolId} value={e.schoolId}>
                {e.shortName}
              </MenuItem>
            ))}
          </Select>
        </div>
      )}
      <div className={classes.buttons}>
        <Button variant="outlined" onClick={closeModal}>
          {t('cancel')}
        </Button>
        <Button variant="outlined" color="primary" onClick={onSubmit}>
          <CheckOutlinedIcon />
          {t('add')}
        </Button>
      </div>
      {/* </FormControl> */}
    </form>
  );

  return (
    <div>
      <Button variant="outlined" onClick={showModal}>
        {t('add_user')}
      </Button>
      <TransitionModal form={form} isOpen={modalIsOpen} close={closeModal} />
    </div>
  );
};
