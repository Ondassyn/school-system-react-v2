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
import Restricted from '../../components/Restricted/Restricted';

import useDrawer from '../../../api/drawer/drawerConsumer';
import useDialogs from '../../../api/dialogs/dialogConsumer';
import MaterialTable from 'material-table';
import Schools from '../../../api/schools/schools';
import EditOutlined from '@material-ui/icons/EditOutlined';
import TransferWithinAStationOutlinedIcon from '@material-ui/icons/TransferWithinAStationOutlined';
import {
  studentsDeleteByStudentId,
  studentsInsert,
} from '../../../api/students/methods';
import useSnackbars from '../../../api/notifications/snackbarConsumer';
import { studentTransfersInsert } from '../../../api/studentTransfers/methods';
import {
  schoolsDeleteBySchoolId,
  schoolsInsert,
} from '../../../api/schools/methods';

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

  useEffect(() => {
    if (!Meteor.userId()) props.history.push('/signin');
  });

  useEffect(() => {
    setDrawer([]);
    setDrawerTitle('');
  }, [i18n.language]);

  if (!Meteor.userId() || !Roles.userIsInRole(Meteor.userId(), 'admin'))
    return (
      <div>
        <Restricted />
      </div>
    );

  const lookupParser = fieldName => {
    return Meteor.apply('schools.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      return { ...obj, [item]: item };
    }, {});
  };

  const COLUMNS = [
    {
      title: t('school_id'),
      field: 'schoolId',
    },
    {
      title: t('short_name'),
      field: 'shortName',
    },
    {
      title: t('full_name'),
      field: 'fullName',
    },
    {
      title: t('secondary_name'),
      field: 'secondaryName',
    },
    {
      title: t('school_type'),
      field: 'schoolType',
      lookup: lookupParser('schoolType'),
    },
    {
      title: t('region'),
      field: 'region',
      lookup: lookupParser('region'),
    },
    {
      title: t('user_id'),
      field: 'userId',
    },
    {
      title: t('old_school_id'),
      field: 'oldSchoolId',
    },
    {
      title: t('school_account'),
      field: 'schoolAccount',
    },
    {
      title: t('school_password'),
      field: 'schoolPassword',
    },
  ];

  return (
    <div>
      <MaterialTable
        title={t('schools').toUpperCase()}
        columns={COLUMNS}
        data={props.schools}
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
        //       showDialog({
        //         text: t('transfer_confirmation'),
        //         proceed: () => {
        //           let toInsert = { ...rowData };
        //           toInsert.schoolId = props.schools.find(
        //             e => e.shortName === toInsert.schoolName
        //           ).schoolId;
        //           delete toInsert['schoolName'];
        //           delete toInsert['tableData'];

        //           studentTransfersInsert
        //             .callPromise(toInsert)
        //             .then(res => {
        //               studentsDeleteByStudentId.call(
        //                 { studentId: res },
        //                 (err, res) => {
        //                   if (err)
        //                     showSnackbar({
        //                       message: err.message,
        //                       severity: 'error',
        //                     });
        //                   else
        //                     showSnackbar({
        //                       message: t('done'),
        //                       severity: 'success',
        //                     });
        //                 }
        //               );
        //             })
        //             .catch(err =>
        //               showSnackbar({
        //                 message: err.message,
        //                 severity: 'error',
        //               })
        //             );
        //         },
        //       }),
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
              setTimeout(() => {
                schoolsInsert.call(newData, (err, res) => {
                  if (err) {
                    showSnackbar({
                      message: err.message,
                      severity: 'error',
                    });
                    reject();
                  } else {
                    showSnackbar({
                      message: t('done'),
                      severity: 'success',
                    });
                    resolve();
                  }
                });
              }, 500);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                schoolsInsert.call(newData, (err, res) => {
                  if (err) {
                    showSnackbar({
                      message: err.message,
                      severity: 'error',
                    });
                    reject();
                  } else {
                    showSnackbar({
                      message: t('done'),
                      severity: 'success',
                    });
                    resolve();
                  }
                });
              }, 500);
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                schoolsDeleteBySchoolId.call(
                  { schoolId: oldData.schoolId },
                  (err, res) => {
                    if (err) {
                      showSnackbar({
                        message: err.message,
                        severity: 'error',
                      });
                      reject();
                    } else {
                      showSnackbar({
                        message: t('done'),
                        severity: 'success',
                      });
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
  const schoolSub = Meteor.subscribe('schools.all');
  const schools = Schools.find().fetch();

  return {
    schools,
  };
})(Main);
