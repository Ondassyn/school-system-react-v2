// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import SatRatings from './ratings';

if (Meteor.isServer) {
  Meteor.publish('satRatings.all', function() {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return SatRatings.find();
    }
    return this.ready();
  });
}
