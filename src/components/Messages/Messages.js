import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { fireDatabase } from '../../firebase/firebase.util';

import { setUserPosts } from '../../redux/actions/userActions';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import Typing from './Typing';

const Messages = ({
  currentUser,
  currentChannel,
  privateChannel,
  setUserPosts
}) => {
  const [messages, setMessages] = useState([]);
  const [progressBarVisible, setProgressBarVisible] = useState(false);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [messagesRef, setMessagesRef] = useState(fireDatabase.ref('messages'));
  const [channelMsgsRef, setChannelMsgsRef] = useState(null);
  const [isChannelStarred, setIsChannelStarred] = useState(false);
  const [usersTyping, setUsersTyping] = useState([]);
  const messagesEndRef = useRef(null);

  const starredChannelsRef = fireDatabase
    .ref('users')
    .child(`${currentUser.uid}/starredChannels`);
  const typingRef = fireDatabase.ref('typing');
  const connectedRef = fireDatabase.ref('.info/connected');

  useEffect(() => {
    const ref = privateChannel
      ? fireDatabase.ref('privateMessages')
      : fireDatabase.ref('messages');

    setMessagesRef(ref);

    if (currentChannel) {
      setChannelMsgsRef(ref.child(currentChannel.id));
      setUsersTyping([]);
    }
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
    const topPosters = {};

    setMessages(values);

    channelMsgsRef.on('child_added', snapshot => {
      const val = snapshot.val();

      values.push(val);
      setMessages([...values]);

      if (!privateChannel) {
        if (!topPosters[currentChannel.id]) {
          topPosters[currentChannel.id] = {
            [val.user.uid]: { ...val.user, count: 0 }
          };
        }

        topPosters[currentChannel.id][val.user.uid].count += 1;

        setUniqueUsers(Object.values(topPosters[currentChannel.id]).length);
        setUserPosts(topPosters);
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

  const handleTyping = () => {
    const ref = typingRef.child(currentChannel.id);

    let users = [];
    ref.on('child_added', snapshot => {
      if (snapshot.key === currentUser.uid) return;

      users.unshift(snapshot.val());

      setUsersTyping([...users]);
    });

    ref.on('child_removed', snapshot => {
      users = users.filter(user => user.uid !== snapshot.key);

      setUsersTyping([...users]);
    });

    connectedRef.on('value', snapshot => {
      if (snapshot.val()) {
        typingRef
          .child(currentChannel.id)
          .child(currentUser.uid)
          .onDisconnect()
          .remove(error => {
            if (error) {
              console.error(error);
            }
          });
      }
    });

    return ref;
  };

  useEffect(() => {
    if (!channelMsgsRef) return;

    addListener();

    isCurrentChannelStarred().then(setIsChannelStarred);

    const ref = handleTyping();

    return () => {
      ref.off();
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
        channelUsers={uniqueUsers}
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
          {usersTyping.map((user, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <span className="user__typing">{user.displayName} is typing</span>{' '}
              <Typing />
            </div>
          ))}
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

const mapDispatchToProps = dispatch => ({
  setUserPosts: posts => dispatch(setUserPosts(posts))
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
