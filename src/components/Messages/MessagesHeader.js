import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

const MessagesHeader = ({ channelName, channelUsers }) => (
  <Segment clearing>
    <Header
      as='h2'
      fluid='true'
      floated='left'
      style={{ marginBottom: 0 }}
    >
      <span>
        {channelName}
        <Icon name='star outline' color='black' />
      </span>
      <Header.Subheader>
        {channelUsers} {`User${channelUsers !== 1 ? 's' : ''}`}
      </Header.Subheader>
    </Header>
    <Header
      floated='right'
    >
      <Input
        size='mini'
        icon='search'
        name='searchTerm'
        placeholder='Search Message'
      />
    </Header>
  </Segment>
);

export default MessagesHeader;
