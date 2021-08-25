// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import IeltsResults from './results';

if (Meteor.isServer) {
  Meteor.publish('ieltsResults.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return IeltsResults.find();
    }
    return this.ready();
  });

  Meteor.publish('ieltsResults.school', function(schoolId) {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return IeltsResults.find({ schoolId });
    }
    return this.ready();
  });

  Meteor.publish('ieltsResults.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return IeltsResults.find({ academicYear });
    }
    return this.ready();
  });
}
