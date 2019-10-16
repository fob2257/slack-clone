import React from 'react';
import { Sidebar, Menu, Divider, Button } from 'semantic-ui-react';

const ColorPanel = () => (
  <Sidebar
    as={Menu}
    icon='labeled'
    width='very thin'
    inverted
    vertical
    visible
  >
    <Divider />
    <Button icon='add' size='small' color='blue' />
  </Sidebar>
);

export default ColorPanel;
