import React, { useState } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

import { fireStore, fireDatabase } from '../../firebase/firebase.util';

const Channels = () => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDetails, setChannelDetails] = useState('');

  const closeModal = () => {
    setChannelName('');
    setChannelDetails('');
    setModal(false);
  };

  const isFormValid = () => channelName.length && channelDetails.length;

  const addChannel = async () => {
    const channelsRef = fireDatabase.ref('channels');

    const key = channelsRef.push().key;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!isFormValid()) return;

    addChannel();
  }

  return (
    <React.Fragment>
      <Menu.Menu style={{ paddingBottom: '2em' }}>
        <Menu.Item>
          <span>
            <Icon name='exchange' /> CHANNELS
          </span>
          {' '}
          ({channels.length})
          <Icon
            name='add'
            onClick={() => setModal(true)}
          />
        </Menu.Item>
      </Menu.Menu>

      <Modal
        basic
        open={modal}
        onClose={closeModal}
      >
        <Modal.Header>Add A Channel</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                fluid
                label='Name Of Channel'
                name='channelName'
                onChange={(e) => setChannelName(e.target.value)}
              />
            </Form.Field>

            <Form.Field>
              <Input
                fluid
                label='About The Channel'
                name='channelDetails'
                onChange={(e) => setChannelDetails(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button
            color='green'
            inverted
            onClick={handleSubmit}
          >
            <Icon name='checkmark' /> Add
          </Button>
          <Button
            color='red'
            inverted
            onClick={closeModal}
          >
            <Icon name='remove' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};

export default Channels;
