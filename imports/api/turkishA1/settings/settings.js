// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const TurkishA1Settings = new Mongo.Collection('TurkishA1Settings');

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
  sections: Array,
  'sections.$': {
    type: Object,
    blackbox: true,
  },
});

// attach schema
TurkishA1Settings.attachSchema(Schema);

export default TurkishA1Settings;
