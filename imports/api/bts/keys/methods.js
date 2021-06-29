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

import BtsKeys from './btsKeys.js';

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

//  export const countersIncrease = new ValidatedMethod({
//    name: 'counters.increase',
//    mixins,
//    beforeHooks: [beforeHookExample],
//    afterHooks: [afterHookExample],
//    checkLoggedInError,
//    validate: new SimpleSchema({
//      _id: {
//        type: String,
//        optional: false,
//      },
//    }).validator(),
//    run({ _id }) {
//      // console.log('counters.increase', _id);
//      if (Meteor.isServer) {
//        // secure code - not available on the client
//      }
//      // call code on client and server (optimistic UI)
//      return Counters.update(
//        { _id },
//        {
//          $inc: {
//            count: 1,
//          },
//        }
//      );
//    },
//  });

/**
 * used for example test in methods.tests.js
 */
export const btsKeysInsert = new ValidatedMethod({
  name: 'btsKeys.insert',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    academicYear: {
      type: String,
    },
    examNumber: {
      type: SimpleSchema.Integer,
    },
    grade: {
      type: SimpleSchema.Integer,
    },
    day: {
      type: SimpleSchema.Integer,
    },
    variant: {
      type: String,
    },
    keys: Array,
    'keys.$': {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  checkLoggedInError,
  run({ academicYear, examNumber, grade, day, variant, keys }) {
    // console.log('counters.insert', _id);
    const recordInDB = BtsKeys.findOne({
      academicYear,
      examNumber,
      grade,
      day,
      variant,
    });
    if (recordInDB) {
      BtsKeys.update({ _id: recordInDB._id }, { $set: { keys: keys } });
      return recordInDB._id;
    } else {
      const _id = Random.id();
      const keyId = BtsKeys.insert({
        _id,
        academicYear,
        examNumber,
        grade,
        day,
        variant,
        keys,
      });
      return keyId;
    }
  },
});

/**
 * used for example test in methods.tests.js
 */
export const btsKeysDelete = new ValidatedMethod({
  name: 'btsKeys.delete',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  checkLoggedInError,
  run({ _id }) {
    return BtsKeys.remove({ _id });
  },
});
