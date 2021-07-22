import React, { useEffect } from 'react';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

import useDrawer from '../../../../api/drawer/drawerConsumer';

import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';

import { userIsInRole } from '../../../../api/users/methods';

const DRAWER_TITLE = { title: 'BTS', link: '/bts' };

const DRAWER_MENU = [
  { title: 'Answer keys', icon: <VpnKeyOutlinedIcon />, link: '/bts/keys' },
  { title: 'Results', icon: <ListAltOutlinedIcon />, link: '/bts/results' },
  { title: 'Rating', icon: <InsertChartOutlinedIcon />, link: '/bts/ratings' },
];

export default Main = () => {
  const { setDrawer, setDrawerTitle } = useDrawer();

  useEffect(() => {
    userIsInRole.call(
      { userId: Meteor.userId(), role: 'admin' },
      (err, res) => {
        if (res)
          DRAWER_MENU.push({
            title: 'Settings',
            icon: <SettingsOutlinedIcon />,
            link: '/bts/settings',
          });
      }
    );
    setDrawerTitle(DRAWER_TITLE);
    setDrawer(DRAWER_MENU);
  }, []);

  return <div></div>;
};
