// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import BtsRatings from './ratings';

if (Meteor.isServer) {
  Meteor.publish('btsRatings.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return BtsRatings.find();
    }
    return this.ready();
  });

  Meteor.publish('btsRatings.academicYear', function(academicYear) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return BtsRatings.find({ academicYear });
    }
    return this.ready();
  });
}
