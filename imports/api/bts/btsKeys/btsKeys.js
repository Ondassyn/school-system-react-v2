// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const BtsKeys = new Mongo.Collection('bts_keys');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
  },
  academicYear: {
    type: String,
  },
  examNumber: {
    type: SimpleSchema.Integer,
  },
  grade: {
    type: SimpleSchema.Integer,
  },
  day: {
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
});

// attach schema
BtsKeys.attachSchema(Schema);

export default BtsKeys;
