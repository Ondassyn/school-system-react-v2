import React from 'react';

import CreateRole from './CreateRole/CreateRole';
import AssignUserToRole from './AddUser/AssignUserToRole';

export default Settings = props => {
  return (
    <div>
      <CreateRole />
      <AssignUserToRole />
    </div>
  );
};
