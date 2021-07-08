import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

import Drawer from '../../ui/components/Drawer/Drawer';

export const DrawerContext = createContext();

export function DrawerProvider({ children, navbarHeight }) {
  const [items, setItems] = useState([]);
  const [mainTitle, setMainTitle] = useState('');

  // const activeAlertIds = alerts.join(',');
  // useEffect(() => {
  //   if (activeAlertIds.length > 0) {
  //     const timer = setTimeout(
  //       () => setAlerts(alerts => alerts.slice(0, alerts.length - 1)),
  //       AUTO_DISMISS
  //     );
  //     return () => clearTimeout(timer);
  //   }
  // }, [activeAlertIds]);

  const setDrawer = useCallback(content => setItems(content), []);
  const setDrawerTitle = useCallback(content => setMainTitle(content), []);

  const value = useMemo(() => ({ setDrawer, setDrawerTitle }), [
    setDrawer,
    setDrawerTitle,
  ]);

  return (
    <DrawerContext.Provider value={value}>
      <Drawer
        children={children}
        navbarHeight={navbarHeight}
        mainTitle={mainTitle}
        items={items}
      />
      {/* {children} */}
      {/* {alerts.map(alert => (
          <Snackbar
            key={alert}
            message={alert.message}
            severity={alert.severity}
          />
        ))} */}
    </DrawerContext.Provider>
  );
}
