import React, { useState, useEffect } from 'react';
import {
  Menu,
  Icon,
  Modal,
  Form,
  Input,
  Button,
  Label
} from 'semantic-ui-react';
import { connect } from 'react-redux';

import firebase, { fireDatabase } from '../../firebase/firebase.util';

import {
  setCurrentChannel,
  setPrivateChannel
} from '../../redux/actions/channelActions';

const Channels = ({ currentUser, currentChannel, setCurrentChannel }) => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDetails, setChannelDetails] = useState('');
  const [notifications, setNotifications] = useState({});

  const channelsRef = fireDatabase.ref('channels');
  const messagesRef = fireDatabase.ref('messages');

  const addNotificationListener = channelId => {
    const channelMessagesRef = messagesRef.child(channelId);

    channelMessagesRef.on('value', snapshot => {
      if (
        !notifications.hasOwnProperty(channelId) ||
        (currentChannel && currentChannel.id === channelId)
      ) {
        notifications[channelId] = {
          id: channelId,
          total: snapshot.numChildren(),
          count: 0
        };
      }

      const { total } = notifications[channelId];
      const curr = snapshot.numChildren();
      const res = curr - total;

      if (res > 0) {
        notifications[channelId].count += res;
        notifications[channelId].total = curr;
      }

      setNotifications({ ...notifications });
    });

    return channelMessagesRef;
  };

  useEffect(() => {
    if (!currentChannel && channels.length >= 1) {
      setCurrentChannel(channels[0]);
    } else if (currentChannel) {
      channels.map(({ id }) => addNotificationListener(id));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel, channels]);

  const addListener = () => {
    const values = [];
    channelsRef.on('child_added', snapshot => {
      const val = snapshot.val();

      values.push(val);
      setChannels([...values]);
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
      const channelRef = await channelsRef.push();
      const newChannel = {
        id: channelRef.key,
        name: channelName,
        details: channelDetails,
        createdBy: { ...currentUser },
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      await channelRef.set(newChannel);

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

  const selectChannel = async channel => {
    setCurrentChannel(channel);

    await fireDatabase
      .ref('typing')
      .child(currentChannel.id)
      .child(currentUser.uid)
      .remove();

    delete notifications[channel.id];
  };

  return (
    <React.Fragment>
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="exchange" /> CHANNELS
          </span>{' '}
          ({channels.length})
          <Icon
            name="add"
            onClick={() => setModal(true)}
            style={{ cursor: 'pointer' }}
          />
        </Menu.Item>
        {channels.map(channel => (
          <Menu.Item
            key={channel.id}
            name={channel.name}
            style={{ opacity: 0.7 }}
            onClick={() => selectChannel(channel)}
            active={currentChannel && currentChannel.id === channel.id}
          >
            # {channel.name}{' '}
            {currentChannel &&
              currentChannel.id !== channel.id &&
              notifications[channel.id] &&
              notifications[channel.id].count > 0 && (
                <>
                  {' '}
                  <Label color="red">{notifications[channel.id].count}</Label>
                </>
              )}
          </Menu.Item>
        ))}
      </Menu.Menu>

      <Modal basic open={modal} onClose={closeModal}>
        <Modal.Header>Add A Channel</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Field>
              <Input
                fluid
                label="Name Of Channel"
                name="channelName"
                onChange={e => setChannelName(e.target.value)}
              />
            </Form.Field>

            <Form.Field>
              <Input
                fluid
                label="About The Channel"
                name="channelDetails"
                onChange={e => setChannelDetails(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>

        <Modal.Actions>
          <Button color="green" inverted onClick={handleSubmit}>
            <Icon name="checkmark" /> Add
          </Button>
          <Button color="red" inverted onClick={closeModal}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </React.Fragment>
  );
};

const mapStateToProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel
});

const mapDispatchToProps = dispatch => ({
  setCurrentChannel: channel => {
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
