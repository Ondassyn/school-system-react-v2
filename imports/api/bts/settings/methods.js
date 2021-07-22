/**
 * Meteor methods
 */

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { MethodHooks } from 'meteor/lacosta:method-hooks';
import { CallPromiseMixin } from 'meteor/didericis:callpromise-mixin';

import BtsSettings from './settings.js';

/** **************** Helpers **************** */

const mixins = [LoggedInMixin, MethodHooks, CallPromiseMixin];

// not logged in error message
const checkLoggedInError = {
  error: 'notLogged',
  message: 'You need to be logged in to call this method',
  reason: 'You need to login',
};

/** **************** Methods **************** */

/**
 * countersIncrease
 */

// eslint-disable-next-line no-unused-vars, arrow-body-style
//  const beforeHookExample = (methodArgs, methodOptions) => {
//    // console.log('countersIncrease before hook');
//    // perform tasks
//    return methodArgs;
//  };
//  // eslint-disable-next-line no-unused-vars, arrow-body-style
//  const afterHookExample = (methodArgs, returnValue, methodOptions) => {
//    // console.log('countersIncrease: after hook:');
//    // perform tasks
//    return returnValue;
//  };

export const btsSettingsInsert = new ValidatedMethod({
  name: 'btsSettings.insert',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    academicYear: { type: String },
    examNumber: { type: SimpleSchema.Integer },
    grade: { type: SimpleSchema.Integer },
    day: { type: SimpleSchema.Integer },
    subjects: Array,
    'subjects.$': {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  checkLoggedInError,
  run(toInsert) {
    // console.log('counters.insert', _id);
    const recordInDB = BtsSettings.findOne({
      academicYear: toInsert.academicYear,
      examNumber: toInsert.examNumber,
      grade: toInsert.grade,
      day: toInsert.day,
    });
    if (recordInDB) {
      BtsSettings.update({ _id: recordInDB._id }, { $set: toInsert });
      return recordInDB._id;
    } else {
      const keyId = BtsSettings.insert(toInsert);
      return keyId;
    }
  },
});

export const btsSettingsDelete = new ValidatedMethod({
  name: 'btsSettings.delete',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  checkLoggedInError,
  run({ _id }) {
    return BtsSettings.remove({ _id });
  },
});
