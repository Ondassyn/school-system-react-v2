// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import SatResults from './results';

if (Meteor.isServer) {
  Meteor.publish('satResults.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return SatResults.find();
    }
    return this.ready();
  });

  Meteor.publish('satResults.school', function(schoolId) {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return SatResults.find({ schoolId });
    }
    return this.ready();
  });

  Meteor.publish('satResults.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return SatResults.find({ academicYear });
    }
    return this.ready();
  });
}
