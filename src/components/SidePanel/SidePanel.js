import React from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';

const SidePanel = () => (
  <Menu
    size="large"
    fixed="left"
    vertical
    inverted
    style={{
      background: '#4c3c4c',
      fontSize: '1.2rem'
    }}
  >
    <UserPanel />
    <Starred />
    <Channels />
    <DirectMessages />
  </Menu>
);

export default SidePanel;
