// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const TurkishA1Results = new Mongo.Collection('TurkishA1Results');

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
  studentId: {
    type: SimpleSchema.Integer,
  },
  schoolId: {
    type: String,
  },
  grade: {
    type: SimpleSchema.Integer,
  },
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
  total: {
    type: Number,
  },
  results: Array,
  'results.$': {
    type: Object,
    blackbox: true,
  },
});

// attach schema
TurkishA1Results.attachSchema(Schema);

export default TurkishA1Results;
