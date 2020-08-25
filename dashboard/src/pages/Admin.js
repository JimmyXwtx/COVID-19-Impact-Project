import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Container,
  Grid,
  Header,
  Transition,
  Icon,
  Label,
} from 'semantic-ui-react';

import { history } from '../history';

import { reloadStore, lockout } from '../actions';
import AdminModal from '../components/AdminModal';

const Admin = (props) => {
  const {
    admin,
    reloadStore,
    lockout,
    // backupStore,
    // restoreStore,
    // app,
  } = props;
  console.log('Admin ');

  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  useEffect(() => {
    if (!admin) history.push('/dashboard');
  }, [admin]);

  const [modalOpen, setModalOpen] = useState(false);

  const closeAdminModal = (doit) => {
    console.log('closeAdminModal', doit);
    if (doit === 'Update Links') {
      // updateLinksAction_confirmed();
    } else if (doit === 'Export All Validation') {
      // exportAllAction_validation_confirmed();
    } else if (doit === 'Export All Production') {
      // exportAllAction_production_confirmed();
    } else if (doit === 'Promote All Validation to Production') {
      // promoteAllAction_confirmed();
    } else if (doit === 'Renumber') {
      // renumberAction_confirm();
    } else if (doit === 'Delete Archived') {
      // deleteArchivedAction_confirm();
    }
    setModalOpen(false);
  };
  function feedBackText_set(msg) {
    setFeedbackText(msg);
    setFeedbackVisible(true);
  }

  // function setFeedbackVisibleMsg(msg, dur, doneFunc) {
  // setLogResultsHtml(
  //   <div>
  //     {msg.split('\n').map((line) => {
  //       return (
  //         <span>
  //           {line} <br />
  //         </span>
  //       );
  //     })}
  //   </div>
  // );
  // /* const timer = */ setTimeout(() => {
  //   setFeedbackVisible(false);
  //   if (doneFunc) doneFunc();
  // }, dur);
  // }

  function setFeedbackVisibleFalse() {
    setFeedbackVisible(false);
  }

  const reloadStoreAction = async () => {
    feedBackText_set('Reload Store');
    await reloadStore();
    setFeedbackVisibleFalse();
  };

  // const backupStoreAction = async () => {
  //   feedBackText_set('Backup Store');
  //   await backupStore();
  //   setFeedbackVisibleFalse();
  // };

  // const restoreStoreAction = async () => {
  //   feedBackText_set('Restore Store');
  //   await restoreStore();
  //   setFeedbackVisibleFalse();
  // };

  const lockoutAction = async () => {
    feedBackText_set('Store Locked');
    await lockout('Store is currently unavailable. Please try again later.');
    setFeedbackVisibleFalse();
  };

  const unlockAction = async () => {
    feedBackText_set('Store Unlocked');
    await lockout('');
    setFeedbackVisibleFalse();
  };

  return (
    <>
      <Container style={{ marginBottom: '3rem', marginTop: '1rem' }}>
        <Header as="h1">Visualization of COVID-19 stats</Header>
        <p>
          Visualization of COVID-19 of data from <br />
          2019 Novel Coronavirus COVID-19 (2019-nCoV) Data Repository by Johns
          Hopkins CSSE <br />
          https://github.com/CSSEGISandData/COVID-19 <br />
        </p>
      </Container>
      <Container style={{ marginBottom: '3rem' }}>
        <Grid style={{ marginBottom: '1.5rem' }}>
          <Button onClick={reloadStoreAction}>Reload Store </Button>
          <Button onClick={lockoutAction}>Lock Store </Button>
          <Button onClick={unlockAction}>Unlock Store</Button>
        </Grid>
      </Container>

      <AdminModal
        closeAdminModal={closeAdminModal}
        modalOpen={modalOpen}
        title={'Confirm'}
      />

      <Transition visible={feedbackVisible} animation="scale" duration={500}>
        <Label
          color="green"
          size="massive"
          style={{ position: 'fixed', top: '4rem', left: '1rem' }}
        >
          <Icon name="thumbs up" /> {feedbackText}
        </Label>
      </Transition>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    admin: state.auth.admin,
    app: state.auth.app,
  };
};

export default connect(mapStateToProps, {
  reloadStore,
  // backupStore,
  // restoreStore,
  lockout,
})(Admin);
