import React from 'react';
import { Comment } from 'semantic-ui-react';
import moment from 'moment';

import './Message.style.css';

const Message = ({ message, currentUser }) => (
  <Comment>
    <Comment.Avatar src={message.user.photoUrl} />
    <Comment.Content className={message.user.id === currentUser.id && 'message__self'}>
      <Comment.Author as='a'>{message.user.displayName}</Comment.Author>
      <Comment.Metadata>{moment(message.timestamp).fromNow()}</Comment.Metadata>
      <Comment.Text>{message.content}</Comment.Text>
    </Comment.Content>
  </Comment>
);

export default Message;
