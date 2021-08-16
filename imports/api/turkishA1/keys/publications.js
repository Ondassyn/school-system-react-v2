// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import TurkishA1Keys from './keys';

if (Meteor.isServer) {
  Meteor.publish('turkishA1Keys.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return TurkishA1Keys.find();
    }
    return this.ready();
  });

  Meteor.publish('turkishA1Keys.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return TurkishA1Keys.find({ academicYear });
    }
    return this.ready();
  });
}
