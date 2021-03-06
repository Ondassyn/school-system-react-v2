// Publications send to the client

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Students from './students';

if (Meteor.isServer) {
  Meteor.publish('students.all', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Students.find();
    }
    return this.ready();
  });

  Meteor.publish('students.school', function(schoolId) {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return Students.find({ schoolId });
    }
    return this.ready();
  });

  Meteor.publish('students.allSeniorGrades', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      return Students.find({ grade: { $in: ['10', '11'] } });
    }
    return this.ready();
  });

  Meteor.publish('students.schoolSeniorGrades', function(schoolId) {
    if (
      Roles.userIsInRole(this.userId, 'admin') ||
      Roles.userIsInRole(this.userId, 'school')
    ) {
      return Students.find({ schoolId, grade: { $in: ['10', '11'] } });
    }
    return this.ready();
  });
}
