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

import KboKeys from './keys.js';

/** **************** Helpers **************** */

const mixins = [LoggedInMixin, MethodHooks, CallPromiseMixin];

// not logged in error message
const checkLoggedInError = {
  error: 'notLogged',
  message: 'You need to be logged in to call this method',
  reason: 'You need to login',
};

/** **************** Methods **************** */

export const kboKeysGetDistinct = new ValidatedMethod({
  name: 'kboKeys.getDistinct',
  mixins,
  checkLoggedInError,
  validate: null,
  run(fieldName) {
    let distinctFieldValues = _.uniq(
      KboKeys.find(
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
export const kboKeysInsert = new ValidatedMethod({
  name: 'kboKeys.insert',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    academicYear: {
      type: String,
    },
    examNumber: {
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
  run({ academicYear, examNumber, variant, keys }) {
    const recordInDB = KboKeys.findOne({
      academicYear,
      examNumber,
      variant,
    });
    if (recordInDB) {
      KboKeys.update({ _id: recordInDB._id }, { $set: { keys: keys } });
      return recordInDB._id;
    } else {
      const keyId = KboKeys.insert({
        academicYear,
        examNumber,
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
export const kboKeysDelete = new ValidatedMethod({
  name: 'kboKeys.delete',
  mixins: [CallPromiseMixin],
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  checkLoggedInError,
  run({ _id }) {
    return KboKeys.remove({ _id });
  },
});
