import React, { useState, useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import Select from '@material-ui/core/Select';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddIcon from '@material-ui/icons/Add';

import Button from '@material-ui/core/Button';

import { turkishA1KeysInsert } from '../../../../../../api/turkishA1/keys/methods';
import TransitionModal from '../../../../../components/TransitionModal/TransitionModal';
import FormControl from '@material-ui/core/FormControl';
import { Typography } from '@material-ui/core';
import { TextField } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import { Tooltip } from '@material-ui/core';

import MenuItem from '@material-ui/core/MenuItem';

import useSnackbars from '../../../../../../api/notifications/snackbarConsumer';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { turkishA1SettingsGetDistinct } from '../../../../../../api/turkishA1/settings/methods';
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

export default AddKey = ({
  initialData,
  settings,
  subjects,
  icon,
  currentYear,
}) => {
  const classes = useStyles();
  const [t, i18n] = useTranslation();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [grade, setGrade] = useState(initialData ? initialData.grade : '');
  const [examNumber, setExamNumber] = useState(
    initialData ? initialData.examNumber : ''
  );
  const [variant, setVariant] = useState(
    initialData ? initialData.variant : ''
  );
  const [keys, setKeys] = useState(
    initialData
      ? initialData.keys.map(e => {
          return { subjectId: e.subjectId, keys: e.keys };
        })
      : [{ subjectId: '', keys: '' }]
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

    turkishA1KeysInsert.call(
      {
        academicYear: currentYear,
        examNumber,
        grade,
        variant,
        keys: keys.map(e => {
          return { subjectId: e.subjectId, keys: e.keys };
        }),
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
        {settings
          .map(e => e.examNumber)
          .filter((value, index, self) => self.indexOf(value) === index)
          .map(item => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))}
      </Select>

      <Typography
        className={classes.selectLabel}
        variant="subtitle1"
        color="textSecondary"
      >
        {t('grade')}
      </Typography>
      <Select
        label="grade"
        className={classes.select}
        value={grade}
        onChange={e => setGrade(e.target.value)}
      >
        {settings
          .map(e => e.grade)
          .filter((value, index, self) => self.indexOf(value) === index)
          .map(item => (
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

      {!!examNumber && !!grade ? (
        <div className={classes.subjects}>
          <Typography
            className={classes.selectLabel}
            variant="subtitle1"
            color="textSecondary"
          >
            {t('subjects')}
          </Typography>
          {settings
            .find(e => e.grade === grade && e.examNumber === examNumber)
            ?.subjects?.map(item => (
              <TextField
                className={classes.textfield}
                label={eval(
                  `subjects.find(el => el.subjectId === item.subjectId).name_${i18n.language}`
                )}
                key={item.subjectId}
                value={
                  keys.some(e => e.subjectId === item.subjectId)
                    ? keys.find(e => e.subjectId === item.subjectId)?.keys
                    : ''
                }
                onChange={e => {
                  if (keys.some(el => el.subjectId === item.subjectId)) {
                    const keysCopy = [...keys];
                    keysCopy.find(el => el.subjectId === item.subjectId).keys =
                      e.target.value;
                    setKeys(keysCopy);
                  } else {
                    setKeys([
                      ...keys,
                      { subjectId: item.subjectId, keys: e.target.value },
                    ]);
                  }
                }}
              />
            ))}
        </div>
      ) : (
        undefined
      )}

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
