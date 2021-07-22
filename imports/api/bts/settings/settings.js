// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const BtsSettings = new Mongo.Collection('BtsSettings');

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
  grade: SimpleSchema.oneOf(String, SimpleSchema.Integer),
  day: {
    type: SimpleSchema.Integer,
  },
  subjects: Array,
  'subjects.$': {
    type: Object,
    blackbox: true,
  },
});

// attach schema
BtsSettings.attachSchema(Schema);

export default BtsSettings;
