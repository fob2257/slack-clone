import React, { useState } from 'react';
import {
  Segment,
  Header,
  Accordion,
  Icon,
  Image,
  List
} from 'semantic-ui-react';
import { connect } from 'react-redux';

const MetaPanel = ({ userPosts, currentChannel, privateChannel }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (privateChannel || !currentChannel) return null;

  const changeIndex = (e, titleProps) => {
    setActiveIndex(titleProps.index);
  };

  const isActive = index => index === activeIndex;

  const topPosters = userPosts[currentChannel.id] || {};

  const displayTopPosters = () => (
    <List>
      {Object.values(topPosters)
        .sort((a, b) => b.count - a.count)
        .map((obj, i) => (
          <List.Item key={i}>
            <Image src={obj.photoUrl} avatar />
            <List.Content>
              <List.Header>{obj.displayName}</List.Header>
              <List.Description>
                {obj.count} post{obj.count !== 1 ? 's' : ''}
              </List.Description>
            </List.Content>
          </List.Item>
        ))
        .slice(0, 3)}
    </List>
  );

  return (
    <Segment>
      <Header as="h3" attached="top">
        About # {currentChannel.name}
      </Header>
      <Accordion styled attached="true">
        {[
          {
            title: (
              <>
                <Icon name="info" />
                Channel Details
              </>
            ),
            content: currentChannel.details
          },
          {
            title: (
              <>
                <Icon name="user circle" />
                Top Posters
              </>
            ),
            content: displayTopPosters()
          },
          {
            title: (
              <>
                <Icon name="pencil alternate" />
                Created By
              </>
            ),
            content: (
              <>
                <Header as="h3">
                  <Image src={currentChannel.createdBy.photoUrl} circular />
                  {currentChannel.createdBy.displayName}
                </Header>
              </>
            )
          }
        ].map((obj, i) => (
          <React.Fragment key={i}>
            <Accordion.Title
              index={i}
              active={isActive(i)}
              onClick={changeIndex}
            >
              <Icon name="dropdown" />
              {obj.title}
            </Accordion.Title>
            <Accordion.Content active={isActive(i)}>
              {obj.content}
            </Accordion.Content>
          </React.Fragment>
        ))}
      </Accordion>
    </Segment>
  );
};

const mapStateToProps = ({
  user: { userPosts },
  channel: { currentChannel, privateChannel }
}) => ({ userPosts, currentChannel, privateChannel });

export default connect(mapStateToProps)(MetaPanel);
