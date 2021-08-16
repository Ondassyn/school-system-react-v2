// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import TurkishA1Results from './results';

if (Meteor.isServer) {
  Meteor.publish('turkishA1Results.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return TurkishA1Results.find();
    }
    return this.ready();
  });

  Meteor.publish('turkishA1Results.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return TurkishA1Results.find({ academicYear });
    }
    return this.ready();
  });
}
