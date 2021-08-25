// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const SatRatings = new Mongo.Collection('SatRatings');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
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
SatRatings.attachSchema(Schema);

export default SatRatings;
