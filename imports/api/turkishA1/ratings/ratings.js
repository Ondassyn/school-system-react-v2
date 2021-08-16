// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const TurkishA1Ratings = new Mongo.Collection('TurkishA1Ratings');

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
  schoolId: {
    type: String,
  },
  grade: SimpleSchema.oneOf(String, SimpleSchema.Integer),
  totalAverage: {
    type: Number,
  },
  averages: Array,
  'averages.$': {
    type: Object,
    blackbox: true,
  },
});

// attach schema
TurkishA1Ratings.attachSchema(Schema);

export default TurkishA1Ratings;
