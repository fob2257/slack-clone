import React, { useState, useEffect } from 'react';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';

import firebase, { fireDatabase } from '../../firebase/firebase.util';

import { setCurrentChannel, setPrivateChannel } from '../../redux/actions/channelActions';

const Channels = ({ currentUser, currentChannel, setCurrentChannel }) => {
  const [channels, setChannels] = useState([]);
  const [modal, setModal] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [channelDetails, setChannelDetails] = useState('');
  const [channelsRef, setChannelsRef] = useState(fireDatabase.ref('channels'));
  const [messagesRef, setMessagesRef] = useState(fireDatabase.ref('messages'));
  const [notifications, setNotifications] = useState({});


  // TODO: WIP Channel Notification
  // channel notification listeners
  // const values = {};
  // useEffect(() => {
  //   const channelsMsgsRefs = channels
  //     .reduce((acc, channel) => {
  //       if (currentChannel && channel.id === currentChannel.id) return acc;

  //       const msgsRef = messagesRef.child(channel.id);

  //       let initialMsgs = -1;
  //       msgsRef.on('value', snapshot => {

  //         const totalMsgs = snapshot.numChildren();
  //         if (initialMsgs < 0) initialMsgs = totalMsgs;

  //         const total = totalMsgs - initialMsgs;

  //         values[channel.id] = total;
  //         console.log(values);
  //         setNotifications({ ...values });
  //       });


  //       return [...acc, msgsRef];
  //     }, []);

  //   return () => {
  //     channelsMsgsRefs.forEach(ref => ref.off());
  //   };

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentChannel, channels]);

  const addListener = async () => {
    const values = [];
    channelsRef.on('child_added', snapshot => {
      const val = snapshot.val();

      values.push(val);
      setChannels([...values]);

      if (values.length === 1) setCurrentChannel(val);
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
        timestamp: firebase.database.ServerValue.TIMESTAMP,
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
      <Menu.Menu className='menu'>
        <Menu.Item>
          <span>
            <Icon name='exchange' /> CHANNELS
          </span>
          {' '}
          ({channels.length})
          <Icon
            name='add'
            onClick={() => setModal(true)}
            style={{ cursor: 'pointer' }}
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
  setCurrentChannel: channel => {
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
