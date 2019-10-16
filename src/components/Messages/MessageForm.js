import React, { useState } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';

import './MessageForm.style.css';

import firebase from '../../firebase/firebase.util';

import FileModal from './FileModal';

const MessageForm = ({ messagesRef, currentUser, currentChannel }) => {
  const [message, setMessage] = useState('');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  const sendMessage = async () => {
    if (!(!!message.length)) return setErrors([{ message: 'Add a message' }]);

    setLoading(true);
    try {
      const msgRef = messagesRef.child(currentChannel.id);

      const key = msgRef.push().key;
      const newMessage = {
        id: key,
        content: message,
        user: currentUser,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      };

      await msgRef.child(key).update(newMessage);

      setMessage('');
    } catch (error) {
      console.error(error);
      setErrors([error]);
    }
    setLoading(false);
  };

  const uploadFile = (file, metadata) => {
    console.log(file, metadata);
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
          onClick={() => setModal(true)}
        />

        <FileModal
          modal={modal}
          closeModal={() => setModal(false)}
          uploadFile={uploadFile}
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
