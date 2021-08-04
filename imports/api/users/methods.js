/* eslint-disable no-unused-vars */
/**
 * Meteor methods
 */

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { MethodHooks } from 'meteor/lacosta:method-hooks';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';
import Schools from '../schools/schools';

const mixins = [LoggedInMixin, MethodHooks, CallPromiseMixin];

// not logged in error message
const checkLoggedInError = {
  error: 'notLogged',
  message: 'You need to be logged in to call this method',
  reason: 'You need to login',
};

export const createRole = new ValidatedMethod({
  name: 'roles.createRole',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    role: { type: String },
  }).validator(),
  checkLoggedInError,
  run({ role }) {
    return Roles.createRole(role, { unlessExists: true });
  },
});

export const addUsersToRoles = new ValidatedMethod({
  name: 'roles.addUsersToRoles',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    userId: { type: String },
    role: { type: String },
  }).validator(),
  checkLoggedInError,
  run({ userId, role }) {
    Roles.addUsersToRoles(userId, role, null);
  },
});

export const userIsInRole = new ValidatedMethod({
  name: 'roles.userIsInRole',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    userId: { type: String },
    role: { type: String },
  }).validator(),
  checkLoggedInError,
  run({ userId, role }) {
    return Roles.userIsInRole(userId, role);
  },
});

export const addUserWithRole = new ValidatedMethod({
  name: 'users.addUserWithRole',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    username: { type: String },
    password: { type: String },
    role: { type: String },
    schoolId: { type: String, optional: true },
  }).validator(),
  checkLoggedInError,
  run({ username, password, role, schoolId }) {
    if (Meteor.isServer) {
      const userId = Accounts.createUser({ username, password });
      Roles.addUsersToRoles(userId, role, null);
      if (schoolId) {
        Schools.update(
          { schoolId },
          {
            $set: { userId, schoolAccount: username, schoolPassword: password },
          }
        );
      }
    }
  },
});
