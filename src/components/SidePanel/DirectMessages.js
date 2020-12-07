import React, { useState, useEffect } from 'react';
import { Menu, Icon, Label } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { fireDatabase } from '../../firebase/firebase.util';
import {
  setCurrentChannel,
  setPrivateChannel
} from '../../redux/actions/channelActions';

const DirectMessages = ({
  currentUser,
  currentChannel,
  privateChannel,
  setCurrentChannel
}) => {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState({});
  const [presenceChild, setPresenceChild] = useState(null);

  const usersRef = fireDatabase.ref('users');
  const connectedRef = fireDatabase.ref('.info/connected');
  const presenceRef = fireDatabase.ref('presence');
  const privateMessagesRef = fireDatabase.ref('privateMessages');

  useEffect(() => {
    if (presenceChild === null) return;

    const index = users.findIndex(user => user.uid === presenceChild.uid);

    if (index > -1) {
      users[index] = {
        ...presenceChild,
        channelId: getChannelId(presenceChild)
      };
    } else {
      users.push({ ...presenceChild, channelId: getChannelId(presenceChild) });
    }

    setPresenceChild(null);
    setUsers([...users]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, presenceChild]);

  useEffect(() => {
    if (!privateChannel && users.length > 0) {
      const usersChannelsRefs = users
        // .map(user => getChannelId(user))
        .map(({ channelId }) => ({
          channelId,
          ref: privateMessagesRef.child(channelId)
        }));

      usersChannelsRefs.forEach(({ channelId, ref }) => {
        ref.on('value', snapshot => {
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
      });

      return () => {
        usersChannelsRefs.forEach(({ ref }) => ref.off());
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, privateChannel, currentChannel]);

  const addListeners = async () => {
    // set users
    const snapshots = (await usersRef.once('value')).val();
    const docs = Object.values(snapshots)
      .filter(doc => doc.uid !== currentUser.uid)
      .map(doc => ({
        ...doc,
        status: 'offline',
        channelId: getChannelId(doc)
      }));

    setUsers(docs);

    // set current user with online status
    connectedRef.on('value', async snapshot => {
      if (snapshot.val() !== true) return;

      const ref = presenceRef.child(currentUser.uid);

      await ref.set(currentUser);

      ref.onDisconnect().remove(error => {
        if (error !== null) console.error(error);
      });
    });

    // track users presence, set/unset users
    presenceRef.on('child_added', snapshot => {
      if (snapshot.key === currentUser.uid) return;

      setPresenceChild({ ...snapshot.val(), status: 'online' });
    });

    presenceRef.on('child_removed', snapshot => {
      if (snapshot.key === currentUser.uid) return;

      setPresenceChild({ ...snapshot.val(), status: 'offline' });
    });
  };

  useEffect(() => {
    addListeners();

    return () => {
      connectedRef.off();
      presenceRef.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getChannelId = user =>
    user.uid < currentUser.uid
      ? `${user.uid}__${currentUser.uid}`
      : `${currentUser.uid}__${user.uid}`;

  const changeChannel = user => {
    setCurrentChannel({
      id: getChannelId(user),
      name: user.displayName
    });

    delete notifications[getChannelId(user)];
  };

  const isActive = user =>
    currentChannel && currentChannel.id === getChannelId(user);

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="mail" /> DIRECT MESSAGES
        </span>{' '}
        ({users.length})
      </Menu.Item>
      {users.map(user => (
        <Menu.Item
          key={user.uid}
          active={isActive(user)}
          style={{ opacity: 0.7, fontStyle: 'italic' }}
          onClick={() => changeChannel(user)}
        >
          @ {user.displayName}
          <>
            {' '}
            {currentChannel &&
              currentChannel.id !== user.channelId &&
              notifications[user.channelId] &&
              notifications[user.channelId].count > 0 && (
                <Label color="red">{notifications[user.channelId].count}</Label>
              )}
            <Icon
              name="circle"
              style={{ float: 'right' }}
              color={user.status === 'online' ? 'green' : 'red'}
            />
          </>
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

const mapStateToProps = ({
  user: { currentUser },
  channel: { currentChannel, privateChannel }
}) => ({ currentUser, currentChannel, privateChannel });

const mapDispatchToProps = dispatch => ({
  setCurrentChannel: channel => {
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(true));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DirectMessages);
