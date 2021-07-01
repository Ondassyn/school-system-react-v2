import React, { useState } from 'react';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import MaterialTable, { MTableToolbar } from 'material-table';
import TableIcons from '../../../components/MaterialTable/TableIcons';

import BtsResults from '../../../../api/bts/results/results';
import Schools from '../../../../api/schools/schools';
import { Upload } from './Upload/Upload';

const Results = props => {
  const lookupParser = fieldName => {
    return Meteor.apply('btsResults.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      return { ...obj, [item]: item };
    }, {});
  };

  const lookupSchoolParser = fieldName => {
    return Meteor.apply('btsResults.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      let school = props.schools.find(e => e.schoolId === item);
      let schoolName = school ? school.shortName : '';
      return { ...obj, [schoolName]: schoolName };
    }, {});
  };

  const COLUMNS = [
    {
      title: 'Year',
      field: 'academicYear',
      lookup: lookupParser('academicYear'),
    },
    {
      title: 'Exam Number',
      field: 'examNumber',
      lookup: lookupParser('examNumber'),
    },
    {
      title: 'School',
      field: 'schoolName',
      lookup: lookupSchoolParser('schoolId'),
    },
    {
      title: 'Grade',
      field: 'grade',
      lookup: lookupParser('grade'),
    },
    {
      title: 'Division',
      field: 'division',
      lookup: lookupParser('division'),
    },
    {
      title: 'Surname',
      field: 'surname',
    },
    {
      title: 'Name',
      field: 'name',
    },
    {
      title: 'Total',
      field: 'total',
    },
  ];

  return (
    <div className="results-page">
      <Upload />
      <MaterialTable
        title="BTS Results"
        columns={COLUMNS}
        data={props.results.map(result => {
          let school = props.schools.find(e => e.schoolId === result.schoolId);
          let schoolName = school ? school.shortName : '';
          return {
            academicYear: result.academicYear,
            examNumber: result.examNumber,
            schoolName,
            grade: result.grade,
            division: result.division,
            surname: result.surname,
            name: result.name,
            total: result.total,
          };
        })}
        icons={TableIcons}
        options={{
          // search: false,
          // paging: false,
          filtering: true,
          // exportButton: false,
        }}
      />
    </div>
  );
};

export default withTracker(props => {
  // remote example (if using ddp)
  /*
      const usersSub = Remote.subscribe('users.friends'); // publication needs to be set on remote server
      const users = Users.find().fetch();
      const usersReady = usersSub.ready() && !!users;
      */

  // counters example
  const resultsSub = Meteor.subscribe(
    'btsResults.academicYear',
    props.currentYear
  );
  const results = BtsResults.find().fetch();
  const resultsReady = resultsSub.ready() && !!results;

  const schoolsSub = Meteor.subscribe('schools.all');
  const schools = Schools.find().fetch();
  const schoolsReady = schoolsSub.ready() && !!schools;

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,
    resultsReady,
    results,
    schools,
  };
})(Results);
