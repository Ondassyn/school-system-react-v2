import { useContext } from 'react';

import { SnackbarContext } from './snackbarProvider';

const useSnackbars = () => useContext(SnackbarContext);

export default useSnackbars;
