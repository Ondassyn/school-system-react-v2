import React from 'react';

import { SubjectList } from './SubjectList';

export const SelectSubject = props => {
  return (
    <div className="select-subject">
      <div className="row" style={{ marginTop: 20 }}>
        <div className="col-sm-1" />
        <div className="col-sm-10">
          <div className="container">
            <div className="row">
              <SubjectList
                add={addRow}
                delete={deleteRow}
                subjectKeys={props.subjectKeys}
                subjects={props.subjects}
                setSubjectId={props.setSubjectId}
                setSubjectKeys={props.setSubjectKeys}
              />
            </div>
          </div>
        </div>
        <div className="col-sm-1" />
      </div>
    </div>
  );
};
