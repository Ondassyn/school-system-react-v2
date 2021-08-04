// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import StudentTransfers from './studentTransfers';

if (Meteor.isServer) {
  Meteor.publish('studentTransfers.all', function() {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return StudentTransfers.find();
    }
    return this.ready();
  });
}
