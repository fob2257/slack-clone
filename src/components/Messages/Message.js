import React from 'react';
import { Comment, Image } from 'semantic-ui-react';
import moment from 'moment';

const Message = ({ message, currentUser }) => (
  <Comment>
    <Comment.Avatar src={message.user.photoUrl} />
    <Comment.Content
      className={message.user.uid === currentUser.uid ? 'message__self' : ''}
    >
      <Comment.Author as="a">{message.user.displayName}</Comment.Author>
      <Comment.Metadata>{moment(message.timestamp).fromNow()}</Comment.Metadata>
      {message.hasOwnProperty('image') ? (
        <Image src={message.image} className="message__image" />
      ) : (
        <Comment.Text>{message.content}</Comment.Text>
      )}
    </Comment.Content>
  </Comment>
);

export default Message;
