import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const [channelMsgsRef, setChannelMsgsRef] = useState(null);
  const [isChannelStarred, setIsChannelStarred] = useState(false);
  const messagesEndRef = useRef(null);

  const starredChannelsRef = fireDatabase
    .ref('users')
    .child(`${currentUser.uid}/starredChannels`);

  useEffect(() => {
    const ref = privateChannel
      ? fireDatabase.ref('privateMessages')
      : fireDatabase.ref('messages');

    setMessagesRef(ref);

    if (currentChannel) setChannelMsgsRef(ref.child(currentChannel.id));
  }, [currentChannel, privateChannel]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }

      clearTimeout(timeoutId);
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [messages]);

  const addListener = () => {
    const values = [];

    setMessages(values);

    channelMsgsRef.on('child_added', snapshot => {
      const val = snapshot.val();

      values.push(val);
      setMessages([...values]);

      if (!privateChannel) {
        const emails = [...new Set(values.map(m => m.user.email))];
        setUniqueUsers(emails);
      }
    });
  };

  const isCurrentChannelStarred = useCallback(async () => {
    let channelFound = false;
    const snapshot = await starredChannelsRef.once('value');

    if (!currentChannel) return channelFound;

    if (snapshot.val()) {
      channelFound = Object.keys(snapshot.val()).includes(currentChannel.id);
    }

    return channelFound;
  }, [currentChannel, starredChannelsRef]);

  useEffect(() => {
    if (!channelMsgsRef) return;

    addListener();

    isCurrentChannelStarred().then(setIsChannelStarred);

    return () => {
      channelMsgsRef.off();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelMsgsRef]);

  useEffect(() => {
    setSearchLoading(true);
    if (searchTerm.length === 0 && filteredMessages.length)
      setFilteredMessages([]);

    const regex = new RegExp(searchTerm, 'gi');
    const msgs = messages.filter(
      m =>
        (m.hasOwnProperty('content') && m.content.match(regex)) ||
        m.user.displayName.match(regex)
    );

    setFilteredMessages(msgs);

    const timeoutId = setTimeout(() => {
      setSearchLoading(false);

      clearTimeout(timeoutId);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  const handleStar = async () => {
    const currentValue = !isChannelStarred;

    setIsChannelStarred(currentValue);

    if (currentValue) {
      return await starredChannelsRef.update({
        [currentChannel.id]: { ...currentChannel }
      });
    }

    await starredChannelsRef.child(currentChannel.id).remove();
  };

  const displayMessages = (msgs = []) =>
    msgs.map((message, i) => <Message {...{ key: i, message, currentUser }} />);

  return currentChannel ? (
    <React.Fragment>
      <MessagesHeader
        channelName={`${privateChannel ? '@' : '#'}${currentChannel.name}`}
        channelUsers={uniqueUsers.length}
        searchTerm={searchTerm}
        handleSearchTerm={val => setSearchTerm(val)}
        searchLoading={searchLoading}
        privateChannel={privateChannel}
        handleStar={handleStar}
        isChannelStarred={isChannelStarred}
      />

      <Segment>
        <Comment.Group
          style={{ maxWidth: '100%' }}
          className={progressBarVisible ? 'messages__progress' : 'messages'}
        >
          {searchTerm.length
            ? displayMessages(filteredMessages)
            : displayMessages(messages)}
          <div ref={messagesEndRef} />
        </Comment.Group>
      </Segment>

      <MessageForm
        messagesRef={messagesRef}
        setProgressBarVisible={boolVal => setProgressBarVisible(boolVal)}
      />
    </React.Fragment>
  ) : null;
};

const mapStateToProps = ({ user, channel }) => ({
  currentUser: user.currentUser,
  currentChannel: channel.currentChannel,
  privateChannel: channel.privateChannel
});

export default connect(mapStateToProps)(Messages);
