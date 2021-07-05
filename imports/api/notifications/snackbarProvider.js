import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

import Snackbar from '../../ui/components/Snackbar/Snackbar';

export const SnackbarContext = createContext();

const AUTO_DISMISS = 5000;

export function SnackbarProvider({ children }) {
  const [alerts, setAlerts] = useState([]);

  const activeAlertIds = alerts.join(',');
  useEffect(() => {
    if (activeAlertIds.length > 0) {
      const timer = setTimeout(
        () => setAlerts(alerts => alerts.slice(0, alerts.length - 1)),
        AUTO_DISMISS
      );
      return () => clearTimeout(timer);
    }
  }, [activeAlertIds]);

  const showSnackbar = useCallback(
    content => setAlerts(alerts => [content, ...alerts]),
    []
  );

  const value = useMemo(() => ({ showSnackbar }), [showSnackbar]);

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      {alerts.map(alert => (
        <Snackbar
          key={alert}
          message={alert.message}
          severity={alert.severity}
        />
      ))}
    </SnackbarContext.Provider>
  );
}
