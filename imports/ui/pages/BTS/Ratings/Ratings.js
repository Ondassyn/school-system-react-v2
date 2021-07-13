import React, { useState, useEffect } from 'react';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import MaterialTable, { MTableToolbar } from 'material-table';
import TableIcons from '../../../components/MaterialTable/TableIcons';

// collections
import BtsRatings from '../../../../api/bts/ratings/ratings';
import Subjects from '../../../../api/subjects/subjects';
import Schools from '../../../../api/schools/schools';

const Ratings = props => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    let headers = [];
    props.ratings?.map(rating => {
      rating.averages?.map(average => {
        !headers.some(e => e.field === average.subjectId) &&
          headers.push({
            title: props.subjects?.find(s => s.subjectId === average.subjectId)
              .name_en,
            field: average.subjectId,
          });
      });
    });
    setColumns(COLUMNS.concat(headers));
  }, [props.ratings]);

  const lookupParser = fieldName => {
    return Meteor.apply('btsRatings.getDistinct', [fieldName], {
      returnStubValue: true,
    }).reduce((obj, item) => {
      return { ...obj, [item]: item };
    }, {});
  };

  const lookupSchoolParser = fieldName => {
    return Meteor.apply('btsRatings.getDistinct', [fieldName], {
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
      title: 'Total',
      field: 'total',
    },
  ];

  return (
    <div className="ratings-page">
      <MaterialTable
        title="BTS Ratings"
        columns={columns}
        data={props.ratings.map(result => {
          let school = props.schools.find(e => e.schoolId === result.schoolId);
          let schoolName = school ? school.shortName : '';
          let returnObject = {
            academicYear: result.academicYear,
            examNumber: result.examNumber,
            schoolName,
            grade: result.grade,
            division: result.division,
            surname: result.surname,
            name: result.name,
            total: result.totalAverage.toFixed(2),
          };
          result.averages?.map(average => {
            returnObject[average.subjectId] = average.average.toFixed(2);
          });
          return returnObject;
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

  const ratingsSub = Meteor.subscribe(
    'btsRatings.academicYear',
    props.currentYear
  );
  const ratings = BtsRatings.find().fetch();
  const ratingsReady = ratingsSub.ready() && !!ratings;

  const subjectsSub = Meteor.subscribe('subjects.all');
  const subjects = Subjects.find().fetch();
  const subjectsReady = subjectsSub.ready() && !!subjects;

  const schoolsSub = Meteor.subscribe('schools.all');
  const schools = Schools.find().fetch();
  const schoolsReady = schoolsSub.ready() && !!schools;

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,
    ratings,
    subjects,
    schools,
  };
})(Ratings);
