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
  turkishA1SettingsDelete,
  turkishA1SettingsInsert,
} from '../../../../../../api/turkishA1/settings/methods';
import useSnackbars from '../../../../../../api/notifications/snackbarConsumer';
import useDialogs from '../../../../../../api/dialogs/dialogConsumer';

import { CurrentYear } from '../../../../../../api/academicYears/academicYears';

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

  const [sections, setSections] = useState(
    setting
      ? setting.sections.map(s => {
          return { index: Math.random(), sectionName: s.sectionName };
        })
      : [{ index: Math.random(), sectionName: '' }]
  );

  const reset = () => {
    setExamNumber(1);
    setSections([{ index: Math.random(), sectionName: '' }]);
  };

  const addRow = e => {
    setSections(old => [...old, { index: Math.random(), sectionName: '' }]);
  };

  const deleteRow = record => {
    setSections(sections.filter(r => r !== record));
  };

  const setSectionName = (idx, value) => {
    let old = [...sections];
    old[idx].sectionName = value;
    setSections(old);
  };

  const addSetting = () => {
    turkishA1SettingsInsert.call(
      {
        academicYear: CurrentYear,
        examNumber,
        grade,
        sections: sections.map(e => {
          return { sectionName: e.sectionName };
        }),
      },
      (err, res) => {
        if (err) showSnackbar({ message: err.message, severity: 'error' });
        else {
          showSnackbar({ message: t('done'), severity: 'success' });
          if (res === 'insert') reset();
        }
      }
    );
  };

  const deleteSetting = () => {
    turkishA1SettingsDelete.call({ _id: setting._id }, (err, res) => {
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

        <Divider variant="middle" />

        <SubjectList
          sections={sections}
          addRow={addRow}
          deleteRow={deleteRow}
          setSectionName={setSectionName}
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
          {setting ? t('save') : t('add')}
        </Button>
      </StyledCardActions>
    </Card>
  );
};
