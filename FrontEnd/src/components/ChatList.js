import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Button, FormControl, InputLabel, Select, MenuItem, Modal, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchUserChats, fetchAllUsers } from '../services/chatService';
import ChatCreate from './ChatCreate';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getChats = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const chatsData = await fetchUserChats(userId);
        setChats(chatsData);
      } catch (error) {
        console.error('Erro ao buscar chats:', error);
      }
    };

    const getUsers = async () => {
      try {
        const usersData = await fetchAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    getChats();
    getUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.tipo === filter;
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  return (
    <Box sx={{ padding: 2, backgroundColor: '#f0f0f0', height: '100vh' }}>
      <Typography variant="h5" gutterBottom>
        Meus Chats
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenModal}
        sx={{ mb: 2 }}
      >
        Criar Novo Chat
      </Button>
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel>Filtro</InputLabel>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          label="Filtro"
        >
          <MenuItem value="all">Todos</MenuItem>
          <MenuItem value="Aluno">Alunos</MenuItem>
          <MenuItem value="Professor">Professores</MenuItem>
        </Select>
      </FormControl>
      <Grid container spacing={2}>
        {chats.map((chat) => (
          <Grid item xs={12} sm={4} md={3} key={chat.id}>
            <Paper
              sx={{
                height: 100, // Altura reduzida para formato menor
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 2,
                cursor: 'pointer',
              }}
              onClick={() => navigate(`/chat/${chat.id}`)}
            >
              <Typography variant="body1" fontWeight="bold">
                {chat.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        BackdropProps={{
          onClick: (e) => e.stopPropagation(),
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <ChatCreate onClose={handleCloseModal} />
        </Box>
      </Modal>
    </Box>
  );
};

export default ChatList;
