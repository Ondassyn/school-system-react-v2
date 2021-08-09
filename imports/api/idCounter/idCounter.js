// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const IdCounter = new Mongo.Collection('IdCounter');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
  },
  teacherId: {
    type: SimpleSchema.Integer,
  },
  studentId: {
    type: SimpleSchema.Integer,
  },
});

// attach schema
IdCounter.attachSchema(Schema);

export default IdCounter;
