// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import TurkishA1Settings from './settings';

if (Meteor.isServer) {
  Meteor.publish('turkishA1Settings.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return TurkishA1Settings.find();
    }
    return this.ready();
  });

  Meteor.publish('turkishA1Settings.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return TurkishA1Settings.find({ academicYear });
    }
    return this.ready();
  });
}
