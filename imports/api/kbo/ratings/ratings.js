// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const KboRatings = new Mongo.Collection('KboRatings');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
  },
  academicYear: {
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
KboRatings.attachSchema(Schema);

export default KboRatings;
