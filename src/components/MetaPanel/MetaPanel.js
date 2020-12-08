import React, { useState } from 'react';
import { Segment, Header, Accordion, Icon, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';

const MetaPanel = ({ currentChannel, privateChannel }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const changeIndex = (e, titleProps) => {
    setActiveIndex(titleProps.index);
  };

  const isActive = index => index === activeIndex;

  if (privateChannel || !currentChannel) return null;

  return (
    <Segment>
      <Header as="h3" attached="top">
        About # {<>{currentChannel.name}</>}
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
            content: 'posters'
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

const mapStateToProps = ({ channel: { currentChannel, privateChannel } }) => ({
  currentChannel,
  privateChannel
});

export default connect(mapStateToProps)(MetaPanel);
