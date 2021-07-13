// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const BtsRatings = new Mongo.Collection('BtsRatings');

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
BtsRatings.attachSchema(Schema);

export default BtsRatings;
