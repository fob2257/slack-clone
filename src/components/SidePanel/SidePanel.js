import React from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel';
import Channels from './Channels';

const SidePanel = ({ currentUser }) => (
  <Menu
    size='large'
    fixed='left'
    vertical
    inverted
    style={{
      background: '#4c3c4c',
      fontSize: '1.2rem'
    }}
  >
    <UserPanel currentUser={currentUser} />
    <Channels />
  </Menu>
);

export default SidePanel;
