import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchAllUsers, createChat } from '../services/chatService';
import { fetchClasses } from '../services/classService';

const ChatCreate = ({ onClose }) => {
  const [chatName, setChatName] = useState('');
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filter, setFilter] = useState('users');
  const [selectedClass, setSelectedClass] = useState('');
  const navigate = useNavigate();
  const userType = localStorage.getItem('userType'); // Adicione isso

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchAllUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    const getClasses = async () => {
      try {
        const classesData = await fetchClasses();
        setClasses(classesData);
        console.log('Classes recebidas:', classesData);
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
      }
    };

    getUsers();
    getClasses();
  }, []);

  const handleCreateChat = async () => {
    try {
      let participants = selectedUsers;
      const userId = localStorage.getItem('userId'); // ID do usuário logado

      if (filter === 'class') {
        const selectedClassObj = classes.find(cls => cls.id === selectedClass);
        console.log('Selected class object:', selectedClassObj);
        if (selectedClassObj && selectedClassObj.students && selectedClassObj.students.length > 0) {
          participants = selectedClassObj.students.map(student => student);
        } else {
          console.error('Turma selecionada não encontrada ou não tem alunos');
          return;
        }
      }

      // Adicionar o ID do criador ao array de participantes, se ainda não estiver presente
      if (!participants.includes(userId)) {
        participants.push(userId);
      }

      const createdAt = new Date().toISOString();
      console.log('Dados para criar chat:', { name: chatName, participants, createdAt });
      const response = await createChat({ name: chatName, participants, createdAt });
      navigate(`/chat/${response.chatId}`);
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  };

  const renderSelectOptions = () => {
    if (filter === 'users') {
      return users.map((user) => (
        <MenuItem key={user.id} value={user.id}>
          {user.nome} {user.sobrenome}
        </MenuItem>
      ));
    } else if (filter === 'class') {
      return classes.map((cls) => (
        <MenuItem key={cls.id} value={cls.id}>
          {cls.nome}
        </MenuItem>
      ));
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Criar Novo Chat
      </Typography>
      <TextField
        label="Nome do Chat"
        variant="outlined"
        fullWidth
        value={chatName}
        onChange={(e) => setChatName(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel>Filtro</InputLabel>
        <Select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setSelectedUsers([]);
            setSelectedClass('');
          }}
          label="Filtro"
        >
          <MenuItem value="users">Usuários</MenuItem>
          {userType === 'Professor' && (
            <MenuItem value="class">Turmas</MenuItem>
          )}
        </Select>
      </FormControl>
      {filter === 'class' ? (
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Turmas</InputLabel>
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            label="Turmas"
          >
            {renderSelectOptions()}
          </Select>
        </FormControl>
      ) : (
        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
          <InputLabel>Usuários</InputLabel>
          <Select
            multiple
            value={selectedUsers}
            onChange={(e) => setSelectedUsers(e.target.value)}
            label="Usuários"
          >
            {renderSelectOptions()}
          </Select>
        </FormControl>
      )}
      <Button variant="contained" color="primary" onClick={handleCreateChat} sx={{ mr: 2 }}>
        Criar Chat
      </Button>
      <Button variant="outlined" color="secondary" onClick={onClose}>
        Fechar
      </Button>
    </Box>
  );
};

export default ChatCreate;
