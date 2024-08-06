import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Modal, TextField, Typography, IconButton, Avatar, Paper } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';

const Assistente = () => {
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState([{ role: 'assistant', content: 'Olá! Eu sou a Lizziê, sua professora virtual. Como posso ajudar você hoje?' }]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [assistantTyping, setAssistantTyping] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState('');

  const key = 'sk-proj-x3x5GAw4GQUGnLqacxnnT3BlbkFJ1AiPpNkhTIq0nLt1qD4d';
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY  || key;

  const theme = useTheme();

  const handleInputChange = e => setInput(e.target.value);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setTyping(true);
    setError(null);

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          }
        }
      );

      const assistantResponse = response.data.choices[0].message.content.trim();
      setChatHistory([...chatHistory, { role: 'user', content: input }]);
      setInput('');
      setLoading(false);

      // Typing animation
      let currentMessage = '';
      setAssistantTyping(true);
      assistantResponse.split(' ').forEach((word, index) => {
        setTimeout(() => {
          currentMessage += `${word} `;
          setAssistantMessage(currentMessage.trim());
          if (index === assistantResponse.split(' ').length - 1) {
            setAssistantTyping(false);
            setChatHistory(prevHistory => [...prevHistory, { role: 'assistant', content: assistantResponse }]);
          }
        }, index * 100);
      });
    } catch (error) {
      setError('Erro ao obter resposta. Por favor, tente novamente.');
      setLoading(false);
      setTyping(false);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: theme.spacing(2),
          right: theme.spacing(2),
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          startIcon={<ChatIcon />}
        >
          Fale com a Lizziê
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={(_, reason) => reason === 'backdropClick' ? null : handleClose()} // Prevent closing on backdrop click
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}
      >
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          sx={{
            width: '100%',
            maxWidth: 600,
            height: '80%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            mb: 2,
            mr: 2,
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography id="modal-title" variant="h6" component="h2">
              Professora Virtual - Lizziê
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            className="chat-window"
            sx={{
              maxHeight: '60vh',
              overflowY: 'auto',
              my: 2,
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
            }}
          >
            {chatHistory.map((message, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                  mb: 1,
                }}
              >
                {message.role === 'assistant' && (
                  <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>L</Avatar>
                )}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    p: 1.5,
                    bgcolor: message.role === 'user' ? 'primary.main' : 'grey.300',
                    color: message.role === 'user' ? '#fff' : '#000',
                    borderRadius: 2,
                    maxWidth: '70%',
                    wordWrap: 'break-word',
                    position: 'relative',
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                  {message.role === 'assistant' && (
                    <IconButton
                      size="small"
                      sx={{
                        ml: 1,
                        color: 'primary.main',
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        transform: copied ? 'scale(1.2)' : 'scale(1)',
                        transition: 'transform 0.2s',
                      }}
                      onClick={() => handleCopy(message.content)}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            ))}
            {assistantTyping && (
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                <Avatar sx={{ mr: 1, bgcolor: 'primary.main' }}>L</Avatar>
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  sx={{
                    p: 1.5,
                    bgcolor: 'grey.300',
                    borderRadius: 2,
                    maxWidth: '70%',
                    wordWrap: 'break-word',
                  }}
                >
                  <Typography variant="body1">{assistantMessage}</Typography>
                </Box>
              </Box>
            )}
          </Box>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              alignItems: 'center',
              position: 'absolute',
              bottom: 10,
              left: 10,
              right: 10,
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Digite sua pergunta aqui..."
              value={input}
              onChange={handleInputChange}
              required
              sx={{ mr: 1 }}
            />
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              <SendIcon />
            </Button>
          </Box>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {copied && (
            <Typography
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              sx={{
                position: 'absolute',
                bottom: 20,
                right: 20,
                bgcolor: 'grey.900',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 1,
              }}
            >
              Copiado!
            </Typography>
          )}
        </Paper>
      </Modal>
    </>
  );
};

export default Assistente;
