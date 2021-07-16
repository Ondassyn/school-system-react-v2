import Button from '@material-ui/core/Button';
import React from 'react';
import TransitionModal from '../../../components/TransitionModal/TransitionModal';

export default AddUser = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const form = (
    <form onSubmit={onSubmit}>
      <FormControl className={classes.formControl}></FormControl>
    </form>
  );

  return (
    <div>
      <Button variant="outlined" onClick={}>
        Add user
      </Button>
      <TransitionModal form={form} isOpen={modalIsOpen} close={closeModal} />{' '}
    </div>
  );
};
