// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import IdCounter from './idCounter';

if (Meteor.isServer) {
  Meteor.publish('idCounter.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return IdCounter.find();
    }
    return this.ready();
  });
}
