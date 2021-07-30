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

import Schools from './schools.js';

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

export const schoolsGetDistinct = new ValidatedMethod({
  name: 'schools.getDistinct',
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
      Schools.find(
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

export const schoolsInsert = new ValidatedMethod({
  name: 'schools.insert',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    schoolId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
    shortName: {
      type: String,
    },
    fullName: {
      type: String,
      optional: true,
    },
    secondaryName: {
      type: String,
      optional: true,
    },
    schoolType: {
      type: String,
    },
    region: {
      type: String,
    },
    userId: {
      type: String,
    },
    oldSchoolId: {
      type: String,
      optional: true,
    },
    schoolAccount: {
      type: String,
    },
    schoolPassword: {
      type: String,
    },
  }).validator(),
  checkLoggedInError,
  run(toInsert) {
    const recordInDB = Schools.findOne({
      schoolId: toInsert.schoolId,
    });
    if (recordInDB) {
      Schools.update({ _id: recordInDB._id }, { $set: toInsert });
      return recordInDB._id;
    } else {
      const keyId = Schools.insert(toInsert);
      return keyId;
    }
  },
});

export const schoolsDeleteBySchoolId = new ValidatedMethod({
  name: 'schools.deleteBySchoolId',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    schoolId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
  }).validator(),
  checkLoggedInError,
  run({ schoolId }) {
    return Schools.remove({ schoolId });
  },
});
