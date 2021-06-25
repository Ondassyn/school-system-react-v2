// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import BtsKeys from './btsKeys';

if (Meteor.isServer) {
  Meteor.publish('btsKeys.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return BtsKeys.find();
    }
    return this.ready();
  });

  Meteor.publish('btsKeys.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return BtsKeys.find({ academicYear });
    }
    return this.ready();
  });
}
