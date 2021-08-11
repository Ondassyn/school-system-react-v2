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
import useDialogs from '../../../api/dialogs/dialogConsumer';
import MaterialTable from 'material-table';
import Schools from '../../../api/schools/schools';
import TransferWithinAStationOutlinedIcon from '@material-ui/icons/TransferWithinAStationOutlined';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import {
  studentsDeleteByStudentId,
  studentsInsert,
} from '../../../api/students/methods';
import useSnackbars from '../../../api/notifications/snackbarConsumer';
import { studentTransfersInsert } from '../../../api/studentTransfers/methods';

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
  const { showDialog } = useDialogs();

  const TITLE = 'students';

  const DRAWER_TITLE = {
    title: t(TITLE).toUpperCase(),
    link: '/' + TITLE,
  };

  const DRAWER_MENU = [
    {
      title: t('current_list'),
      icon: <PeopleAltIcon />,
      link: '/' + TITLE,
    },
    {
      title: t('transfer_list'),
      icon: <TransferWithinAStationOutlinedIcon />,
      link: '/' + TITLE + '/transfers',
    },
  ];

  useEffect(() => {
    setDrawer(DRAWER_MENU);
    setDrawerTitle(DRAWER_TITLE);
  }, [i18n.language]);

  useEffect(() => {
    if (!Meteor.userId()) props.history.push('/signin');
  });

  if (!Meteor.userId()) return null;

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

  const lookupSubjectParser = fieldName => {
    return Meteor.apply('students.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      let subject = props.subjects.find(e => e.subjectId === item);
      let subjectName = subject ? subject[`name_${i18n.language}`] : '';
      return { ...obj, [subjectName]: subjectName };
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
      editable: 'never',
    },
    {
      title: t('grade'),
      field: 'grade',
      // lookup: lookupParser('grade'),
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
      field: 'subjectName',
      lookup: lookupSubjectParser('olympiad'),
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
        title={t('current_list').toUpperCase()}
        columns={COLUMNS}
        data={props.students.map(result => {
          let school = props.schools.find(e => e.schoolId === result.schoolId);
          let schoolName = school ? school.shortName : '';
          let subject = props.subjects.find(
            e => e.subjectId === result.olympiad
          );
          let subjectName = subject ? subject[`name_${i18n.language}`] : '';
          let returnObject = {
            schoolName,
            subjectName,
            studentId: result.studentId,
            grade: result.grade,
            division: result.division,
            surname: result.surname,
            name: result.name,
            languageGroup: result.languageGroup,
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
          //   pageSize: 5,
          pageSizeOptions: [5, 10, 20, 50, 100],
        }}
        localization={{
          toolbar: {
            exportCSVName: t('export_csv'),
            exportTitle: t('export'),
            searchTooltip: t('search'),
            searchPlaceholder: t('search'),
          },
          header: {
            actions: t('actions'),
          },
          body: {
            emptyDataSourceMessage: t('no_records'),
            addTooltip: t('add'),
            deleteTooltip: t('delete'),
            editTooltip: t('edit'),
            filterRow: {
              filterPlaceholder: t('filter'),
              filterTooltip: t('filter'),
            },
            editRow: {
              deleteText: t('delete_confirmation'),
              cancelTooltip: t('cancel'),
              saveTooltip: t('confirm'),
            },
          },
          pagination: {
            labelRowsSelect: t('rows'),
            labelRowsPerPage: t('rows_per_page'),
            firstTooltip: t('first_page'),
            previousTooltip: t('previous_page'),
            nextTooltip: t('next_page'),
            lastTooltip: t('last_page'),
          },
        }}
        actions={[
          //   {
          //     icon: TableIcons.Edit,
          //     tooltip: t('edit'),
          //     onClick: (event, rowData) => alert('You saved ' + rowData.name),
          //   },
          rowData => ({
            icon: TableIcons.TransferSecondary,
            tooltip: t('transfer'),
            onClick: (event, rowData) =>
              showDialog({
                text: t('transfer_confirmation'),
                proceed: () => {
                  let toInsert = { ...rowData };
                  toInsert.schoolId = props.schools.find(
                    e => e.shortName === toInsert.schoolName
                  ).schoolId;

                  toInsert.olympiad = props.subjects.find(
                    e => e[`name_${i18n.language}`] === toInsert.subjectName
                  ).subjectId;

                  delete toInsert['subjectName'];
                  delete toInsert['schoolName'];
                  delete toInsert['tableData'];

                  studentTransfersInsert
                    .callPromise(toInsert)
                    .then(res => {
                      studentsDeleteByStudentId.call(
                        { studentId: res },
                        (err, res) => {
                          if (err)
                            showSnackbar({
                              message: err.message,
                              severity: 'error',
                            });
                          else
                            showSnackbar({
                              message: t('done'),
                              severity: 'success',
                            });
                        }
                      );
                    })
                    .catch(err =>
                      showSnackbar({
                        message: err.message,
                        severity: 'error',
                      })
                    );
                },
              }),
          }),
          //   {
          //     icon: TableIcons.Add,
          //     tooltip: t('add'),
          //     isFreeAction: true,
          //     onClick: event => alert('You want to add a new row'),
          //   },
        ]}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              let toInsert = { ...newData };
              toInsert.schoolId = props.schools.find(
                e => e.shortName === toInsert.schoolName
              ).schoolId;

              toInsert.olympiad = props.subjects.find(
                e => e[`name_${i18n.language}`] === toInsert.subjectName
              ).subjectId;

              delete toInsert['subjectName'];
              delete toInsert['schoolName'];

              setTimeout(() => {
                studentsInsert.call(toInsert, (err, res) => {
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
                let toInsert = { ...newData };
                toInsert.schoolId = props.schools.find(
                  e => e.shortName === toInsert.schoolName
                ).schoolId;

                toInsert.olympiad = props.subjects.find(
                  e => e[`name_${i18n.language}`] === toInsert.subjectName
                ).subjectId;

                delete toInsert['subjectName'];
                delete toInsert['schoolName'];

                studentsInsert.call(toInsert, (err, res) => {
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
          // onRowDelete: oldData =>
          //   new Promise((resolve, reject) => {
          //     setTimeout(() => {
          //       studentsDeleteByStudentId.call(
          //         { studentId: oldData.studentId },
          //         (err, res) => {
          //           if (err) {
          //             showSnackbar({ message: err.message, severity: 'error' });
          //             reject();
          //           } else {
          //             showSnackbar({ message: t('done'), severity: 'success' });
          //             resolve();
          //           }
          //         }
          //       );
          //     }, 500);
          //   }),
        }}
      />
    </div>
  );
};

export default withTracker(props => {
  const schoolSub = Meteor.subscribe('schools.all');
  const schools = Schools.find().fetch();

  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    Meteor.subscribe('students.all');
  } else {
    const schoolId = schools.find(e => e.userId === Meteor.userId())?.schoolId;
    Meteor.subscribe('students.school', schoolId);
  }
  const students = Students.find().fetch();

  const subjectsSub = Meteor.subscribe('subjects.all');
  const subjects = Subjects.find().fetch();

  const idCounterSub = Meteor.subscribe('idCounter.all');
  const studentTransfers = Meteor.subscribe('studentTransfers.all');

  return {
    students,
    subjects,
    schools,
  };
})(Main);
