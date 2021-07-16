import React, { useState, useEffect } from 'react';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import MaterialTable, { MTableToolbar } from 'material-table';
import TableIcons from '../../../components/MaterialTable/TableIcons';

import { Upload } from './Upload/Upload';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';

// collections
import BtsResults from '../../../../api/bts/results/results';
import Schools from '../../../../api/schools/schools';
import Students from '../../../../api/students/students';
import BtsKeys from '../../../../api/bts/keys/btsKeys';

import useDrawer from '../../../../api/drawer/drawerConsumer';

import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import InsertChartOutlinedIcon from '@material-ui/icons/InsertChartOutlined';
import ListAltOutlinedIcon from '@material-ui/icons/ListAltOutlined';

const DRAWER_TITLE = { title: 'BTS', link: '/bts' };

const DRAWER_MENU = [
  { title: 'Answer keys', icon: <VpnKeyOutlinedIcon />, link: '/bts/keys' },
  { title: 'Results', icon: <ListAltOutlinedIcon />, link: '/bts/results' },
  { title: 'Rating', icon: <InsertChartOutlinedIcon />, link: '/bts/ratings' },
];

const Results = props => {
  const [blocking, setBlocking] = useState(false);
  const { setDrawer, setDrawerTitle } = useDrawer();

  useEffect(() => {
    setDrawerTitle(DRAWER_TITLE);
    setDrawer(DRAWER_MENU);
  }, []);

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
    <BlockUi
      tag="div"
      blocking={blocking}
      message="Please wait"
      keepInView="true"
    >
      <div className="results-page">
        <Upload setBlocking={setBlocking} currentYear={props.currentYear} />
        <MaterialTable
          title="BTS Results"
          columns={COLUMNS}
          data={props.results.map(result => {
            let school = props.schools.find(
              e => e.schoolId === result.schoolId
            );
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
    </BlockUi>
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

  // const ratingsSub = Meteor.subscribe(
  //   'btsRatings.academicYear',
  //   props.currentYear
  // );
  // const ratings = BtsRatings.find().fetch();
  // const ratingsReady = ratingsSub.ready() && !!ratings;

  const schoolsSub = Meteor.subscribe('schools.all');
  const schools = Schools.find().fetch();
  const schoolsReady = schoolsSub.ready() && !!schools;

  const studentsSub = Meteor.subscribe('students.all');
  const students = Students.find().fetch();
  const studentsReady = studentsSub.ready() && !!students;

  const keysSub = Meteor.subscribe('btsKeys.academicYear', props.currentYear);
  const keys = BtsKeys.find().fetch();
  const keysReady = keysSub.ready() && !!keys;

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,
    resultsReady,
    results,
    schools,
    students,
    // ratings,
    keys,
  };
})(Results);
