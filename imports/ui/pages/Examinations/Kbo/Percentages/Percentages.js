import React, { useState, useEffect } from 'react';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import MaterialTable, { MTableToolbar } from 'material-table';
import TableIcons from '../../../../components/MaterialTable/TableIcons';
import { makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

// collections
import KboPercentages from '../../../../../api/kbo/percentages/percentages';
import Schools from '../../../../../api/schools/schools';
import Students from '../../../../../api/students/students';
import KboKeys from '../../../../../api/kbo/keys/keys';

import useDrawer from '../../../../../api/drawer/drawerConsumer';

import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import { useTranslation } from 'react-i18next';
import Subjects from '../../../../../api/subjects/subjects';

const EXAM_NAME = 'kbo';

const EXAM_NUMBERS = [1, 2, 3];

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
  toolbarActions: {
    display: 'flex',
    alignItems: 'center',
  },
  actions: {
    display: 'flex',
  },
}));

const Percentages = props => {
  const classes = useStyles();
  const [blocking, setBlocking] = useState(false);
  const [t, i18n] = useTranslation();
  const { setDrawer, setDrawerTitle } = useDrawer();
  const [columns, setColumns] = useState([]);

  let COLUMNS = [];

  useEffect(() => {
    let headers = [];

    EXAM_NUMBERS.map(n =>
      headers.push({
        title: '' + n,
        field: '' + n,
      })
    );
    setColumns(COLUMNS.concat(headers));
  }, [props.percentages, i18n.language]);

  useEffect(() => {
    const DRAWER_TITLE = {
      title: t(EXAM_NAME).toUpperCase(),
      link: '/' + EXAM_NAME,
    };

    const DRAWER_MENU = [
      {
        title: t('answer_keys'),
        icon: <VpnKeyOutlinedIcon />,
        link: '/' + EXAM_NAME + '/keys',
      },
      {
        title: t('results'),
        icon: <ListAltOutlinedIcon />,
        link: '/' + EXAM_NAME + '/results',
      },
      {
        title: t('percentages'),
        icon: <DonutLargeIcon />,
        link: '/' + EXAM_NAME + '/percentages',
      },
      {
        title: t('rating'),
        icon: <InsertChartOutlinedIcon />,
        link: '/' + EXAM_NAME + '/ratings',
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
    return Meteor.apply('kboPercentages.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      return { ...obj, [item]: item };
    }, {});
  };

  const lookupSchoolParser = fieldName => {
    return Meteor.apply('kboPercentages.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      let school = props.schools.find(e => e.schoolId === item);
      let schoolName = school ? school.shortName : '';
      return { ...obj, [schoolName]: schoolName };
    }, {});
  };

  COLUMNS = [
    {
      title: t('year'),
      field: 'academicYear',
      defaultFilter: props.currentYear,
    },
    {
      title: t('school'),
      field: 'schoolName',
      lookup: lookupSchoolParser('schoolId'),
    },
    {
      title: t('grade'),
      field: 'grade',
      lookup: lookupParser('grade'),
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
      title: t('average'),
      field: 'average',
      render: rowData => {
        let sum = 0;
        let n = 0;
        EXAM_NUMBERS.map(en => {
          if (rowData[en]) {
            sum += rowData[en];
            n++;
          }
        });
        if (n) return (sum / n).toFixed(0);
      },
    },
  ];

  return (
    <BlockUi
      tag="div"
      blocking={blocking}
      message={t('please_wait')}
      keepInView="true"
    >
      <div>
        <MaterialTable
          title=""
          columns={columns}
          data={props.percentages.map(result => {
            let school = props.schools.find(
              e => e.schoolId === result.schoolId
            );
            let schoolName = school ? school.shortName : '';
            let returnObject = {
              academicYear: result.academicYear,
              schoolName,
              grade: result.grade,
              division: result.division,
              surname: result.surname,
              name: result.name,
            };
            result.percentages?.map(r => {
              returnObject[result.examNumber] = r.percentage;
            });
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
          components={{
            Toolbar: localProps => (
              <div className={classes.toolbar}>
                <Typography className={classes.tableTitle} variant="h6">
                  {t(EXAM_NAME).toUpperCase() + ' ' + t('percentages')}
                </Typography>
                <div className={classes.toolbarActions}>
                  <MTableToolbar {...localProps} />
                </div>
              </div>
            ),
          }}
        />
      </div>
    </BlockUi>
  );
};

export default withTracker(props => {
  // remote example (if using ddp)
  /*
      const usersSub = Remote.subscribe('users.friends'); // publication needs to be set on remote server
      const users = Users.find().fetch();
      const usersReady = usersSub.ready() && !!users;
      */

  // counters example
  // const percentagesSub = Meteor.subscribe(
  //   'kboPercentages.academicYear',
  //   props.currentYear
  // );

  const schoolsSub = Meteor.subscribe('schools.all');
  const schools = Schools.find().fetch();
  const schoolsReady = schoolsSub.ready() && !!schools;

  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    Meteor.subscribe('kboPercentages.all');
  } else if (Roles.userIsInRole(Meteor.userId(), 'school')) {
    const schoolId = schools.find(e => e.userId === Meteor.userId())?.schoolId;
    Meteor.subscribe('kboPercentages.school', schoolId);
  }
  const percentages = KboPercentages.find().fetch();

  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    Meteor.subscribe('students.all');
  } else if (Roles.userIsInRole(Meteor.userId(), 'school')) {
    const schoolId = schools.find(e => e.userId === Meteor.userId())?.schoolId;
    Meteor.subscribe('students.school', schoolId);
  }
  const students = Students.find().fetch();

  const keysSub = Meteor.subscribe('kboKeys.academicYear', props.currentYear);
  const keys = KboKeys.find().fetch();
  const keysReady = keysSub.ready() && !!keys;

  const subjectsSub = Meteor.subscribe('subjects.all');
  const subjects = Subjects.find().fetch();

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,
    percentages,
    schools,
    students,
    // ratings,
    subjects,
    keys,
  };
})(Percentages);
