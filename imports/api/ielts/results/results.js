// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const IeltsResults = new Mongo.Collection('IeltsResults');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
  },
  studentId: {
    type: SimpleSchema.Integer,
  },
  schoolId: {
    type: String,
  },
  grade: {
    type: String,
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
  results: Array,
  'results.$': {
    type: Object,
    blackbox: true,
  },
});

// attach schema
IeltsResults.attachSchema(Schema);

export default IeltsResults;
