// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import KboKeys from './keys';

if (Meteor.isServer) {
  Meteor.publish('kboKeys.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return KboKeys.find();
    }
    return this.ready();
  });

  Meteor.publish('kboKeys.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return KboKeys.find({ academicYear });
    }
    return this.ready();
  });
}
