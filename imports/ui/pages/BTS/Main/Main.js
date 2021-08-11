import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import useDrawer from '../../../../api/drawer/drawerConsumer';

import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';

import { userIsInRole } from '../../../../api/users/methods';
import { useTranslation } from 'react-i18next';

const EXAM_NAME = 'bts';

export default Main = () => {
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

  return <div></div>;
};
