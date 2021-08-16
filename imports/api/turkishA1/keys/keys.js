// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const TurkishA1Keys = new Mongo.Collection('TurkishA1AnswerKeys');

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
TurkishA1Keys.attachSchema(Schema);

export default TurkishA1Keys;
