import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import Select from '@material-ui/core/Select';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddIcon from '@material-ui/icons/Add';

import Button from '@material-ui/core/Button';

import { kboKeysInsert } from '../../../../../../api/kbo/keys/methods';
import TransitionModal from '../../../../../components/TransitionModal/TransitionModal';
import FormControl from '@material-ui/core/FormControl';
import { Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';

import MenuItem from '@material-ui/core/MenuItem';

import useSnackbars from '../../../../../../api/notifications/snackbarConsumer';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(3, 0),
    alignItems: 'right',
  },
  root: {
    width: '20rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  selectLabel: {
    padding: theme.spacing(0.5),
  },
  select: {
    width: '90%',
  },
  textfield: {
    width: '90%',
    padding: theme.spacing(1, 0, 0, 0),
  },
  optionalSelect: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  subjects: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const EXAM_NUMBERS = [1, 2, 3];

export default AddKey = ({ initialData, icon, subjects, currentYear }) => {
  const classes = useStyles();
  const [t, i18n] = useTranslation();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [examNumber, setExamNumber] = useState(
    initialData ? initialData.examNumber : ''
  );
  const [variant, setVariant] = useState(
    initialData ? initialData.variant : ''
  );
  const [keys, setKeys] = useState(
    initialData ? initialData.keys[0]?.keys : ''
  );
  const [subjectId, setSubjectId] = useState(
    initialData ? initialData.keys[0]?.subjectId : ''
  );

  const { showSnackbar } = useSnackbars();

  const showModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const onSubmit = event => {
    event.preventDefault(event);

    kboKeysInsert.call(
      {
        academicYear: currentYear,
        examNumber,
        variant,
        keys: [{ subjectId, keys }],
      },
      (err, res) => {
        if (err) {
          showSnackbar({ message: err.message, severity: 'error' });
        } else {
          // reset();
          showSnackbar({ message: t('done'), severity: 'success' });
        }
      }
    );
  };

  form = (
    <form onSubmit={onSubmit} className={classes.root}>
      <Typography
        className={classes.selectLabel}
        variant="subtitle1"
        color="textSecondary"
      >
        {t('exam_number')}
      </Typography>
      <Select
        label="exam_number"
        className={classes.select}
        value={examNumber}
        onChange={e => setExamNumber(e.target.value)}
      >
        {EXAM_NUMBERS.map(item => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>

      <TextField
        className={classes.textfield}
        id="standard-basic"
        label={t('variant')}
        value={variant}
        onChange={e => setVariant(e.target.value)}
      />

      <div className={classes.subjects}>
        <Typography
          className={classes.selectLabel}
          variant="subtitle1"
          color="textSecondary"
        >
          {t('subject')}
        </Typography>

        <Select
          label="subject"
          className={classes.select}
          value={subjectId}
          onChange={e => {
            setSubjectId(e.target.value);
          }}
        >
          {subjects.map(item => (
            <MenuItem key={item.subjectId} value={item.subjectId}>
              {eval(`item.name_${i18n.language}`)}
            </MenuItem>
          ))}
        </Select>

        <TextField
          className={classes.textfield}
          id="standard-basic"
          label={t('answer_keys')}
          value={keys}
          onChange={e => setKeys(e.target.value)}
        />
      </div>

      <Button
        color="primary"
        variant="outlined"
        onClick={onSubmit}
        className={classes.button}
      >
        {t('save')}
      </Button>
    </form>
  );

  return (
    <div>
      {icon === 'edit' ? (
        <Tooltip title={t('edit')}>
          <IconButton onClick={showModal}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button variant="outlined" color="primary" onClick={showModal}>
          {t('add')}
        </Button>
      )}
      <TransitionModal form={form} isOpen={modalIsOpen} close={closeModal} />
    </div>
  );
};
