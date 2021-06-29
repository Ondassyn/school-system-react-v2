// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import BtsResults from './results';

if (Meteor.isServer) {
  Meteor.publish('btsResults.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return BtsResults.find();
    }
    return this.ready();
  });

  Meteor.publish('btsResults.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return BtsResults.find({ academicYear });
    }
    return this.ready();
  });
}
