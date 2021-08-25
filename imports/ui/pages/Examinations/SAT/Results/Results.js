import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import Students from '../../../../../api/students/students';
import { useTranslation } from 'react-i18next';
import TableIcons from '../../../../components/MaterialTable/TableIcons';

import useDrawer from '../../../../../api/drawer/drawerConsumer';
import useDialogs from '../../../../../api/dialogs/dialogConsumer';
import MaterialTable from 'material-table';
import Schools from '../../../../../api/schools/schools';

import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';

import useSnackbars from '../../../../../api/notifications/snackbarConsumer';
import SatResults from '../../../../../api/sat/results/results';
import { satResultsInsert } from '../../../../../api/sat/results/methods';

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

const Results = props => {
  const classes = useStyles();
  const [t, i18n] = useTranslation();
  const { setDrawer, setDrawerTitle } = useDrawer();
  const { showSnackbar } = useSnackbars();
  const { showDialog } = useDialogs();

  const TITLE = 'sat';

  useEffect(() => {
    const DRAWER_TITLE = {
      title: t(TITLE).toUpperCase(),
      link: '/' + TITLE,
    };

    const DRAWER_MENU = [
      {
        title: t('results'),
        icon: <ListAltOutlinedIcon />,
        link: '/' + TITLE + '/results',
      },
      {
        title: t('rating'),
        icon: <InsertChartOutlinedIcon />,
        link: '/' + TITLE + '/ratings',
      },
    ];
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

  const COLUMNS = [
    {
      title: t('school'),
      field: 'schoolName',
      lookup: lookupSchoolParser('schoolId'),
      editable: 'never',
    },
    {
      title: t('grade'),
      field: 'grade',
      lookup: lookupParser('grade'),
      editable: 'never',
    },
    {
      title: t('division'),
      field: 'division',
      lookup: lookupParser('division'),
      editable: 'never',
    },
    {
      title: t('surname'),
      field: 'surname',
      editable: 'never',
    },
    {
      title: t('name'),
      field: 'name',
      editable: 'never',
    },
    {
      title: 'Reading & Writing',
      field: 'english',
    },
    {
      title: 'Math',
      field: 'math',
    },
    {
      title: t('total'),
      field: 'total',
      editable: 'never',
    },
    {
      title: t('updated'),
      field: 'updatedAt',
      editable: 'never',
    },
  ];

  return (
    <div>
      <MaterialTable
        title={t(TITLE).toUpperCase() + ' ' + t('results')}
        columns={COLUMNS}
        data={props.students.map(s => {
          let school = props.schools.find(e => e.schoolId === s.schoolId);
          let schoolName = school ? school.shortName : '';

          let result = props.results.find(r => r.studentId === s.studentId);

          let returnObject = {
            schoolName,
            studentId: s.studentId,
            grade: s.grade,
            division: s.division,
            surname: s.surname,
            name: s.name,
            english: result?.results.find(e => e.sectionName === 'english')
              ?.result,
            math: result?.results.find(e => e.sectionName === 'math')?.result,
            total: result?.total,
            updatedAt: result ? format(result.updatedAt, 'dd/MM/yyyy') : '',
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
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              setTimeout(() => {
                let total = 0;
                total += newData.english ? +newData.english : 0;
                total += newData.math ? +newData.math : 0;
                let toInsert = {
                  studentId: newData.studentId,
                  grade: newData.grade,
                  total,
                  results: [
                    {
                      sectionName: 'english',
                      result: newData.english ? +newData.english : null,
                    },
                    {
                      sectionName: 'math',
                      result: newData.math ? +newData.math : null,
                    },
                  ],
                };
                toInsert.schoolId = props.schools.find(
                  e => e.shortName === newData.schoolName
                ).schoolId;

                toInsert.updatedAt = new Date();
                if (total)
                  satResultsInsert.call(toInsert, (err, res) => {
                    if (err) {
                      showSnackbar({ message: err.message, severity: 'error' });
                      reject();
                    } else {
                      showSnackbar({ message: t('done'), severity: 'success' });
                      resolve();
                    }
                  });
                else resolve();
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

  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    Meteor.subscribe('students.allSeniorGrades');
  } else {
    const schoolId = schools.find(e => e.userId === Meteor.userId())?.schoolId;
    Meteor.subscribe('students.schoolSeniorGrades', schoolId);
  }
  const students = Students.find({}).fetch();

  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    Meteor.subscribe('satResults.all');
  } else {
    const schoolId = schools.find(e => e.userId === Meteor.userId())?.schoolId;
    Meteor.subscribe('satResults.school', schoolId);
  }
  const results = SatResults.find().fetch();

  return {
    students,
    schools,
    results,
  };
})(Results);
