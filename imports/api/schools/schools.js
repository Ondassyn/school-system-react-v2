// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const Schools = new Mongo.Collection('schools');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
    optional: true,
  },
  schoolId: SimpleSchema.oneOf(String, SimpleSchema.Integer),
  shortName: {
    type: String,
  },
  fullName: {
    type: String,
    optional: true,
  },
  secondaryName: {
    type: String,
    optional: true,
  },
  schoolType: {
    type: String,
  },
  region: {
    type: String,
  },
  userId: {
    type: String,
  },
  oldSchoolId: {
    type: String,
    optional: true,
  },
  schoolAccount: {
    type: String,
  },
  schoolPassword: {
    type: String,
  },
});

// attach schema
Schools.attachSchema(Schema);

export default Schools;
