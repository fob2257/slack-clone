import React from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

const MessagesHeader = ({
  channelName,
  channelUsers,
  searchTerm,
  handleSearchTerm,
  searchLoading,
  privateChannel
}) => (
  <Segment clearing>
    <Header as="h2" fluid="true" floated="left" style={{ marginBottom: 0 }}>
      <span>
        {channelName}
        {!privateChannel && (
          <>
            {' '}
            <Icon name="star outline" color="black" />
          </>
        )}
      </span>
      {!privateChannel && (
        <Header.Subheader>
          {channelUsers} {`User${channelUsers !== 1 ? 's' : ''}`}
        </Header.Subheader>
      )}
    </Header>
    <Header floated="right">
      <Input
        size="mini"
        icon="search"
        name="searchTerm"
        placeholder="Search Message"
        value={searchTerm}
        onChange={({ target: { value } }) => handleSearchTerm(value)}
        loading={searchLoading}
      />
    </Header>
  </Segment>
);

export default MessagesHeader;
