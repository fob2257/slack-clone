import React, { useState } from 'react';
import { Modal, Input, Button, Icon } from 'semantic-ui-react';
import mime from 'mime-types';

const FileModal = ({ modal, closeModal, uploadFile }) => {
  const [file, setFile] = useState(null);

  const addFile = e => {
    const { target: { files: [file] } } = e;

    if (file) setFile(file);
  };

  const sendFile = () => {
    if (file === null) return;

    const authorized = ['image/jpeg', 'image/png'];
    if (!authorized.includes(mime.lookup(file.name))) return;

    const metadata = { contentType: mime.lookup(file.name) };

    uploadFile(file, metadata);

    closeModal();
    setFile(null);
  };

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select An Image File</Modal.Header>
      <Modal.Content>
        <Input
          fluid
          name='file'
          type='file'
          label='File types: jpg, png'
          onChange={addFile}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button
          inverted
          color='green'
          onClick={sendFile}
        >
          <Icon name='checkmark' /> Send
        </Button>
        <Button
          inverted
          color='red'
          onClick={closeModal}
        >
          <Icon name='remove' /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
