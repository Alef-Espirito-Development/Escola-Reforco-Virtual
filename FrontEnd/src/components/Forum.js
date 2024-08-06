import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Modal,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Grid,
  Avatar,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { fetchTopics } from '../services/forumService';
import { fetchClasses } from '../services/classService';
import LoadingMessage from './LoadingMessage';
import Message from './Message';
import CreateTopic from './CreateTopic';

const Forum = () => {
  const [topics, setTopics] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

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

  useEffect(() => {
    const getTopics = async () => {
      if (!selectedClass) return;

      setLoading(true);
      setErrorMessage('');
      try {
        const topicsData = await fetchTopics(selectedClass);
        setTopics(topicsData);
      } catch (error) {
        console.error('Erro ao buscar tópicos:', error);
        setErrorMessage('Erro ao buscar tópicos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    getTopics();
  }, [selectedClass]);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4, bgcolor: 'background.paper', color: theme.palette.primary.main, p: 2, borderRadius: 2, boxShadow: 4 }}>
        Fórum de Debate
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Turma</InputLabel>
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            label="Turma"
          >
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          onClick={handleModalOpen}
          startIcon={<AddCircleOutlineIcon />}
          sx={{ ml: 2 }}
        >
          Criar Tópico
        </Button>
      </Box>
      {loading && <LoadingMessage loading={loading} message="Carregando tópicos..." />}
      {errorMessage && <Message type="error" text={errorMessage} />}
      <Grid container spacing={3}>
        {topics.map((topic) => (
          <Grid item xs={12} md={6} key={topic.id}>
            <Card sx={{ borderRadius: 2, boxShadow: 4 }}>
              <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                  {topic.title}
                </Typography>
                <Typography
                  variant="body2"
                  color={topic.status === 'disponível' ? 'green' : 'red'}
                  sx={{ fontWeight: 'bold' }}
                >
                  Status: {topic.status}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Professor: {topic.professorName} - {topic.subject}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Escola: {topic.school}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Responder de {formatDate(topic.startDate)} até {formatDate(topic.endDate)}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => navigate(`/topic/${topic.id}`)}>
                  Ver Discussão
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <IconButton
            aria-label="close"
            onClick={handleModalClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <CreateTopic onClose={handleModalClose} />
        </Box>
      </Modal>
    </Box>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default Forum;
