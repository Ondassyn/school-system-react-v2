import React, { useState, useEffect } from 'react';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import MaterialTable, { MTableToolbar } from 'material-table';
import TableIcons from '../../../../components/MaterialTable/TableIcons';

// collection
import KboKeys from '../../../../../api/kbo/keys/keys';
import Subjects from '../../../../../api/subjects/subjects';

import AddKey from './AddKey/AddKey';
import DeleteKey from './DeleteKey/DeleteKey';

import useDrawer from '../../../../../api/drawer/drawerConsumer';

import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';

import Typography from '@material-ui/core/Typography';

import { useTranslation } from 'react-i18next';
import { userIsInRole } from '../../../../../api/users/methods';

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

const EXAM_NAME = 'kbo';

function Keys(props) {
  const classes = useStyles();
  const [t, i18n] = useTranslation();
  const { setDrawer, setDrawerTitle } = useDrawer();

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
    return Meteor.apply('kboKeys.getDistinct', [fieldName], {
      returnStubValue: true,
    })?.reduce((obj, item) => {
      return { ...obj, [item]: item };
    }, {});
  };

  const COLUMNS = [
    {
      title: t('year'),
      field: 'academicYear',
      defaultFilter: props.currentYear,
    },
    {
      title: t('exam_number'),
      field: 'examNumber',
      lookup: lookupParser('examNumber'),
    },
    {
      title: t('variant'),
      field: 'variant',
    },
  ];

  return (
    <div>
      <MaterialTable
        title=""
        data={props.keys}
        icons={TableIcons}
        columns={[
          ...COLUMNS,
          {
            title: t('actions'),
            render: rowData => {
              return (
                <div className={classes.actions}>
                  <AddKey
                    icon={'edit'}
                    initialData={props.keys.find(e => e._id === rowData._id)}
                    currentYear={props.currentYear}
                    subjects={props.subjects}
                  />
                  <DeleteKey _id={rowData._id} />
                </div>
              );
            },
          },
        ]}
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
                {t(EXAM_NAME).toUpperCase() + ' ' + t('answer_keys')}
              </Typography>
              <MTableToolbar {...localProps} />
              <AddKey
                icon={'add'}
                currentYear={props.currentYear}
                subjects={props.subjects}
              />
            </div>
          ),
        }}
        options={{
          search: false,
          paging: false,
          filtering: true,
          exportButton: false,
        }}
      />
    </div>
  );
}

export default withTracker(props => {
  // remote example (if using ddp)
  /*
    const usersSub = Remote.subscribe('users.friends'); // publication needs to be set on remote server
    const users = Users.find().fetch();
    const usersReady = usersSub.ready() && !!users;
    */

  // counters example
  const kboKeysSub = Meteor.subscribe('kboKeys.all');
  const keys = KboKeys.find().fetch();
  const keysReady = kboKeysSub.ready() && !!keys;

  const subejctsSub = Meteor.subscribe('subjects.all');
  const subjects = Subjects.find().fetch();

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,
    keysReady,
    keys,
    subjects,
  };
})(Keys);
