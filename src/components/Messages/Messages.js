import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { fireDatabase } from '../../firebase/firebase.util';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

const Messages = ({ currentUser, currentChannel, privateChannel }) => {
  const [messages, setMessages] = useState([]);
  const [progressBarVisible, setProgressBarVisible] = useState(false);
  const [uniqueUsers, setUniqueUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [messagesRef, setMessagesRef] = useState(fireDatabase.ref('messages'));

  useEffect(() => {
    const ref = privateChannel ? fireDatabase.ref('privateMessages')
      : fireDatabase.ref('messages');

    setMessagesRef(ref);
  }, [currentChannel, privateChannel]);

  useEffect(() => {
    const emails = [...new Set(messages.map(m => m.user.email))];

    setUniqueUsers(emails);
  }, [messages]);

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
  }, [messagesRef]);

  useEffect(() => {
    setSearchLoading(true);
    if (searchTerm.length === 0 && filteredMessages.length) setFilteredMessages([]);

    const regex = new RegExp(searchTerm, 'gi');
    const msgs = messages.filter(m => (m.hasOwnProperty('content') && m.content.match(regex))
      || m.user.displayName.match(regex));

    setFilteredMessages(msgs);

    const timeoutId = setTimeout(() => {
      setSearchLoading(false);

      clearTimeout(timeoutId);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const displayMessages = (msgs = []) =>
    msgs.map((message, i) =>
      <Message
        key={i}
        message={message}
        currentUser={currentUser}
      />
    );

  return currentChannel ? (
    <React.Fragment>
      <MessagesHeader
        channelName={`${privateChannel ? '@' : '#'}${currentChannel.name}`}
        channelUsers={uniqueUsers.length}
        searchTerm={searchTerm}
        handleSearchTerm={val => setSearchTerm(val)}
        searchLoading={searchLoading}
        privateChannel={privateChannel}
      />

      <Segment>
        <Comment.Group className={progressBarVisible ? 'messages__progress' : 'messages'}>
          {
            searchTerm.length ? displayMessages(filteredMessages)
              : displayMessages(messages)
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
  privateChannel: channel.privateChannel,
});

export default connect(mapStateToProps)(Messages);
