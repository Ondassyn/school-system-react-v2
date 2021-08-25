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

import SatResults from './results.js';

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

export const satResultsGetDistinct = new ValidatedMethod({
  name: 'satResults.getDistinct',
  mixins,
  checkLoggedInError,
  validate: null,
  run(fieldName) {
    // if (Meteor.isServer) {
    //   returnValues = Meteor.wrapAsync(callback => {
    //     SatResults.rawCollection().distinct('grade', callback);
    //   })();
    // }

    let distinctFieldValues = _.uniq(
      SatResults.find(
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

export const satResultsInsert = new ValidatedMethod({
  name: 'satResults.insert',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    schoolId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    studentId: SimpleSchema.oneOf(
      { type: String, optional: true },
      { type: SimpleSchema.Integer, optional: true }
    ),
    grade: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    total: {
      type: Number,
    },
    updatedAt: {
      type: Date,
    },
    results: Array,
    'results.$': {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  checkLoggedInError,
  run(studentResult) {
    // console.log('counters.insert', _id);
    const recordInDB = SatResults.findOne({
      studentId: studentResult.studentId,
    });
    if (recordInDB) {
      SatResults.update({ _id: recordInDB._id }, { $set: studentResult });
      return recordInDB._id;
    } else {
      const keyId = SatResults.insert(studentResult);
      return keyId;
    }
  },
});
