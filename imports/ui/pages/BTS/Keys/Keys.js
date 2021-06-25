import React, { useState } from 'react';

import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

import MaterialTable, { MTableToolbar } from 'material-table';

// collection
import BtsKeys from '../../../../api/bts/btsKeys/btsKeys';
import Subjects from '../../../../api/subjects/subjects';

import AddKey from './AddKey/AddKey';
import DeleteKey from './DeleteKey/DeleteKey';

function Keys(props) {
  const COLUMNS = [
    {
      title: 'Year',
      field: 'year',
    },
    {
      title: 'Exam Number',
      field: 'examNumber',
    },
    {
      title: 'Grade',
      field: 'grade',
    },
    {
      title: 'Day',
      field: 'day',
    },
    {
      title: 'Variant',
      field: 'variant',
    },
    {
      title: 'SubjectIDs',
      field: 'ids',
    },
  ];

  return (
    <div className="keys-page">
      <MaterialTable
        title="BTS Keys"
        data={props.keys.map(e => {
          let ids = '';
          e.keys.map(f => {
            ids += f.subjectId + ', ';
          });
          if (e.keys.length > 0) ids = ids.replace(/,\s*$/, '');
          return {
            _id: e._id,
            year: e.academicYear,
            examNumber: e.examNumber,
            grade: e.grade,
            day: e.day,
            variant: e.variant,
            ids: ids,
          };
        })}
        columns={[
          ...COLUMNS,
          {
            title: 'Actions',
            render: rowData => {
              return (
                <div>
                  <AddKey
                    icon={'edit'}
                    initialData={props.keys.find(e => e._id === rowData._id)}
                    currentYear={props.currentYear}
                    subjects={props.subjects}
                  />
                  <DeleteKey _id={rowData._id} />
                </div>
              );
            },
          },
        ]}
        components={{
          Toolbar: localProps => (
            <div className="toolbar">
              <MTableToolbar {...localProps} />
              <AddKey
                icon={'add'}
                currentYear={props.currentYear}
                subjects={props.subjects}
              />
            </div>
          ),
        }}
        options={{
          search: false,
          paging: false,
          filtering: true,
          exportButton: false,
        }}
      />
    </div>
  );
}

Keys.defaultProps = {
  // users: null, remote example (if using ddp)
  keys: null,
  subjects: null,
};

Keys.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  // remote example (if using ddp)
  // usersReady: PropTypes.bool.isRequired,
  // users: Meteor.user() ? PropTypes.array.isRequired : () => null,
  keysReady: PropTypes.bool.isRequired,
  currentYear: PropTypes.string.isRequired,
  keys: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      academicYear: PropTypes.string,
      examNumber: PropTypes.number,
      grade: PropTypes.number,
      keys: PropTypes.arrayOf(
        PropTypes.shape({
          subjectId: PropTypes.string,
          keys: PropTypes.string,
        })
      ),
    })
  ),
  subjectsReady: PropTypes.bool.isRequired,
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.object,
      subjectId: PropTypes.string,
      name_en: PropTypes.string,
    })
  ),
};

export default withTracker(props => {
  // remote example (if using ddp)
  /*
    const usersSub = Remote.subscribe('users.friends'); // publication needs to be set on remote server
    const users = Users.find().fetch();
    const usersReady = usersSub.ready() && !!users;
    */

  // counters example
  const btsKeysSub = Meteor.subscribe(
    'btsKeys.academicYear',
    props.currentYear
  );
  const keys = BtsKeys.find().fetch();
  const keysReady = btsKeysSub.ready() && !!keys;

  const subjectsSub = Meteor.subscribe('subjects.all');
  const subjects = Subjects.find().fetch();
  const subjectsReady = subjectsSub.ready() && !!subjects;

  return {
    // remote example (if using ddp)
    // usersReady,
    // users,
    keysReady,
    keys,
    subjectsReady,
    subjects,
  };
})(Keys);
