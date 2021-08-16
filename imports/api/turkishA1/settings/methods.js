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

import TurkishA1Settings from './settings.js';

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

export const turkishA1SettingsGetDistinct = new ValidatedMethod({
  name: 'turkishA1Settings.getDistinct',
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
      TurkishA1Settings.find(
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

export const turkishA1SettingsInsert = new ValidatedMethod({
  name: 'turkishA1Settings.insert',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    academicYear: { type: String },
    examNumber: { type: SimpleSchema.Integer },
    grade: { type: SimpleSchema.Integer },
    subjects: Array,
    'subjects.$': {
      type: Object,
      blackbox: true,
    },
  }).validator(),
  checkLoggedInError,
  run(toInsert) {
    // console.log('counters.insert', _id);
    const recordInDB = TurkishA1Settings.findOne({
      academicYear: toInsert.academicYear,
      examNumber: toInsert.examNumber,
      grade: toInsert.grade,
    });
    if (recordInDB) {
      TurkishA1Settings.update({ _id: recordInDB._id }, { $set: toInsert });
      return recordInDB._id;
    } else {
      const keyId = TurkishA1Settings.insert(toInsert);
      return keyId;
    }
  },
});

export const turkishA1SettingsDelete = new ValidatedMethod({
  name: 'turkishA1Settings.delete',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  checkLoggedInError,
  run({ _id }) {
    return TurkishA1Settings.remove({ _id });
  },
});
