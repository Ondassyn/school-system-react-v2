import React from 'react';
import { Select, MenuItem, IconButton, Typography } from '@material-ui/core';
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
  subjects,
  subjectList,
  setSubjectId,
  addRow,
  deleteRow,
}) => {
  const [t, i18n] = useTranslation();
  const classes = useStyles();

  return (
    <div className={classes.list}>
      <div className={classes.subjects_header}>
        <Typography variant="h6" color="textSecondary">
          {t('subjects')}
        </Typography>
        <IconButton color="primary" onClick={() => addRow()}>
          <AddOutlined />
        </IconButton>
      </div>
      {subjectList.map((val, idx) => {
        return (
          <div className={classes.row} key={val.index}>
            <Select
              className={classes.select}
              value={
                val.subjectId
                  ? subjects.find(e => e.subjectId === val.subjectId)?.subjectId
                  : ''
              }
              onChange={e => setSubjectId(idx, e.target.value)}
            >
              {subjects.map(e => (
                <MenuItem key={e.subjectId} value={e.subjectId}>
                  {eval(`e.name_${i18n.language}`)}
                </MenuItem>
              ))}
            </Select>

            {idx !== 0 && (
              <IconButton color="secondary" onClick={() => deleteRow(val)}>
                <ClearOutlined />
              </IconButton>
            )}
          </div>
        );
      })}
    </div>
  );
};
