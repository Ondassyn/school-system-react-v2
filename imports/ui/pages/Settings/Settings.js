import React, { useEffect } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Schools from '../../../api/schools/schools';

import CreateRole from './CreateRole/CreateRole';
import AssignUserToRole from './AssignRole/AssignUserToRole';
import AddUser from './AddUser/AddUser';
import useDrawer from '../../../api/drawer/drawerConsumer';

const Settings = props => {
  const { setDrawer, setDrawerTitle } = useDrawer();

  useEffect(() => {
    setDrawer();
    setDrawerTitle();
  });

  useEffect(() => {
    if (!Meteor.userId()) props.history.push('/signin');
  });

  if (!Meteor.userId() || !Roles.userIsInRole(Meteor.userId(), 'admin'))
    return (
      <div>
        <Restricted />
      </div>
    );

  return (
    <div>
      <CreateRole />
      <AssignUserToRole />
      <AddUser schools={props.schools} />
    </div>
  );
};

export default withTracker(props => {
  const schoolSub = Meteor.subscribe('schools.all');
  const schools = Schools.find().fetch();

  return {
    schools,
  };
})(Settings);
