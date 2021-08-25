// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import IeltsRatings from './ratings';

if (Meteor.isServer) {
  Meteor.publish('ieltsRatings.all', function() {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return IeltsRatings.find();
    }
    return this.ready();
  });
}
