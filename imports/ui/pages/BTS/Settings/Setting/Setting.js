import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  makeStyles,
  ThemeProvider,
  withStyles,
} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  FormControl,
  Select,
  TextField,
  InputLabel,
  FormLabel,
  IconButton,
  Divider,
} from '@material-ui/core';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

import SubjectList from './SubjectList';
import {
  btsSettingsDelete,
  btsSettingsInsert,
} from '../../../../../api/bts/settings/methods';
import useSnackbars from '../../../../../api/notifications/snackbarConsumer';
import useDialogs from '../../../../../api/dialogs/dialogConsumer';

import { CurrentYear } from '../../../../../api/academicYears/academicYears';

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: 120,
    margin: theme.spacing(0, 0, 2, 0),
  },
}));

const StyledCardActions = withStyles(theme => ({
  root: { margin: theme.spacing(0, 1, 1, 0), justifyContent: 'flex-end' },
}))(CardActions);

export default Setting = ({ subjects, setting, grade }) => {
  const classes = useStyles();
  const [t, i18n] = useTranslation();
  const { showSnackbar } = useSnackbars();
  const { showDialog } = useDialogs();

  const [examNumber, setExamNumber] = useState(
    setting ? setting.examNumber : 1
  );
  const [day, setDay] = useState(setting ? setting.day : 1);
  const [subjectList, setSubjectList] = useState(
    setting
      ? setting.subjects.map(s => {
          return { index: Math.random(), subjectId: s.subjectId };
        })
      : [{ index: Math.random(), subjectId: '' }]
  );

  const reset = () => {
    setExamNumber(1);
    setDay(1);
    setSubjectList([{ index: Math.random(), subjectId: '' }]);
  };

  const addRow = e => {
    setSubjectList(old => [...old, { index: Math.random(), subjectId: '' }]);
  };

  const deleteRow = record => {
    setSubjectList(subjectList.filter(r => r !== record));
  };

  const setSubjectId = (idx, value) => {
    let old = [...subjectList];
    old[idx].subjectId = value;
    setSubjectList(old);
  };

  const addSetting = () => {
    btsSettingsInsert.call(
      {
        academicYear: CurrentYear,
        examNumber,
        day,
        grade,
        subjects: subjectList.map(e => {
          return { subjectId: e.subjectId };
        }),
      },
      (err, res) => {
        if (err) showSnackbar({ message: err.message, severity: 'error' });
        else {
          showSnackbar({ message: t('done'), severity: 'success' });
          reset();
        }
      }
    );
  };

  const deleteSetting = () => {
    btsSettingsDelete.call({ _id: setting._id }, (err, res) => {
      if (err) showSnackbar({ message: err.message, severity: 'error' });
      else showSnackbar({ message: t('done'), severity: 'success' });
    });
  };

  return (
    <Card className={classes.root} variant="outlined">
      <CardContent>
        <Typography variant="subtitle1">
          {t('number')}
          <IconButton
            onClick={() => {
              examNumber > 1 && setExamNumber(number => --number);
            }}
          >
            <ChevronLeft />
          </IconButton>
          {examNumber}
          <IconButton onClick={() => setExamNumber(number => ++number)}>
            <ChevronRight />
          </IconButton>
        </Typography>
        <FormControl className={classes.formControl}>
          <Typography variant="subtitle1">
            {t('day')}
            <IconButton
              onClick={() => {
                day > 1 && setDay(number => --number);
              }}
            >
              <ChevronLeft />
            </IconButton>
            {day}
            <IconButton onClick={() => setDay(number => ++number)}>
              <ChevronRight />
            </IconButton>
          </Typography>
        </FormControl>

        <Divider variant="middle" />

        <SubjectList
          subjects={subjects}
          subjectList={subjectList}
          addRow={addRow}
          deleteRow={deleteRow}
          setSubjectId={setSubjectId}
        />
      </CardContent>
      <StyledCardActions>
        <Button
          variant="outlined"
          color="secondary"
          disabled={!setting}
          onClick={() =>
            showDialog({
              text: t('delete_confirmation'),
              proceed: deleteSetting,
            })
          }
        >
          {t('delete')}
        </Button>
        <Button variant="outlined" color="primary" onClick={() => addSetting()}>
          {t('add')}
        </Button>
      </StyledCardActions>
    </Card>
  );
};
