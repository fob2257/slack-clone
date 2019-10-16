import React, { useState } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';

import './MessageForm.style.css';

import firebase from '../../firebase/firebase.util';

const MessageForm = ({ messagesRef, currentUser, currentChannel }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const sendMessage = async () => {
    if (!(!!message.length)) return setErrors([{ message: 'Add a message' }]);

    setLoading(true);
    try {
      await messagesRef.child(currentChannel.id).push().set({
        content: message,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: currentUser,
      });

      setMessage('');
    } catch (error) {
      console.error(error);
      setErrors([error]);
    }
    setLoading(false);
  };

  return (
    <Segment>
      <Input
        fluid
        name='message'
        style={{ marginBottom: '0.7em' }}
        label={<Button icon='add' />}
        labelPosition='left'
        placeholder='Write Your Message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <Button.Group widths='2' icon>
        <Button
          color='orange'
          content='Add Reply'
          labelPosition='left'
          icon='edit'
          onClick={sendMessage}
          loading={loading}
          disabled={loading}
        />
        <Button
          color='teal'
          content='Upload Media'
          labelPosition='right'
          icon='cloud upload'
        />
      </Button.Group>
    </Segment>
  );
};

const mapStateToProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
});

export default connect(mapStateToProps)(MessageForm);
