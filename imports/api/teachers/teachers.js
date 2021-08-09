// Collection definition

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

// define collection
const Teachers = new Mongo.Collection('teachers');

// define schema
const Schema = new SimpleSchema({
  _id: {
    type: String,
  },
  teacherId: {
    type: SimpleSchema.Integer,
  },
  schoolId: {
    type: String,
  },
  subjectId: {
    type: String,
  },

  surname: {
    type: String,
  },
  name: {
    type: String,
  },
  academicDegree: {
    type: String,
    optional: true,
  },
  iin: {
    type: String,
    optional: true,
  },
  birthDate: {
    type: String,
    optional: true,
  },
  gender: {
    type: String,
    optional: true,
  },
  category: {
    type: String,
    optional: true,
  },
  email: {
    type: String,
    optional: true,
  },
  position: { type: String, optional: true },
  graduatedFrom: { type: String, optional: true },
  workingHours: { type: SimpleSchema.Integer, optional: true },
  workExperience: { type: SimpleSchema.Integer, optional: true },
  oldSchoolId: { type: String, optional: true },
  ielts: { type: Number, optional: true },
});

// attach schema
Teachers.attachSchema(Schema);

export default Teachers;
