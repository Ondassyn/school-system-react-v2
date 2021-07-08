import React, { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import TransitionsModal from '../../../../components/TransitionModal/TransitionModal';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

import Input from '@material-ui/core/Input';

import { upload } from '../../../../../api/bts/results/upload';
import useSnackbars from '../../../../../api/notifications/snackbarConsumer';

const EXAM_NUMBERS = [1, 2, 3, 4];
const DAYS = [1, 2];

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export const Upload = ({ setBlocking, currentYear }) => {
  const classes = useStyles();
  const { showSnackbar } = useSnackbars();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [examNumber, setExamNumber] = useState('');
  const [day, setDay] = useState('');
  const [file, setFile] = useState(null);

  const showModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const processData = async data => {
    if (!data) {
      showSnackbar({ message: 'No data is passed', severity: 'error' });
      return;
    }

    if (!currentYear) {
      showSnackbar({
        message: 'Current year is not defined',
        severity: 'error',
      });
      return;
    }

    if (!examNumber) {
      showSnackbar({
        message: 'Exam number is not selected',
        severity: 'error',
      });
      return;
    }

    if (!day) {
      showSnackbar({ message: 'Day is not selected', severity: 'error' });
      return;
    }

    closeModal();
    setBlocking(true);
    await upload({ data, academicYear: currentYear, examNumber, day })
      .then(value => showSnackbar({ message: value, severity: 'success' }))
      .then(calculateRating())
      .catch(value => showSnackbar({ message: value, severity: 'error' }));
    setBlocking(false);
  };

  const onSubmit = e => {
    e.preventDefault();

    if (!file) {
      showSnackbar({ message: 'No file is found', severity: 'error' });
      return;
    }
    let fileReader = new FileReader();
    fileReader.onloadend = () => processData(fileReader.result);
    fileReader.readAsText(file);
  };

  const form = (
    <form onSubmit={onSubmit}>
      <FormControl className={classes.formControl}>
        <InputLabel>Exam Number</InputLabel>
        <Select
          value={examNumber}
          onChange={e => setExamNumber(e.target.value)}
        >
          {EXAM_NUMBERS.map(e => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </Select>
        {/* <FormHelperText>Placeholder</FormHelperText> */}
      </FormControl>
      <FormControl className={classes.formControl}>
        <InputLabel>Day</InputLabel>
        <Select value={day} onChange={e => setDay(e.target.value)}>
          {DAYS.map(e => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </Select>
        {/* <FormHelperText>Placeholder</FormHelperText> */}
      </FormControl>

      <Input
        type="file"
        onChange={e => setFile(e.target.files[0])}
        inputProps={{ accept: '.csv, .txt' }}
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
      <AddIcon className="icon" onClick={showModal} />
      <TransitionsModal form={form} isOpen={modalIsOpen} close={closeModal} />
    </div>
  );
};
