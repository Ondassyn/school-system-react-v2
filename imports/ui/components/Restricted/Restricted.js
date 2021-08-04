import React from 'react';
import BlockIcon from '@material-ui/icons/Block';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export default Restricted = () => {
  const classes = useStyles();
  const [t, i18n] = useTranslation();

  return (
    <div className={classes.root}>
      <BlockIcon color="secondary" fontSize="large" />
      <Box m={1} />
      <Typography variant="h5" color="textSecondary">
        {t('no_permission')}{' '}
      </Typography>
    </div>
  );
};
