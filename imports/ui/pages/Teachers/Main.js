import React, { useEffect } from 'react';
import { userIsInRole } from '../../../api/users/methods';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Teachers from '../../../api/teachers/teachers';
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
  teachersDeleteByTeacherId,
  teachersInsert,
} from '../../../api/teachers/methods';
import useSnackbars from '../../../api/notifications/snackbarConsumer';
import { teacherTransfersInsert } from '../../../api/teacherTransfers/methods';
import {
  idCounterGetTeacherId,
  idCounterIncrementTeacherId,
  idCounterSetTeacherId,
} from '../../../api/idCounter/methods';

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

  const TITLE = 'teachers';

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
    return Meteor.apply('teachers.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      return { ...obj, [item]: item };
    }, {});
  };

  const lookupSchoolParser = fieldName => {
    return Meteor.apply('teachers.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      let school = props.schools.find(e => e.schoolId === item);
      let schoolName = school ? school.shortName : '';
      return { ...obj, [schoolName]: schoolName };
    }, {});
  };

  const lookupSubjectParser = fieldName => {
    return Meteor.apply('teachers.getDistinct', [fieldName], {
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
      title: t('teacher_id'),
      field: 'teacherId',
      editable: 'never',
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
      title: t('subject'),
      field: 'subjectName',
      lookup: lookupSubjectParser('subjectId'),
    },
    {
      title: t('academic_degree'),
      field: 'academicDegree',
      lookup: lookupParser('academicDegree'),
    },
    {
      title: t('work_experience'),
      field: 'workExperience',
    },
    {
      title: t('position'),
      field: 'position',
      lookup: lookupParser('position'),
    },
    {
      title: 'IELTS',
      field: 'ielts',
      lookup: lookupParser('ielts'),
    },
    {
      title: t('category'),
      field: 'category',
      lookup: lookupParser('category'),
    },
  ];

  return (
    <div>
      <MaterialTable
        title={t('current_list').toUpperCase()}
        columns={COLUMNS}
        data={props.teachers.map(result => {
          let school = props.schools.find(e => e.schoolId === result.schoolId);
          let schoolName = school ? school.shortName : '';
          let subject = props.subjects.find(
            e => e.subjectId === result.subjectId
          );
          let subjectName = subject ? subject[`name_${i18n.language}`] : '';
          let returnObject = {
            schoolName,
            subjectName,
            teacherId: result.teacherId,
            surname: result.surname,
            name: result.name,
            academicDegree: result.academicDegree,
            workExperience: result.workExperience,
            position: result.position,
            ielts: result.ielts,
            category: result.category,
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

                  toInsert.subjectId = props.subjects.find(
                    e => e[`name_${i18n.language}`] === toInsert.subjectName
                  ).subjectId;

                  delete toInsert['schoolName'];
                  delete toInsert['subjectName'];
                  delete toInsert['tableData'];

                  teacherTransfersInsert
                    .callPromise(toInsert)
                    .then(res => {
                      teachersDeleteByTeacherId.call(
                        { teacherId: res },
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

              toInsert.subjectId = props.subjects.find(
                e => e[`name_${i18n.language}`] === toInsert.subjectName
              ).subjectId;

              delete toInsert['subjectName'];
              delete toInsert['schoolName'];

              idCounterGetTeacherId
                .callPromise()
                .then(res => {
                  toInsert.teacherId = res;
                  teachersInsert.call(toInsert, err => {
                    if (err) {
                      showSnackbar({ message: err.message, severity: 'error' });
                      reject();
                    } else {
                      showSnackbar({ message: t('done'), severity: 'success' });
                      resolve();
                    }
                  });
                })
                .then(res => {
                  idCounterIncrementTeacherId.call(err => {
                    if (err) {
                      showSnackbar({ message: err.message, severity: 'error' });
                      reject();
                    } else {
                      showSnackbar({ message: t('done'), severity: 'success' });
                      resolve();
                    }
                  });
                })
                .catch(err => {
                  showSnackbar({ message: err.message, severity: 'error' });
                  reject();
                });
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                let toInsert = { ...newData };
                toInsert.schoolId = props.schools.find(
                  e => e.shortName === toInsert.schoolName
                ).schoolId;

                toInsert.subjectId = props.subjects.find(
                  e => e[`name_${i18n.language}`] === toInsert.subjectName
                ).subjectId;

                delete toInsert['subjectName'];
                delete toInsert['schoolName'];

                teachersInsert.call(toInsert, (err, res) => {
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
          //       teachersDeleteByTeacherId.call(
          //         { teacherId: oldData.teacherId },
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
    Meteor.subscribe('teachers.all');
  } else {
    const schoolId = schools.find(e => e.userId === Meteor.userId())?.schoolId;
    Meteor.subscribe('teachers.school', schoolId);
  }
  const teachers = Teachers.find().fetch();

  const subjectsSub = Meteor.subscribe('subjects.all');
  const subjects = Subjects.find().fetch();

  const idCounterSub = Meteor.subscribe('idCounter.all');
  const teacherTransfers = Meteor.subscribe('teacherTransfers.all');

  return {
    teachers,
    subjects,
    schools,
  };
})(Main);
