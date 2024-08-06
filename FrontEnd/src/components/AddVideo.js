import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, Checkbox, FormControlLabel, FormGroup, CircularProgress, FormControl, FormLabel, Grid } from '@mui/material';
import LoadingMessage from './LoadingMessage';
import Message from './Message';

const genreOptions = ['Romance', 'Ficção', 'Mistério', 'Fantasia', 'Aventura', 'Não-ficção', 'Didático', 'Filmes', 'Inclusão'];
const ageRatingOptions = ['Livre', '10+', '12+', '14+', '16+', '18+'];

const AddVideo = ({ onClose, video }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState([]);
  const [ageRating, setAgeRating] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setAuthor(video.author);
      setGenres(Array.isArray(video.genres) ? video.genres : video.genres.split(','));
      setAgeRating(video.ageRating);
      setVideoFile(null);
    }
  }, [video]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('genres', genres.join(','));
    formData.append('ageRating', ageRating);
    formData.append('videoFile', videoFile);

    try {
      const token = localStorage.getItem('token');
      const url = video ? `http://localhost:5000/api/videos/${video.id}` : 'http://localhost:5000/api/videos';
      const method = video ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage(video ? 'Vídeo atualizado com sucesso' : 'Vídeo adicionado com sucesso');
        if (!video) {
          setTitle('');
          setAuthor('');
          setGenres([]);
          setAgeRating('');
          setVideoFile(null);
        }
      } else {
        console.error('Erro ao adicionar/atualizar vídeo');
        setErrorMessage('Erro ao adicionar/atualizar vídeo.');
      }
    } catch (error) {
      console.error('Erro ao adicionar/atualizar vídeo:', error);
      setErrorMessage('Erro ao adicionar/atualizar vídeo. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (event) => {
    const value = event.target.value;
    setGenres((prev) => {
      if (prev.includes(value)) {
        return prev.filter((genre) => genre !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  const handleAgeRatingChange = (event) => {
    const value = event.target.value;
    setAgeRating(value);
  };

  return (
    <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: '0 auto', maxHeight: '80vh', overflowY: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ marginBottom: 2 }}>
          {video ? 'Editar Vídeo' : 'Adicionar Vídeo'}
        </Typography>
        {successMessage && (
          <Message type="success" text={successMessage} />
        )}
        {errorMessage && (
          <Message type="error" text={errorMessage} />
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="title"
                label="Título"
                name="title"
                autoComplete="title"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="author"
                label="Autor"
                name="author"
                autoComplete="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </Grid>
          </Grid>
          <FormControl component="fieldset" sx={{ marginTop: 2, marginBottom: 2 }}>
            <FormLabel component="legend">Gêneros</FormLabel>
            <FormGroup row>
              {genreOptions.map((genre) => (
                <FormControlLabel
                  control={<Checkbox checked={genres.includes(genre)} onChange={handleGenreChange} value={genre} />}
                  label={genre}
                  key={genre}
                />
              ))}
            </FormGroup>
          </FormControl>
          <FormControl component="fieldset" sx={{ marginTop: 2, marginBottom: 10 }}>
            <FormLabel component="legend">Classificação Indicativa</FormLabel>
            <FormGroup row>
              {ageRatingOptions.map((rating) => (
                <FormControlLabel
                  control={<Checkbox checked={ageRating.includes(rating)} onChange={handleAgeRatingChange} value={rating} />}
                  label={rating}
                  key={rating}
                />
              ))}
            </FormGroup>
          </FormControl><Button
            variant="contained"
            component="label"
            color="primary"
            sx={{ mt: 1, mb: 1 }}
          >
            Upload do Arquivo
          <input
            type="file"
            hidden
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            style={{color: "#fff"}}
          />
          </Button>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (video ? 'Atualizar Vídeo' : 'Adicionar Vídeo')}
          </Button>
          <LoadingMessage loading={loading} message="Processando vídeo..." />
        </Box>
      </Box>
    </Paper>
  );
};

export default AddVideo;
