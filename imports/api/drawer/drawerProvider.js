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
  // const [alerts, setAlerts] = useState([]);

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

  // const showSnackbar = useCallback(
  //   content => setAlerts(alerts => [content, ...alerts]),
  //   []
  // );

  // const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <DrawerContext.Provider value="dark">
      <Drawer children={children} navbarHeight={navbarHeight} />
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
