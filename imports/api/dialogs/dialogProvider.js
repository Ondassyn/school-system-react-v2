import React, { createContext, useState, useCallback, useMemo } from 'react';

import AlertDialog from '../../ui/components/AlertDialog/AlertDialog';

export const DialogContext = createContext();

export function DialogProvider({ children }) {
  const [alert, setAlert] = useState();

  const showDialog = useCallback(content => setAlert(content), []);

  const value = useMemo(() => ({ showDialog }), [showDialog]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      {alert && (
        <AlertDialog
          key={alert}
          title={alert.title}
          text={alert.text}
          close={alert.close}
          proceed={alert.proceed}
          setAlert={setAlert}
        />
      )}
    </DialogContext.Provider>
  );
}
