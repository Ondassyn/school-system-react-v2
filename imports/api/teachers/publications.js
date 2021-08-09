// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Teachers from './teachers';

if (Meteor.isServer) {
  Meteor.publish('teachers.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Teachers.find();
    }
    return this.ready();
  });

  Meteor.publish('teachers.school', function(schoolId) {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return Teachers.find({ schoolId });
    }
    return this.ready();
  });
}
