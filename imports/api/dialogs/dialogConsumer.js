import { useContext } from 'react';

import { DialogContext } from './dialogProvider';

const useDialogs = () => useContext(DialogContext);

export default useDialogs;
