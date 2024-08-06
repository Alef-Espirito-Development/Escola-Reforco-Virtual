import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, Paper, Checkbox, FormControlLabel, FormGroup, CircularProgress, FormControl, FormLabel, Grid } from '@mui/material';
import LoadingMessage from './LoadingMessage';
import Message from './Message';

const genreOptions = ['Romance', 'Ficção', 'Mistério', 'Fantasia', 'Aventura', 'Não-ficção', 'Didático'];
const ageRatingOptions = ['Livre', '10+', '12+', '14+', '16+', '18+'];

const AddBook = ({ onClose, book }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genres, setGenres] = useState([]);
  const [ageRating, setAgeRating] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverImageName, setCoverImageName] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setGenres(Array.isArray(book.genres) ? book.genres : book.genres.split(','));
      setAgeRating(book.ageRating);
    }
  }, [book]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleCoverImageChange = (e) => {
    setCoverImage(e.target.files[0]);
    setCoverImageName(e.target.files[0].name);
  };

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
    if (file) formData.append('file', file);
    if (coverImage) formData.append('coverImage', coverImage);

    try {
      const url = book ? `http://localhost:5000/api/books/${book.id}` : 'http://localhost:5000/api/books';
      const method = book ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setSuccessMessage(book ? 'Livro atualizado com sucesso' : 'Livro adicionado com sucesso');
        if (!book) {
          setTitle('');
          setAuthor('');
          setGenres([]);
          setAgeRating('');
          setFile(null);
          setCoverImage(null);
          setFileName('');
          setCoverImageName('');
        }
      } else {
        console.error('Erro ao adicionar/atualizar livro');
        setErrorMessage('Erro ao adicionar/atualizar livro.');
      }
    } catch (error) {
      console.error('Erro ao adicionar/atualizar livro:', error);
      setErrorMessage('Erro ao adicionar/atualizar livro. Tente novamente mais tarde.');
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
          {book ? 'Editar Livro' : 'Adicionar Livro'}
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
          </FormControl>
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 1, mb: 1, mr: 4 }}
          >
            Upload do Arquivo
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
          {fileName && <Typography variant="body2" sx={{ mb: 2 }}>{`Arquivo selecionado: ${fileName}`}</Typography>}
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 1, mb: 1 }}
          >
            Upload da Imagem de Capa
            <input
              type="file"
              hidden
              onChange={handleCoverImageChange}
            />
          </Button>
          {coverImageName && <Typography variant="body2" sx={{ mb: 2 }}>{`Imagem de capa selecionada: ${coverImageName}`}</Typography>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (book ? 'Atualizar Livro' : 'Adicionar Livro')}
          </Button>
          <LoadingMessage loading={loading} message="Processando livro..." />
        </Box>
      </Box>
    </Paper>
  );
};

export default AddBook;
