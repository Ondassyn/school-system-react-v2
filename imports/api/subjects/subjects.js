// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const Subjects = new Mongo.Collection('subjects');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
  },
  subjectId: {
    type: String,
  },
  name_en: {
    type: String,
  },
});

// attach schema
Subjects.attachSchema(Schema);

export default Subjects;
