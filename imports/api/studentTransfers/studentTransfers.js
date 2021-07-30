// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const StudentTransfers = new Mongo.Collection('StudentTransfers');

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
    type: SimpleSchema.Integer,
  },
  division: {
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
  },
  olympiad: {
    type: String,
    optional: true,
  },
  electiveGroup: {
    type: String,
    optional: true,
  },
  level: {
    type: String,
    optional: true,
  },
});

// attach schema
StudentTransfers.attachSchema(Schema);

export default StudentTransfers;
