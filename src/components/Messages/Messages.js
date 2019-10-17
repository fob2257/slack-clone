import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import './Messages.style.css';

import { fireDatabase } from '../../firebase/firebase.util';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

const Messages = ({ currentUser, currentChannel }) => {
  const [messages, setMessages] = useState([]);
  const [progressBarVisible, setProgressBarVisible] = useState(false);

  const messagesRef = fireDatabase.ref('messages');

  const addListener = async () => {
    if (currentChannel === null) return;

    const msgRef = messagesRef.child(currentChannel.id);

    const snapshot = await msgRef.once('value');
    const snapvalue = snapshot.val();
    const keys = snapvalue !== null ? Object.keys(snapvalue) : [];
    const values = snapvalue !== null ? Object.values(snapvalue) : [];

    setMessages(values);

    msgRef.on('child_added', snapshot => {
      const val = snapshot.val();

      if (keys.some(k => k === val.id)) return;

      values.push(val);
      setMessages([...values]);
    });
  };

  useEffect(() => {
    addListener();

    return () => {
      messagesRef.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel]);

  return currentChannel ? (
    <React.Fragment>
      <MessagesHeader />

      <Segment>
        <Comment.Group className={progressBarVisible ? 'messages__progress' : 'messages'}>
          {
            messages.map((message, i) =>
              <Message
                key={i}
                message={message}
                currentUser={currentUser}
              />
            )
          }
        </Comment.Group>
      </Segment>

      <MessageForm
        messagesRef={messagesRef}
        setProgressBarVisible={boolVal => setProgressBarVisible(boolVal)}
      />
    </React.Fragment>
  )
    : null;
};

const mapStateToProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
});

export default connect(mapStateToProps)(Messages);
