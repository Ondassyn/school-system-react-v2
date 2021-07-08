import React, { useEffect } from 'react';
import useDrawer from '../../../../api/drawer/drawerConsumer';

import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';

const DRAWER_TITLE = { title: 'BTS', link: '/bts' };

const DRAWER_MENU = [
  { title: 'Answer keys', icon: <VpnKeyOutlinedIcon />, link: '/bts/keys' },
  { title: 'Results', icon: <ListAltOutlinedIcon />, link: '/bts/results' },
  { title: 'Rating', icon: <InsertChartOutlinedIcon />, link: '/bts/rating' },
];

export default Main = () => {
  const { setDrawer, setDrawerTitle } = useDrawer();

  useEffect(() => {
    setDrawerTitle(DRAWER_TITLE);
    setDrawer(DRAWER_MENU);
  }, []);

  return <div>BTS PAGE</div>;
};
