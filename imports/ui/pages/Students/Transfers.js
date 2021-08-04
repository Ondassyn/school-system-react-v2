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
import {
  studentTransfersDeleteByStudentId,
  studentTransfersInsert,
} from '../../../api/studentTransfers/methods';
import StudentTransfers from '../../../api/studentTransfers/studentTransfers';

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

const Transfers = props => {
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
    return Meteor.apply('studentTransfers.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      return { ...obj, [item]: item };
    }, {});
  };

  const lookupSchoolParser = fieldName => {
    return Meteor.apply('studentTransfers.getDistinct', [fieldName], {
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
    },
    {
      title: t('student_id'),
      field: 'studentId',
    },
    {
      title: t('grade'),
      field: 'grade',
      lookup: lookupParser('grade'),
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
  ];

  return (
    <div>
      <MaterialTable
        title={t('transfer_list').toUpperCase()}
        columns={COLUMNS}
        data={props.transfers.map(result => {
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
            icon: TableIcons.Delete,
            tooltip: t('delete'),
            onClick: (event, rowData) =>
              showDialog({
                text: t('delete_confirmation'),
                proceed: () => {
                  studentTransfersDeleteByStudentId.call(
                    { studentId: rowData.studentId },
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
                },
              }),
          }),
          {
            icon: TableIcons.PersonAdd,
            tooltip: t('add'),
            disabled: !Roles.userIsInRole(Meteor.userId(), 'school'),
            onClick: (event, rowData) =>
              showDialog({
                text: t('add_to_school_confirmation'),
                proceed: () => {
                  let student = props.transfers.find(
                    e => e.studentId === rowData.studentId
                  );

                  if (!student) {
                    showSnackbar({
                      message: t('something_wrong'),
                      severity: 'error',
                    });
                    return;
                  }

                  const school = props.schools.find(
                    e => e.userId === Meteor.userId()
                  );
                  if (!school) {
                    showSnackbar({
                      message: t('something_wrong'),
                      severity: 'error',
                    });
                    return;
                  }

                  student.schoolId = school.schoolId;
                  studentsInsert
                    .callPromise(student)
                    .then(res =>
                      studentTransfersDeleteByStudentId.call(
                        { studentId: student.studentId },
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
                      )
                    )
                    .catch(err =>
                      showSnackbar({ message: err.message, severity: 'error' })
                    );
                },
              }),
          },
        ]}
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

  const transfersSub = Meteor.subscribe('studentTransfers.all');
  const transfers = StudentTransfers.find().fetch();

  return {
    students,
    schools,
    transfers,
  };
})(Transfers);
