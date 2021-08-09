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

import TeacherTransfers from './teacherTransfers.js';

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

export const teacherTransfersGetDistinct = new ValidatedMethod({
  name: 'teacherTransfers.getDistinct',
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
      TeacherTransfers.find(
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

export const teacherTransfersInsert = new ValidatedMethod({
  name: 'teacherTransfers.insert',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: {
      type: String,
      optional: true,
    },
    schoolId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    teacherId: SimpleSchema.oneOf(
      { type: String, optional: true },
      { type: SimpleSchema.Integer, optional: true }
    ),
    subjectId: {
      type: String,
    },

    surname: {
      type: String,
    },
    name: {
      type: String,
    },
    academicDegree: {
      type: String,
      optional: true,
    },
    iin: {
      type: String,
      optional: true,
    },
    birthDate: {
      type: String,
      optional: true,
    },
    gender: {
      type: String,
      optional: true,
    },
    category: {
      type: String,
      optional: true,
    },
    email: {
      type: String,
      optional: true,
    },
    position: { type: String, optional: true },
    graduatedFrom: { type: String, optional: true },
    workingHours: SimpleSchema.oneOf(
      { type: String, optional: true },
      { type: SimpleSchema.Integer, optional: true }
    ),
    workExperience: SimpleSchema.oneOf(
      { type: String, optional: true },
      { type: SimpleSchema.Integer, optional: true }
    ),
    oldSchoolId: { type: String, optional: true },
    ielts: SimpleSchema.oneOf(
      { type: Number, optional: true },
      { type: String, optional: true }
    ),
  }).validator(),
  checkLoggedInError,
  run(toInsert) {
    const recordInDB = TeacherTransfers.findOne({
      teacherId: toInsert.teacherId,
    });

    if (recordInDB) {
      TeacherTransfers.update({ _id: recordInDB._id }, { $set: toInsert });
      return recordInDB.teacherId;
    } else {
      const keyId = TeacherTransfers.insert(toInsert);
      return toInsert.teacherId;
    }
  },
});

export const teacherTransfersDeleteByTeacherId = new ValidatedMethod({
  name: 'teacherTransfers.deleteByTeacherId',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    teacherId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
  }).validator(),
  checkLoggedInError,
  run({ teacherId }) {
    return TeacherTransfers.remove({ teacherId });
  },
});
