// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import KboResults from './results';

if (Meteor.isServer) {
  Meteor.publish('kboResults.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return KboResults.find();
    }
    return this.ready();
  });

  Meteor.publish('kboResults.school', function(schoolId) {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return KboResults.find({ schoolId });
    }
    return this.ready();
  });

  Meteor.publish('kboResults.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return KboResults.find({ academicYear });
    }
    return this.ready();
  });
}
