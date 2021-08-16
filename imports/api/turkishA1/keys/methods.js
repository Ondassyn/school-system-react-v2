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

import TurkishA1Keys from './keys.js';

/** **************** Helpers **************** */

const mixins = [LoggedInMixin, MethodHooks, CallPromiseMixin];

// not logged in error message
const checkLoggedInError = {
  error: 'notLogged',
  message: 'You need to be logged in to call this method',
  reason: 'You need to login',
};

/** **************** Methods **************** */

export const turkishA1KeysGetDistinct = new ValidatedMethod({
  name: 'turkishA1Keys.getDistinct',
  mixins,
  checkLoggedInError,
  validate: null,
  run(fieldName) {
    let distinctFieldValues = _.uniq(
      TurkishA1Keys.find(
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

/**
 * used for example test in methods.tests.js
 */
export const turkishA1KeysInsert = new ValidatedMethod({
  name: 'turkishA1Keys.insert',
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
    const recordInDB = TurkishA1Keys.findOne({
      academicYear,
      examNumber,
      grade,
      day,
      variant,
    });
    if (recordInDB) {
      TurkishA1Keys.update({ _id: recordInDB._id }, { $set: { keys: keys } });
      return recordInDB._id;
    } else {
      const _id = Random.id();
      const keyId = TurkishA1Keys.insert({
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
export const turkishA1KeysDelete = new ValidatedMethod({
  name: 'turkishA1Keys.delete',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  checkLoggedInError,
  run({ _id }) {
    return TurkishA1Keys.remove({ _id });
  },
});
