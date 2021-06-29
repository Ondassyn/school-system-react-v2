// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const Schools = new Mongo.Collection('schools');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
  },
  schoolId: {
    type: String,
  },
  shortName: {
    type: String,
  },
});

// attach schema
Schools.attachSchema(Schema);

export default Schools;
