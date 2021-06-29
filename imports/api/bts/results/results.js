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
    type: String,
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
});

// attach schema
BtsResults.attachSchema(Schema);

export default BtsResults;
