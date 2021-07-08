import { useContext } from 'react';

import { DrawerContext } from './drawerProvider';

const useDrawer = () => useContext(DrawerContext);

export default useDrawer;
