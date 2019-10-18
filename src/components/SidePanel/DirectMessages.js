import React, { useState, useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { fireDatabase, fireStore } from '../../firebase/firebase.util';

const DirectMessages = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [presenceChild, setPresenceChild] = useState(null);

  // firestore
  const usersRef = fireStore.collection('users');
  // database
  const connectedRef = fireDatabase.ref('.info/connected');
  const presenceRef = fireDatabase.ref('presence');

  useEffect(() => {
    if (presenceChild === null) return;

    const index = users.findIndex(user => user.uid === presenceChild.uid);

    if (index > -1) {
      users[index] = { ...presenceChild };
    } else {
      users.push({ ...presenceChild });
    }

    setPresenceChild(null);
    setUsers([...users]);

  }, [users, presenceChild]);


  const addListeners = async () => {
    // set users
    const snapshot = await usersRef.get();
    const docs = snapshot.docs
      .filter(doc => doc.id !== currentUser.uid)
      .map(doc => ({ ...doc.data(), status: 'offline' }));

    setUsers(docs);

    // set current user with online status
    connectedRef.on('value', async snapshot => {
      if (snapshot.val() !== true) return;

      const userData = { ...currentUser, status: 'offline' };
      const ref = presenceRef.child(userData.uid);

      await ref.set(userData);

      ref.onDisconnect()
        .remove(error => {
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

  return (
    <Menu.Menu className='menu'>
      <Menu.Item>
        <span>
          <Icon name='mail' /> DIRECT MESSAGES
        </span>
        {' '}
        ({users.length})
      </Menu.Item>
      {
        users.map(user => (
          <Menu.Item
            key={user.uid}
            onClick={() => console.log(user)}
            style={{ opacity: 0.7, fontStyle: 'italic' }}
          >
            <Icon
              name='circle'
              color={user.status === 'online' ? 'green' : 'red'}
            />
            @ {user.displayName}
          </Menu.Item>
        ))
      }
    </Menu.Menu>
  );
};

const mapStateToProps = ({ user: { currentUser } }) => ({ currentUser });

export default connect(mapStateToProps)(DirectMessages);
