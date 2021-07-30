import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

import Drawer from '../../ui/components/Drawer/Drawer';

export const DrawerContext = createContext();

export function DrawerProvider({ children }) {
  const [items, setItems] = useState([]);
  const [mainTitle, setMainTitle] = useState('');

  const setDrawer = useCallback(content => setItems(content), []);
  const setDrawerTitle = useCallback(content => setMainTitle(content), []);

  const value = useMemo(() => ({ setDrawer, setDrawerTitle }), [
    setDrawer,
    setDrawerTitle,
  ]);

  return (
    <DrawerContext.Provider value={value}>
      <Drawer children={children} mainTitle={mainTitle} items={items} />
    </DrawerContext.Provider>
  );
}
