// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import TurkishA1Ratings from './ratings';

if (Meteor.isServer) {
  Meteor.publish('turkishA1Ratings.all', function() {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return TurkishA1Ratings.find();
    }
    return this.ready();
  });

  Meteor.publish('turkishA1Ratings.academicYear', function(academicYear) {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return TurkishA1Ratings.find({ academicYear });
    }
    return this.ready();
  });
}
