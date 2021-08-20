// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const BtsResults = new Mongo.Collection('BtsResults');

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
    type: String,
  },
  schoolId: {
    type: SimpleSchema.Integer,
  },
  grade: {
    type: SimpleSchema.Integer,
  },
  division: {
    type: String,
  },
  day: {
    type: SimpleSchema.Integer,
  },
  variant: {
    type: String,
  },
  surname: {
    type: String,
  },
  name: {
    type: String,
  },
  languageGroup: {
    type: String,
    optional: true,
  },
  electiveGroup: {
    type: String,
    optional: true,
  },
  total: {
    type: SimpleSchema.Integer,
  },
  results: Array,
  'results.$': {
    type: Object,
    blackbox: true,
  },
});

// attach schema
BtsResults.attachSchema(Schema);

export default BtsResults;
