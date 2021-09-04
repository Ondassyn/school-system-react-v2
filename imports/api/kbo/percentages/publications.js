// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import KboPercentages from './percentages';

if (Meteor.isServer) {
  Meteor.publish('kboPercentages.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return KboPercentages.find();
    }
    return this.ready();
  });

  Meteor.publish('kboPercentages.school', function(schoolId) {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return KboPercentages.find({ schoolId });
    }
    return this.ready();
  });

  Meteor.publish('kboPercentages.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return KboPercentages.find({ academicYear });
    }
    return this.ready();
  });
}
