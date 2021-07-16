import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Typography } from '@material-ui/core';
import TransitionModal from '../../../components/TransitionModal/TransitionModal';

import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';

const useStyles = makeStyles(theme => ({
  buttons: {
    margin: theme.spacing(3, 0),
    alignItems: 'right',
  },
  formControl: {
    alignItems: 'center',
  },
}));

export default CreateRole = () => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const showModal = () => setModalIsOpen(true);

  const closeModal = () => setModalIsOpen(false);

  const onSubmit = () => {};

  const form = (
    <form onSubmit={onSubmit}>
      <FormControl className={classes.formControl}>
        <Typography variant="subtitle1">{t('create_role')}</Typography>
        <TextField id="standard-basic" label={t('role_title')} />

        <div className={classes.buttons}>
          <Button variant="outlined" onClick={onSubmit}>
            {t('cancel')}
          </Button>
          <Button variant="outlined" color="primary" onClick={onSubmit}>
            <CheckOutlinedIcon />
            {t('add')}
          </Button>
        </div>
      </FormControl>
    </form>
  );

  return (
    <div>
      <Button variant="outlined" onClick={showModal}>
        {t('create_role')}
      </Button>
      <TransitionModal form={form} isOpen={modalIsOpen} close={closeModal} />
    </div>
  );
};
