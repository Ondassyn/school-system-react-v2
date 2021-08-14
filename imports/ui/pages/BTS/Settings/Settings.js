import React, { useEffect } from 'react';
import { userIsInRole } from '../../../../api/users/methods';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import BtsSettings from '../../../../api/bts/settings/settings';
import Setting from './Setting/Setting';
import { Box, Grid, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import Subjects from '../../../../api/subjects/subjects';

import useDrawer from '../../../../api/drawer/drawerConsumer';

import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';

const EXAM_NAME = 'bts';

const Settings = props => {
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
        title: t('rating'),
        icon: <InsertChartOutlinedIcon />,
        link: '/' + EXAM_NAME + '/ratings',
      },
    ];

    userIsInRole
      .callPromise({ userId: Meteor.userId(), role: 'admin' })
      .then(res => {
        if (res) {
          DRAWER_MENU.push({
            title: t('settings'),
            icon: <SettingsOutlinedIcon />,
            link: '/' + EXAM_NAME + '/settings',
          });
        }
        setDrawer(DRAWER_MENU);
      });

    setDrawerTitle(DRAWER_TITLE);
  }, [i18n.language]);

  useEffect(() => {
    if (!Meteor.userId()) props.history.push('/signin');
  });

  if (!Meteor.userId()) return null;

  return (
    <div>
      <Typography variant="h5" align="center">
        {t(EXAM_NAME).toUpperCase() + ' ' + t('settings')}
      </Typography>
      <Box m={2} />
      <Grid container spacing={1}>
        {[7, 8, 9, 10, 11].map(grade => (
          <Grid key={grade} item xs={12} md>
            <Typography variant="h6" color="textSecondary" align="center">
              {grade + ' ' + t('grade')}
            </Typography>
            {props.settings
              .filter(setting => setting.grade === grade)
              .map(setting => (
                <Setting
                  key={setting._id}
                  subjects={props.subjects}
                  setting={setting}
                  grade={grade}
                />
              ))}
            <Setting subjects={props.subjects} grade={grade} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default withTracker(props => {
  const settingsSub = Meteor.subscribe(
    'btsSettings.academicYear',
    props.currentYear
  );
  const settings = BtsSettings.find().fetch();
  const settingsReady = settingsSub.ready() && !!settings;

  const subjectsSub = Meteor.subscribe('subjects.all');
  const subjects = Subjects.find().fetch();

  return {
    settings,
    subjects,
  };
})(Settings);
