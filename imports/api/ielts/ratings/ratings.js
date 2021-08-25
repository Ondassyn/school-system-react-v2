// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const IeltsRatings = new Mongo.Collection('IeltsRatings');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
  },
  schoolId: {
    type: String,
  },
  grade: SimpleSchema.oneOf(String, SimpleSchema.Integer),
  averages: Array,
  'averages.$': {
    type: Object,
    blackbox: true,
  },
});

// attach schema
IeltsRatings.attachSchema(Schema);

export default IeltsRatings;
