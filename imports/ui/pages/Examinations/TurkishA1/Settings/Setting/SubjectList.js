import React from 'react';
import {
  Select,
  MenuItem,
  IconButton,
  Typography,
  FormControl,
  InputLabel,
  TextField,
  Tooltip,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ClearOutlined from '@material-ui/icons/ClearOutlined';
import AddOutlined from '@material-ui/icons/AddOutlined';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  list: {
    margin: theme.spacing(10),
    display: 'inline',
  },
  select: {
    width: '70%',
  },
  row: {
    margin: theme.spacing(0.5, 0),
  },
  subjects_header: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default SubjectList = ({
  sections,
  setSectionName,
  addRow,
  deleteRow,
}) => {
  const [t, i18n] = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.list}>
      <div className={classes.subjects_header}>
        <Typography variant="h6" color="textSecondary">
          {t('sections')}
        </Typography>
        <Tooltip title={t('add')}>
          <IconButton color="primary" onClick={() => addRow()}>
            <AddOutlined />
          </IconButton>
        </Tooltip>
      </div>
      {sections.map((val, idx) => {
        return (
          <div className={classes.row} key={val.index}>
            <TextField
              className={classes.select}
              label={`${t('section')} ${idx + 1}`}
              value={val.sectionName}
              onChange={e => setSectionName(idx, e.target.value)}
            />
            {idx !== 0 && (
              <Tooltip title={t('delete')}>
                <IconButton color="secondary" onClick={() => deleteRow(val)}>
                  <ClearOutlined />
                </IconButton>
              </Tooltip>
            )}
          </div>
        );
      })}
    </div>
  );
};
