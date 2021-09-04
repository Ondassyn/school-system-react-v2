// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const KboPercentages = new Mongo.Collection('KboPercentages');

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
  variant: {
    type: String,
    optional: true,
  },
  surname: {
    type: String,
  },
  name: {
    type: String,
  },
  percentages: Array,
  'percentages.$': {
    type: Object,
    blackbox: true,
  },
});

// attach schema
KboPercentages.attachSchema(Schema);

export default KboPercentages;
