// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import TeacherTransfers from './teacherTransfers';

if (Meteor.isServer) {
  Meteor.publish('teacherTransfers.all', function() {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return TeacherTransfers.find();
    }
    return this.ready();
  });
}
