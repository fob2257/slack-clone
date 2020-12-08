import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { fireDatabase } from '../../firebase/firebase.util';

import {
  setCurrentChannel,
  setPrivateChannel
} from '../../redux/actions/channelActions';

const Starred = ({ currentUser, currentChannel, setCurrentChannel }) => {
  const [starredChannels, setStarredChannels] = useState([]);

  const starredChannelsRef = fireDatabase
    .ref('users')
    .child(`${currentUser.uid}/starredChannels`);

  useEffect(() => {
    let channels = [];
    starredChannelsRef.on('child_added', snapshot => {
      channels.push(snapshot.val());

      setStarredChannels([...channels]);
    });

    starredChannelsRef.on('child_removed', snapshot => {
      channels = channels.filter(channel => channel.id !== snapshot.key);

      setStarredChannels([...channels]);
    });

    return () => {
      starredChannelsRef.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectChannel = channel => setCurrentChannel(channel);

  return (
    <Menu.Menu className="menu">
      <Menu.Item>
        <span>
          <Icon name="star" /> STARRED
        </span>{' '}
        ({starredChannels.length})
      </Menu.Item>
      {starredChannels.map(channel => (
        <Menu.Item
          key={channel.id}
          name={channel.name}
          style={{ opacity: 0.7 }}
          onClick={() => selectChannel(channel)}
          active={currentChannel && currentChannel.id === channel.id}
        >
          # {channel.name}
        </Menu.Item>
      ))}
    </Menu.Menu>
  );
};

const mapStateToProps = ({
  user: { currentUser },
  channel: { currentChannel }
}) => ({
  currentUser,
  currentChannel
});

const mapDispatchToProps = dispatch => ({
  setCurrentChannel: channel => {
    dispatch(setCurrentChannel(channel));
    dispatch(setPrivateChannel(false));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Starred);
