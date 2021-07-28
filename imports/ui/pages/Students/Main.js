import React, { useEffect } from 'react';
import { userIsInRole } from '../../../api/users/methods';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Students from '../../../api/students/students';
import { Box, Grid, IconButton, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Subjects from '../../../api/subjects/subjects';
import TableIcons from '../../components/MaterialTable/TableIcons';
import { Tooltip } from '@material-ui/core';
import { MTableToolbar } from 'material-table';

import useDrawer from '../../../api/drawer/drawerConsumer';
import MaterialTable from 'material-table';
import Schools from '../../../api/schools/schools';
import EditOutlined from '@material-ui/icons/EditOutlined';
import TransferWithinAStationOutlinedIcon from '@material-ui/icons/TransferWithinAStationOutlined';
import {
  studentsDeleteByStudentId,
  studentsInsert,
} from '../../../api/students/methods';
import useSnackbars from '../../../api/notifications/snackbarConsumer';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem 0 2rem',
  },
  actions: {
    display: 'flex',
  },
}));

const Main = props => {
  const classes = useStyles();
  const [t, i18n] = useTranslation();
  const { setDrawer, setDrawerTitle } = useDrawer();
  const { showSnackbar } = useSnackbars();

  useEffect(() => {
    setDrawer([]);
    setDrawerTitle('');
  }, [i18n.language]);

  const lookupParser = fieldName => {
    return Meteor.apply('students.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      return { ...obj, [item]: item };
    }, {});
  };

  const lookupSchoolParser = fieldName => {
    return Meteor.apply('students.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      let school = props.schools.find(e => e.schoolId === item);
      let schoolName = school ? school.shortName : '';
      return { ...obj, [schoolName]: schoolName };
    }, {});
  };

  const COLUMNS = [
    {
      title: t('school'),
      field: 'schoolName',
      lookup: lookupSchoolParser('schoolId'),
      editable: 'onAdd',
    },
    {
      title: t('student_id'),
      field: 'studentId',
      editable: 'onAdd',
    },
    {
      title: t('grade'),
      field: 'grade',
      lookup: lookupParser('grade'),
      editable: 'onAdd',
    },
    {
      title: t('division'),
      field: 'division',
      lookup: lookupParser('division'),
    },
    {
      title: t('surname'),
      field: 'surname',
    },
    {
      title: t('name'),
      field: 'name',
    },
    {
      title: t('language_group'),
      field: 'languageGroup',
      lookup: lookupParser('languageGroup'),
    },
    {
      title: t('olympiad_subject'),
      field: 'olympiad',
      lookup: lookupParser('olympiad'),
    },
    {
      title: t('elective_group'),
      field: 'electiveGroup',
      lookup: lookupParser('electiveGroup'),
    },
    {
      title: t('level'),
      field: 'level',
      lookup: lookupParser('level'),
    },
  ];

  return (
    <div>
      <MaterialTable
        title={t('students').toUpperCase()}
        columns={COLUMNS}
        data={props.students.map(result => {
          let school = props.schools.find(e => e.schoolId === result.schoolId);
          let schoolName = school ? school.shortName : '';
          let returnObject = {
            schoolName,
            studentId: result.studentId,
            grade: result.grade,
            division: result.division,
            surname: result.surname,
            name: result.name,
            languageGroup: result.languageGroup,
            olympiad: result.olympiad,
            electiveGroup: result.electiveGroup,
            level: result.level,
          };
          return returnObject;
        })}
        icons={TableIcons}
        options={{
          // search: false,
          // paging: false,
          filtering: true,
          exportButton: {
            csv: true,
            pdf: false,
          },
          actionsColumnIndex: -1,
        }}
        localization={{
          toolbar: {
            exportCSVName: t('export_csv'),
            exportTitle: t('export'),
          },
          header: {
            actions: t('actions'),
          },
        }}
        // actions={[
        //   {
        //     icon: TableIcons.Edit,
        //     tooltip: t('edit'),
        //     onClick: (event, rowData) => alert('You saved ' + rowData.name),
        //   },
        //   rowData => ({
        //     icon: TableIcons.Transfer,
        //     tooltip: t('transfer'),
        //     onClick: (event, rowData) =>
        //       confirm('You want to delete ' + rowData.name),
        //   }),
        //   {
        //     icon: TableIcons.Add,
        //     tooltip: t('add'),
        //     isFreeAction: true,
        //     onClick: event => alert('You want to add a new row'),
        //   },
        // ]}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              newData.schoolId = props.schools.find(
                e => e.shortName === newData.schoolName
              ).schoolId;
              delete newData['schoolName'];

              setTimeout(() => {
                studentsInsert.call(newData, (err, res) => {
                  if (err) {
                    showSnackbar({ message: err.message, severity: 'error' });
                    reject();
                  } else {
                    showSnackbar({ message: t('done'), severity: 'success' });
                    resolve();
                  }
                });
              }, 500);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                newData.schoolId = props.schools.find(
                  e => e.shortName === newData.schoolName
                ).schoolId;
                delete newData['schoolName'];
                console.log(newData);
                studentsInsert.call(newData, (err, res) => {
                  if (err) {
                    showSnackbar({ message: err.message, severity: 'error' });
                    reject();
                  } else {
                    showSnackbar({ message: t('done'), severity: 'success' });
                    resolve();
                  }
                });
              }, 500);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                studentsDeleteByStudentId.call(
                  { studentId: oldData.studentId },
                  (err, res) => {
                    if (err) {
                      showSnackbar({ message: err.message, severity: 'error' });
                      reject();
                    } else {
                      showSnackbar({ message: t('done'), severity: 'success' });
                      resolve();
                    }
                  }
                );
              }, 500);
            }),
        }}
      />
    </div>
  );
};

export default withTracker(props => {
  const studentsSub = Meteor.subscribe('students.all');
  const students = Students.find().fetch();
  const studentssReady = studentsSub.ready() && !!students;

  const subjectsSub = Meteor.subscribe('subjects.all');
  const subjects = Subjects.find().fetch();

  const schoolSub = Meteor.subscribe('schools.all');
  const schools = Schools.find().fetch();

  return {
    students,
    subjects,
    schools,
  };
})(Main);
