import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Alert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';

import { SelectSubject } from './SelectSubject';
import { btsKeysInsert } from '../../../../../api/bts/btsKeys/methods';
import TransitionsModal from '../../../../components/TransitionModal/TransitionModal';

import './style.scss';
import useSnackbars from '../../../../../api/notifications/snackbarConsumer';

const GRADES = [
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
];

const DAYS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
];

const EXAM_NUMBERS = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
];

const ACADEMIC_YEARS = [
  { value: '2015-2016', label: '2015-2016' },
  { value: '2016-2017', label: '2016-2017' },
  { value: '2017-2018', label: '2017-2018' },
  { value: '2019-2019', label: '2019-2019' },
  { value: '2019-2020', label: '2019-2020' },
  { value: '2020-2021', label: '2020-2021' },
];

export default AddKey = props => {
  const [error, setError] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [academicYear, setAcademicYear] = props.initialData
    ? useState(props.initialData.academicYear)
    : useState(props.currentYear);
  const [grade, setGrade] = props.initialData
    ? useState(props.initialData.grade)
    : useState();
  const [examNumber, setExamNumber] = props.initialData
    ? useState(props.initialData.examNumber)
    : useState();
  const [day, setDay] = props.initialData
    ? useState(props.initialData.day)
    : useState();
  const [variant, setVariant] = props.initialData
    ? useState(props.initialData.variant)
    : useState();
  const [keys, setKeys] = props.initialData
    ? useState(
        props.initialData.keys.map(e => {
          return { index: Math.random(), subjectId: e.subjectId, keys: e.keys };
        })
      )
    : useState([{ index: Math.random(), subjectId: '', keys: '' }]);

  const { showSnackbar } = useSnackbars();

  const showModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const onSubmit = event => {
    event.preventDefault(event);

    btsKeysInsert.call(
      {
        academicYear,
        examNumber,
        grade,
        day,
        variant,
        keys: keys.map(e => {
          return { subjectId: e.subjectId, keys: e.keys };
        }),
      },
      (err, res) => {
        if (err) {
          showSnackbar({ message: err.message, severity: 'error' });
        } else {
          // reset();
          showSnackbar({ message: 'Inserted', severity: 'success' });
        }
      }
    );
  };

  const reset = () => {
    setError('');
    setConfirmation('');
    if (!props.initialData) {
      setAcademicYear(props.currentYear);
      setGrade();
      setExamNumber();
      setDay();
      setVariant();
      setKeys([{ index: Math.random(), subjectId: '', keys: '' }]);
    }
  };

  addRow = e => {
    setKeys(oldKeys => [
      ...oldKeys,
      { index: Math.random(), subjectId: '', keys: '' },
    ]);
  };

  deleteRow = record => {
    setKeys(keys.filter(r => r !== record));
  };

  setSubjectId = (idx, value) => {
    let oldKeys = [...keys];
    oldKeys[idx].subjectId = value;
    setKeys(oldKeys);
  };

  setSubjectKeys = (idx, value) => {
    let oldKeys = [...keys];
    oldKeys[idx].keys = value;
    setKeys(oldKeys);
  };

  form = (
    <form onSubmit={onSubmit}>
      {error && (
        <Alert variant="outlined" severity="error">
          {error}
        </Alert>
      )}

      <p>Select year</p>
      <Select
        name="academicYear"
        onChange={event => setAcademicYear(event.value)}
        options={ACADEMIC_YEARS}
        defaultValue={
          academicYear
            ? ACADEMIC_YEARS[
                ACADEMIC_YEARS.findIndex(year => year.value === academicYear)
              ]
            : ACADEMIC_YEARS[
                ACADEMIC_YEARS.findIndex(
                  year => year.value === props.currentYear
                )
              ]
        }
      />
      <p>Select grade</p>
      <Select
        name="grade"
        onChange={event => setGrade(event.value)}
        options={GRADES}
        defaultValue={
          grade ? GRADES[GRADES.findIndex(e => e.value === grade)] : undefined
        }
      />

      <p>Select exam number</p>
      <Select
        name="examNumber"
        onChange={event => setExamNumber(event.value)}
        options={EXAM_NUMBERS}
        defaultValue={
          examNumber
            ? EXAM_NUMBERS[EXAM_NUMBERS.findIndex(e => e.value === examNumber)]
            : undefined
        }
      />

      <p>Select day</p>
      <Select
        name="day"
        onChange={event => setDay(event.value)}
        options={DAYS}
        defaultValue={
          day ? DAYS[DAYS.findIndex(e => e.value === day)] : undefined
        }
      />

      <p>Variant</p>
      <input
        type="text"
        onChange={e => setVariant(e.target.value)}
        placeholder="e.g., 1111"
        name="keys"
        defaultValue={variant ? variant : undefined}
      />

      <SelectSubject
        subjects={props.subjects}
        subjectKeys={keys}
        addRow={addRow}
        deleteRow={deleteRow}
        setSubjectKeys={setSubjectKeys}
        setSubjectId={setSubjectId}
      />

      <div className="form-group">
        <button className="form-control btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </form>
  );

  return (
    <div>
      {props.icon === 'edit' ? (
        <EditIcon
          // className="btn btn-lg btn-danger center modal-button"
          className="icon"
          onClick={showModal}
        />
      ) : (
        <AddIcon className="icon" onClick={showModal} />
      )}
      <TransitionsModal form={form} isOpen={modalIsOpen} close={closeModal} />
    </div>
  );
};
