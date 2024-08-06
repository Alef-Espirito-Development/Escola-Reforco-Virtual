import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { createTopic } from '../services/forumService';
import { fetchClasses } from '../services/classService';
import LoadingMessage from './LoadingMessage';
import Message from './Message';

const CreateTopic = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [status, setStatus] = useState('disponível');
  const [classes, setClasses] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const getClasses = async () => {
      setLoading(true);
      try {
        const classesData = await fetchClasses();
        setClasses(classesData);
      } catch (error) {
        console.error('Erro ao buscar turmas:', error);
        setErrorMessage('Erro ao buscar turmas. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    getClasses();
  }, []);

  const handleCreateTopic = async () => {
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const newTopic = await createTopic(title, description, classId, status, startDate, endDate);
      if (newTopic) {
        setSuccessMessage('Tópico criado com sucesso.');
        setTimeout(() => {
          onClose(); // Fechar o modal após a criação bem-sucedida
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao criar tópico:', error);
      setErrorMessage('Erro ao criar tópico. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Criar Novo Tópico
      </Typography>
      <TextField
        label="Título"
        variant="outlined"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Descrição"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
        <InputLabel>Turma</InputLabel>
        <Select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          label="Turma"
        >
          {classes.map((cls) => (
            <MenuItem key={cls.id} value={cls.id}>
              {cls.nome}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        label="Data de Início"
        type="date"
        variant="outlined"
        fullWidth
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Data de Fim"
        type="date"
        variant="outlined"
        fullWidth
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" color="primary" onClick={handleCreateTopic}>
        Criar Tópico
      </Button>
      <LoadingMessage loading={loading} message="Criando tópico..." />
      {successMessage && <Message type="success" text={successMessage} />}
      {errorMessage && <Message type="error" text={errorMessage} />}
    </Box>
  );
};

export default CreateTopic;
