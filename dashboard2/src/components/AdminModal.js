import React from 'react';
import { Button, Header, Modal } from 'semantic-ui-react';

const AdminModal = (props) => {
  const { closeAdminModal, modalOpen, title } = props;

  return (
    <Modal
      open={!!modalOpen}
      onClose={() => {
        closeAdminModal();
      }}
    >
      <Header>
        {title} {modalOpen}
      </Header>
      <Modal.Content>
        Store may be changed. Consider performing Backup Store first.
      </Modal.Content>
      <Modal.Actions>
        <Button
          secondary
          onClick={() => {
            closeAdminModal();
          }}
        >
          Cancel
        </Button>
        <Button
          primary
          onClick={() => {
            closeAdminModal(modalOpen);
          }}
        >
          OK
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default AdminModal;
