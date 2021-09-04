// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const KboKeys = new Mongo.Collection('KboAnswerKeys');

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
  variant: {
    type: String,
  },
  keys: Array,
  'keys.$': {
    type: Object,
    blackbox: true,
  },
});

// attach schema
KboKeys.attachSchema(Schema);

export default KboKeys;
