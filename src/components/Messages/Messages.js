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

  const messagesRef = fireDatabase.ref('messages');

  const addListener = async () => {
    const loadedMessages = [];

    if (currentChannel !== null) {
      const snapShot = await messagesRef.child(currentChannel.id).once('value');

      if (snapShot.val() === null) setMessages(loadedMessages);

      let timeoutId = null;
      messagesRef.child(currentChannel.id).on('child_added', snapShot => {
        loadedMessages.push(snapShot.val());

        if (timeoutId !== null) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
          setMessages(loadedMessages);
          clearTimeout(timeoutId);
        }, 500);
      });
    }
  };

  useEffect(() => {
    addListener();

    return () => {
      messagesRef.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChannel]);

  return (
    <React.Fragment>
      <MessagesHeader />

      <Segment>
        <Comment.Group className='messages'>
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

      <MessageForm messagesRef={messagesRef} />
    </React.Fragment>
  );
};

const mapStateToProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
});

export default connect(mapStateToProps)(Messages);
