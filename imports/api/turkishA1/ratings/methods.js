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

import TurkishA1Ratings from './ratings.js';

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

export const turkishA1RatingsGetDistinct = new ValidatedMethod({
  name: 'turkishA1Ratings.getDistinct',
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
      TurkishA1Ratings.find(
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

export const turkishA1RatingsInsert = new ValidatedMethod({
  name: 'turkishA1Ratings.insert',
  mixins: [CallPromiseMixin],
  validate: null,
  checkLoggedInError,
  run(schoolRating) {
    // console.log('counters.insert', _id);
    const recordInDB = TurkishA1Ratings.findOne({
      academicYear: schoolRating.academicYear,
      examNumber: schoolRating.examNumber,
      schoolId: schoolRating.schoolId,
      grade: schoolRating.grade,
    });
    if (recordInDB) {
      TurkishA1Ratings.update({ _id: recordInDB._id }, { $set: schoolRating });
      return recordInDB._id;
    } else {
      const keyId = TurkishA1Ratings.insert(schoolRating);
      return keyId;
    }
  },
});
