import React from 'react';
import Select from 'react-select';

export const SubjectList = props => {
  return (
    <div className="subject-list">
      {props.subjectKeys.map((val, idx) => {
        return (
          <div className="form-row" key={val.index}>
            <div className="col">
              <label>Subject</label>
              <Select
                name="subject"
                onChange={e => props.setSubjectId(idx, e.value)}
                options={props.subjects.map(s => {
                  return {
                    value: s.subjectId,
                    label: s.name_en,
                  };
                })}
                // id={subjectIdx}
                data-id={idx}
                defaultValue={
                  val.subjectId
                    ? {
                        value: val.subjectId,
                        label: props.subjects.find(
                          e => e.subjectId === val.subjectId
                        ).name_en,
                      }
                    : undefined
                }
              />
            </div>
            <div className="col">
              <label>Keys</label>
              <input
                type="text"
                onChange={e => props.setSubjectKeys(idx, e.target.value)}
                className="form-control required"
                placeholder="e.g., ABCDE"
                name="keys"
                // id={keysIdx}
                data-id={idx}
                defaultValue={val.keys}
              />
            </div>

            <div className="col p-4">
              {idx === 0 ? (
                undefined
              ) : (
                <button
                  className="btn btn-danger"
                  onClick={() => props.delete(val)}
                >
                  <i className="fa fa-minus" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        );
      })}
      <button
        onClick={() => props.add()}
        type="button"
        className="btn btn-primary text-center"
      >
        <i className="fa fa-plus-circle" aria-hidden="true" />
      </button>
    </div>
  );
};
