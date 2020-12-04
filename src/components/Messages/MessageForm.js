import React, { useState, useEffect } from 'react';
import { Segment, Button, Input } from 'semantic-ui-react';
import { connect } from 'react-redux';
import uuidv4 from 'uuid/v4';

import firebase, { fireStorage } from '../../firebase/firebase.util';

import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

const MessageForm = ({
  messagesRef,
  setProgressBarVisible,
  currentUser,
  currentChannel,
  privateChannel
}) => {
  const [message, setMessage] = useState('');
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadTask, setUploadTask] = useState(null);
  const [percentage, setPercentage] = useState(0);

  const storageRef = fireStorage.ref();
  const msgRef = messagesRef.child(currentChannel.id);

  useEffect(() => {
    if (uploadTask) {
      uploadTask.on(
        'state_changed',
        snapshot => {
          const percentage = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          setPercentage(percentage);
        },
        error => {
          console.error(error);
          setErrors([error]);
          setUploading(false);
          setUploadTask(null);
        },
        async () => {
          try {
            const url = await uploadTask.snapshot.ref.getDownloadURL();

            const key = msgRef.push().key;
            const newMessage = {
              id: key,
              image: url,
              user: currentUser,
              timestamp: firebase.database.ServerValue.TIMESTAMP
            };

            await msgRef.child(key).update(newMessage);

            setUploading(false);
            setUploadTask(null);
          } catch (error) {
            console.error(error);
            setErrors([error]);
            setUploading(false);
            setUploadTask(null);
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadTask]);

  const sendMessage = async () => {
    if (!!!message.length) return setErrors([{ message: 'Add a message' }]);

    setLoading(true);
    try {
      const key = msgRef.push().key;
      const newMessage = {
        id: key,
        content: message,
        user: currentUser,
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      await msgRef.child(key).update(newMessage);

      setMessage('');
    } catch (error) {
      console.error(error);
      setErrors([error]);
    }
    setLoading(false);
  };

  const getPath = () =>
    privateChannel ? `chat/private-${currentChannel.id}` : 'chat/public';

  const uploadFile = (file, metadata) => {
    const [ext] = file.name.split('.').reverse();
    const filePath = `${getPath()}${uuidv4()}.${ext}`;

    const task = storageRef.child(filePath).put(file, metadata);

    setUploading(true);
    setUploadTask(task);

    setProgressBarVisible(true);
  };

  return (
    <Segment>
      <Input
        fluid
        name="message"
        style={{ marginBottom: '0.7em' }}
        label={<Button icon="add" />}
        labelPosition="left"
        placeholder="Write Your Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />

      <Button.Group widths="2" icon>
        <Button
          color="orange"
          content="Add Reply"
          labelPosition="left"
          icon="edit"
          onClick={sendMessage}
          loading={loading}
          disabled={loading}
        />
        <Button
          color="teal"
          content="Upload Media"
          labelPosition="right"
          icon="cloud upload"
          onClick={() => setModal(true)}
          loading={uploading}
          disabled={uploading}
        />
      </Button.Group>

      <FileModal
        modal={modal}
        closeModal={() => setModal(false)}
        uploadFile={uploadFile}
      />

      {uploading && <ProgressBar percentage={percentage} />}
    </Segment>
  );
};

const mapStateToProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
  privateChannel: channel.privateChannel
});

export default connect(mapStateToProps)(MessageForm);
