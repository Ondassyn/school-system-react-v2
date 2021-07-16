import React, { useState, useEffect } from 'react';
import Select from '@material-ui/core/Select';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import AddIcon from '@material-ui/icons/Add';

import Button from '@material-ui/core/Button';

import { SelectSubject } from './SelectSubject';
import { btsKeysInsert } from '../../../../../api/bts/keys/methods';
import TransitionModal from '../../../../components/TransitionModal/TransitionModal';
import FormControl from '@material-ui/core/FormControl';

import MenuItem from '@material-ui/core/MenuItem';

import './style.scss';
import useSnackbars from '../../../../../api/notifications/snackbarConsumer';

import { makeStyles, useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {});

const GRADES = [7, 8, 9, 10];

const DAYS = [1, 2];

const EXAM_NUMBERS = [1, 2, 3, 4];

export default AddKey = props => {
  const classes = useStyles();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [academicYear, setAcademicYear] = props.initialData
    ? useState(props.initialData.academicYear)
    : useState(props.currentYear);
  const [grade, setGrade] = props.initialData
    ? useState(props.initialData.grade)
    : useState();
  const [examNumber, setExamNumber] = props.initialData
    ? useState(props.initialData.examNumber)
    : useState('');
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
      <FormControl className={classes.formControl}>
        {/* <p>Select year</p>
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
      ></Select>
      <p>Select grade</p>
      <Select
        name="grade"
        onChange={event => setGrade(event.value)}
        options={GRADES}
        defaultValue={
          grade ? GRADES[GRADES.findIndex(e => e.value === grade)] : undefined
        }
      /> */}

        <p>Select exam number</p>
        <Select
          value={examNumber}
          onChange={event => setExamNumber(event.target.value)}
          // options={EXAM_NUMBERS}
          // defaultValue={
          //   examNumber
          //     ? EXAM_NUMBERS[EXAM_NUMBERS.findIndex(e => e === examNumber)]
          //     : ''
          // }
        >
          {EXAM_NUMBERS.map(e => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </Select>

        {/* <p>Select day</p>
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
      /> */}
      </FormControl>
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
        <EditOutlinedIcon
          // className="btn btn-lg btn-danger center modal-button"
          className="icon"
          onClick={showModal}
        />
      ) : (
        // <AddIcon className="icon" onClick={showModal} />
        <Button variant="outlined" color="primary" onClick={showModal}>
          Add
        </Button>
      )}
      <TransitionModal form={form} isOpen={modalIsOpen} close={closeModal} />
    </div>
  );
};
