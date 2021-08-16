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

import TurkishA1Results from './results.js';

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

export const turkishA1ResultsGetDistinct = new ValidatedMethod({
  name: 'turkishA1Results.getDistinct',
  mixins,
  checkLoggedInError,
  validate: null,
  run(fieldName) {
    // if (Meteor.isServer) {
    //   returnValues = Meteor.wrapAsync(callback => {
    //     TurkishA1Results.rawCollection().distinct('grade', callback);
    //   })();
    // }

    let distinctFieldValues = _.uniq(
      TurkishA1Results.find(
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

export const turkishA1ResultsInsert = new ValidatedMethod({
  name: 'turkishA1Results.insert',
  mixins: [CallPromiseMixin],
  validate: null,
  checkLoggedInError,
  run(studentResult) {
    // console.log('counters.insert', _id);
    const recordInDB = TurkishA1Results.findOne({
      academicYear: studentResult.academicYear,
      examNumber: studentResult.examNumber,
      studentId: studentResult.studentId,
    });
    if (recordInDB) {
      TurkishA1Results.update({ _id: recordInDB._id }, { $set: studentResult });
      return recordInDB._id;
    } else {
      const keyId = TurkishA1Results.insert(studentResult);
      return keyId;
    }
  },
});
