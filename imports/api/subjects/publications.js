// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Subjects from './subjects.js';

if (Meteor.isServer) {
  Meteor.publish('subjects.all', function() {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return Subjects.find();
    }
    return this.ready();
  });
}
