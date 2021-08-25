// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const SatResults = new Mongo.Collection('SatResults');

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
  total: {
    type: Number,
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
SatResults.attachSchema(Schema);

export default SatResults;
