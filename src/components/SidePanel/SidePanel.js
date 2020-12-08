import React from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel';
import Channels from './Channels';
import DirectMessages from './DirectMessages';
import Starred from './Starred';

const SidePanel = ({ primaryColor }) => (
  <Menu
    size="large"
    fixed="left"
    vertical
    inverted
    style={{
      background: primaryColor,
      fontSize: '1.2rem'
    }}
  >
    <UserPanel primaryColor={primaryColor} />
    <Starred />
    <Channels />
    <DirectMessages />
  </Menu>
);

export default SidePanel;
