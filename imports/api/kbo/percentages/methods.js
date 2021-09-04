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

import KboPercentages from './percentages.js';

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

export const kboPercentagesGetDistinct = new ValidatedMethod({
  name: 'kboPercentages.getDistinct',
  mixins,
  checkLoggedInError,
  validate: null,
  run(fieldName) {
    // if (Meteor.isServer) {
    //   returnValues = Meteor.wrapAsync(callback => {
    //     KboPercentages.rawCollection().distinct('grade', callback);
    //   })();
    // }

    let distinctFieldValues = _.uniq(
      KboPercentages.find(
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

export const kboPercentagesInsert = new ValidatedMethod({
  name: 'kboPercentages.insert',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    academicYear: {
      type: String,
    },
    examNumber: {
      type: SimpleSchema.Integer,
    },
    schoolId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    studentId: SimpleSchema.oneOf(
      { type: String, optional: true },
      { type: SimpleSchema.Integer, optional: true }
    ),
    grade: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    division: {
      type: String,
    },
    variant: {
      type: String,
      optional: true,
    },
    surname: {
      type: String,
    },
    name: {
      type: String,
    },
    percentages: Array,
    'percentages.$': {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  checkLoggedInError,
  run(studentResult) {
    // console.log('counters.insert', _id);
    const recordInDB = KboPercentages.findOne({
      academicYear: studentResult.academicYear,
      examNumber: studentResult.examNumber,
      studentId: studentResult.studentId,
    });
    if (recordInDB) {
      KboPercentages.update({ _id: recordInDB._id }, { $set: studentResult });
      return recordInDB._id;
    } else {
      const keyId = KboPercentages.insert(studentResult);
      return keyId;
    }
  },
});
