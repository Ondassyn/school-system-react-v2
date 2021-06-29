// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Schools from './schools.js';

if (Meteor.isServer) {
  Meteor.publish('schools.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Schools.find();
    }
    return this.ready();
  });
}
