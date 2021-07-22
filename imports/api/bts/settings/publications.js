// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import BtsSettings from './settings';

if (Meteor.isServer) {
  Meteor.publish('btsSettings.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return BtsSettings.find();
    }
    return this.ready();
  });

  Meteor.publish('btsSettings.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return BtsSettings.find({ academicYear });
    }
    return this.ready();
  });
}
