// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import KboRatings from './ratings';

if (Meteor.isServer) {
  Meteor.publish('kboRatings.all', function() {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return KboRatings.find();
    }
    return this.ready();
  });

  Meteor.publish('kboRatings.academicYear', function(academicYear) {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return KboRatings.find({ academicYear });
    }
    return this.ready();
  });
}
