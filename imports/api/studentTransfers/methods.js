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

import StudentTransfers from './studentTransfers.js';

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

export const studentTransfersGetDistinct = new ValidatedMethod({
  name: 'studentTransfers.getDistinct',
  mixins,
  checkLoggedInError,
  validate: null,
  run(fieldName) {
    // if (Meteor.isServer) {
    //   returnValues = Meteor.wrapAsync(callback => {
    //     BtsResults.rawCollection().distinct('grade', callback);
    //   })();
    // }

    let distinctFieldValues = _.uniq(
      StudentTransfers.find(
        {},
        {
          sort: { [fieldName]: 1 },
          fields: { [fieldName]: true },
        }
      )
        .fetch()
        .map(e => e[fieldName]),
      true
    );

    return distinctFieldValues;
  },
});

export const studentTransfersInsert = new ValidatedMethod({
  name: 'studentTransfers.insert',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    schoolId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    studentId: SimpleSchema.oneOf(
      { type: String },
      { type: SimpleSchema.Integer }
    ),
    grade: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    division: {
      type: String,
    },
    surname: {
      type: String,
    },
    name: {
      type: String,
    },
    languageGroup: {
      type: String,
    },
    olympiad: {
      type: String,
      optional: true,
    },
    electiveGroup: {
      type: String,
      optional: true,
    },
    level: {
      type: String,
      optional: true,
    },
  }).validator(),
  checkLoggedInError,
  run(toInsert) {
    const recordInDB = StudentTransfers.findOne({
      studentId: toInsert.studentId,
    });

    if (recordInDB) {
      StudentTransfers.update({ _id: recordInDB._id }, { $set: toInsert });
      return recordInDB.studentId;
    } else {
      const keyId = StudentTransfers.insert(toInsert);
      return toInsert.studentId;
    }
  },
});

export const studentTransfersDeleteByStudentId = new ValidatedMethod({
  name: 'studentTransfers.deleteByStudentId',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    studentId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
  }).validator(),
  checkLoggedInError,
  run({ studentId }) {
    return StudentTransfers.remove({ studentId });
  },
});
