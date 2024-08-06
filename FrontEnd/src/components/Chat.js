import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Paper, IconButton, List, ListItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from 'react-router-dom';
import { fetchMessages, sendMessage, fetchChatParticipants } from '../services/chatService';

const Chat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const messagesData = await fetchMessages(chatId);
        setMessages(messagesData);
        const participantsData = await fetchChatParticipants(chatId);
        setParticipants(participantsData.map(p => `${p.nome} ${p.sobrenome}`).join(', '));
      } catch (error) {
        console.error('Erro ao buscar mensagens:', error);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    if ((e.type === 'click' || e.key === 'Enter') && newMessage.trim() !== '') {
      try {
        const userId = localStorage.getItem('userId'); // Pegue o ID do usuário logado
        const senderName = localStorage.getItem('userName'); // Adicione isso se você tiver armazenado o nome do usuário no localStorage
        const messageData = await sendMessage(chatId, userId, senderName, newMessage);
        setMessages([...messages, messageData]);
        setNewMessage('');
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
    }
  };

  const formatTimestamp = (timestamp) => {
    if (timestamp && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleString();
    } else {
      return 'Invalid Date';
    }
  };

  const renderMessage = (message, index) => {
    const userId = localStorage.getItem('userId'); // Pegue o ID do usuário logado
    const isOwnMessage = message.senderId === userId;
    const isRecentMessage = index === messages.length - 1;

    return (
      <ListItem
        key={message.id}
        sx={{
          display: 'flex',
          justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
          backgroundColor: isRecentMessage ? '#e0e0e0' : 'inherit',
        }}
      >
        <Box
          sx={{
            maxWidth: '60%',
            backgroundColor: isOwnMessage ? '#dcf8c6' : '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            marginBottom: '8px',
            wordBreak: 'break-word',
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            {message.senderName}
          </Typography>
          <Typography variant="body2" sx={{ marginTop: '4px' }}>
            {message.content}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', marginTop: '4px', textAlign: 'right' }}>
            {formatTimestamp(message.timestamp)}
          </Typography>
        </Box>
      </ListItem>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      <Box sx={{ padding: 2, backgroundColor: '#2e7d32', display: 'flex', flexDirection: 'column', borderBottom: '1px solid #444' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ color: '#fff' }}>
            Assunto do Chat
          </Typography>
          <IconButton color="inherit" onClick={() => window.history.back()}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ color: '#fff', marginTop: '4px' }}>
          {participants}
        </Typography>
      </Box>
      <Paper sx={{ p: 2, flexGrow: 1, overflowY: 'scroll', backgroundColor: '#e0e0e0', color: 'black' }}>
        <List>
          {messages.map((message, index) => renderMessage(message, index))}
          <div ref={messagesEndRef} />
        </List>
      </Paper>
      <Box sx={{ display: 'flex', padding: 2, backgroundColor: '#f5f5f5', borderTop: '1px solid #444' }}>
        <TextField
          fullWidth
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          onKeyDown={handleSendMessage}
          sx={{ backgroundColor: '#fff', borderRadius: '8px' }}
        />
        <IconButton color="primary" onClick={handleSendMessage}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;
