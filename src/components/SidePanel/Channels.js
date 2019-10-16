import React, { useState, useEffect } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { fireDatabase } from '../../firebase/firebase.util';

import { setCurrentChannel } from '../../redux/actions/channelActions';

const Channels = ({ currentUser, currentChannel, setCurrentChannel }) => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDetails, setChannelDetails] = useState('');

  const channelsRef = fireDatabase.ref('channels');

  const addListener = () => {
    let timeoutId = null;
    const loadedChannels = [];

    channelsRef.on('child_added', snapShot => {
      const arrLength = loadedChannels.push(snapShot.val());
      // console.log(loadedChannels);
      if (timeoutId !== null) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        setChannels(loadedChannels);
        clearTimeout(timeoutId);
      }, 1000);

      if (arrLength === 1) setCurrentChannel(loadedChannels[arrLength - 1]);
    });
  };

  useEffect(() => {
    addListener();

    return () => {
      // remove listeners
      channelsRef.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    setChannelName('');
    setChannelDetails('');
    setModal(false);
  };

  const isFormValid = () => channelName.length && channelDetails.length;

  const addChannel = async () => {
    try {
      const key = channelsRef.push().key;

      const newChannel = {
        id: key,
        name: channelName,
        details: channelDetails,
        createdBy: {
          name: currentUser.displayName,
          avatar: currentUser.photoUrl,
        },
      };

      await channelsRef.child(key).update(newChannel);

      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!isFormValid()) return;

    addChannel();
  };

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
        {
          channels.map(channel => (
            <Menu.Item
              key={channel.id}
              name={channel.name}
              style={{ opacity: 0.7 }}
              onClick={() => setCurrentChannel(channel)}
              active={currentChannel && currentChannel.id === channel.id}
            >
              # {channel.name}
            </Menu.Item>
          ))
        }
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

const mapStateToProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
});

const mapDispatchToProps = dispatch => ({
  setCurrentChannel: channel => dispatch(setCurrentChannel(channel)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
