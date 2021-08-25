import React, { useState, useEffect } from 'react';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core';

import MaterialTable, { MTableToolbar } from 'material-table';
import TableIcons from '../../../../components/MaterialTable/TableIcons';

import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

// collections
import IeltsRatings from '../../../../../api/ielts/ratings/ratings';
import IeltsResults from '../../../../../api/ielts/results/results';
import Subjects from '../../../../../api/subjects/subjects';
import Schools from '../../../../../api/schools/schools';

import useDrawer from '../../../../../api/drawer/drawerConsumer';

import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import { useTranslation } from 'react-i18next';
import { userIsInRole } from '../../../../../api/users/methods';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { CalculateRating } from './CalculateRating/CalculateRating';

const EXAM_NAME = 'ielts';

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

const Ratings = props => {
  const classes = useStyles();
  const [blocking, setBlocking] = useState(false);
  const { setDrawer, setDrawerTitle } = useDrawer();
  const [t, i18n] = useTranslation();

  useEffect(() => {
    const DRAWER_TITLE = {
      title: t(EXAM_NAME).toUpperCase(),
      link: '/' + EXAM_NAME,
    };

    const DRAWER_MENU = [
      {
        title: t('results'),
        icon: <ListAltOutlinedIcon />,
        link: '/' + EXAM_NAME + '/results',
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
    return Meteor.apply('ieltsRatings.getDistinct', [fieldName], {
      returnStubValue: true,
    })?.reduce((obj, item) => {
      return { ...obj, [item]: item };
    }, {});
  };

  const lookupSchoolParser = fieldName => {
    return Meteor.apply('ieltsRatings.getDistinct', [fieldName], {
      returnStubValue: true,
    })?.reduce((obj, item) => {
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
      title: t('grade'),
      field: 'grade',
      lookup: lookupParser('grade'),
    },
    {
      title: 'Listening',
      field: 'listening',
    },
    {
      title: 'Reading',
      field: 'reading',
    },
    {
      title: 'Writing',
      field: 'writing',
    },
    {
      title: 'Speaking',
      field: 'speaking',
    },
    {
      title: 'Total',
      field: 'total',
    },
  ];

  return (
    <div className="ratings-page">
      <MaterialTable
        title=""
        columns={COLUMNS}
        data={props.ratings.map(result => {
          let school = props.schools.find(e => e.schoolId === result.schoolId);
          let schoolName = school ? school.shortName : '';
          let returnObject = {
            academicYear: result.academicYear,
            examNumber: result.examNumber,
            schoolName,
            grade: result.grade,
            division: result.division,
            surname: result.surname,
            name: result.name,
          };
          result.averages?.map(average => {
            returnObject[average.sectionName] = average.average.toFixed(2);
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
                {t(EXAM_NAME).toUpperCase() + ' ' + t('rating')}
              </Typography>
              <div className={classes.toolbarActions}>
                <MTableToolbar {...localProps} />
                <CalculateRating setBlocking={setBlocking} />
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
};

export default withTracker(props => {
  // remote example (if using ddp)
  /*
      const usersSub = Remote.subscribe('users.friends'); // publication needs to be set on remote server
      const users = Users.find().fetch();
      const usersReady = usersSub.ready() && !!users;
      */

  const ratingsSub = Meteor.subscribe('ieltsRatings.all');
  const ratings = IeltsRatings.find().fetch();

  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    Meteor.subscribe('ieltsResults.all');
  } else if (Roles.userIsInRole(Meteor.userId(), 'school')) {
    const schoolId = schools.find(e => e.userId === Meteor.userId())?.schoolId;
    Meteor.subscribe('ieltsResults.school', schoolId);
  }
  const results = IeltsResults.find().fetch();

  const schoolsSub = Meteor.subscribe('schools.all');
  const schools = Schools.find().fetch();

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,
    ratings,
    results,
    schools,
  };
})(Ratings);
