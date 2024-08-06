import React from 'react';
import { List, ListItem, ListItemText, Avatar } from '@mui/material';

const MessageList = ({ messages }) => {
  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    } else {
      return 'Invalid Date';
    }
  };

  return (
    <List>
      {messages.map((message, index) => (
        <ListItem key={index} alignItems="flex-start">
          <Avatar>{message.senderId.charAt(0)}</Avatar>
          <ListItemText
            primary={message.content}
            secondary={formatTimestamp(message.timestamp)}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default MessageList;
