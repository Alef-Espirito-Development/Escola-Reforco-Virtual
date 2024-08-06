import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Modal,
  Box,
  IconButton,
  TextField,
  MenuItem,
  CircularProgress,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { jwtDecode } from 'jwt-decode';
import AddVideo from './AddVideo';
import LoadingMessage from './LoadingMessage';

const genres = ['Todos', 'Romance', 'Ficção', 'Mistério', 'Fantasia', 'Aventura', 'Não-ficção', 'Didático', 'Filmes', 'Inclusão'];

const VideoCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const VideoThumbnail = styled.div`
  position: relative;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
  overflow: hidden;
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const LibraryVideos = () => {
  const [videos, setVideos] = useState([]);
  const [userAge, setUserAge] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [videosPerPage] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [userType, setUserType] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Usuário não autenticado');
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Erro ao buscar dados do usuário');
        }

        const userData = await userResponse.json();
        setUserAge(userData.idade);
        setUserType(userData.tipo);

        const videosResponse = await fetch('http://localhost:5000/api/videos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!videosResponse.ok) {
          throw new Error('Erro ao buscar vídeos');
        }

        const videosData = await videosResponse.json();
        setVideos(videosData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao buscar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const filterVideosByAgeRating = (videos) => {
    if (userType === 'Professor') {
      return videos;
    }
    return videos.filter((video) => {
      if (video.ageRating === 'Livre') return true;
      if (parseInt(video.ageRating, 10) <= userAge) return true;
      return false;
    });
  };

  const filterVideos = (videos) => {
    return videos.filter((video) => {
      const matchesGenre = selectedGenre === 'Todos' || (Array.isArray(video.genres) ? video.genres.includes(selectedGenre) : video.genres.split(',').includes(selectedGenre));
      const matchesSearchTerm = video.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGenre && matchesSearchTerm;
    });
  };

  const filteredVideos = filterVideosByAgeRating(filterVideos(videos));

  const handleOpen = (video) => {
    setSelectedVideo(video);
    setOpen(true);
    setEditMode(false);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedVideo(null);
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setOpen(true);
    setEditMode(true);
  };

  const handleDelete = (video) => {
    setVideoToDelete(video);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/videos/${videoToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setVideos(videos.filter((video) => video.id !== videoToDelete.id));
        setDeleteDialogOpen(false);
        setVideoToDelete(null);
      } else {
        console.error('Erro ao deletar vídeo');
      }
    } catch (error) {
      console.error('Erro ao deletar vídeo:', error);
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setVideoToDelete(null);
  };

  const handleLike = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/videos/${videoId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const updatedVideo = await response.json();
        setVideos(videos.map((video) => (video.id === updatedVideo.id ? updatedVideo : video)));
      } else {
        console.error('Erro ao dar like no vídeo');
      }
    } catch (error) {
      console.error('Erro ao dar like no vídeo:', error);
    }
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%', // Ajuste a largura do modal
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    maxHeight: '90vh', // Reduza a altura máxima do modal
  };

  // Paginação
  const indexOfLastVideo = currentPage * videosPerPage;
  const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
  const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="lg">
        <LoadingMessage loading={loading} message="Carregando vídeos..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container component="main" maxWidth="lg">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 4, mb: 4, boxShadow: 4, bgcolor: 'background.paper', p: 2, borderRadius: 2 }}>
        Biblioteca de Vídeos
      </Typography>
      {userType === 'Professor' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setOpen(true);
            setEditMode(false);
            setSelectedVideo(null);
          }} // Abre o modal para adicionar vídeo
          sx={{ mb: 4 }}
        >
          Adicionar Vídeo
        </Button>
      )}
      <TextField
        label="Buscar vídeos"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <TextField
        select
        label="Filtrar por gênero"
        variant="outlined"
        fullWidth
        margin="normal"
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
      >
        {genres.map((genre) => (
          <MenuItem key={genre} value={genre}>
            {genre}
          </MenuItem>
        ))}
      </TextField>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {currentVideos.map((video) => (
              <Grid item key={video.id} xs={12} sm={6} md={3}>
                <VideoCard sx={{ boxShadow: 4}}>
                  <VideoThumbnail>
                    <iframe src={video.videoUrl} title={video.title} frameBorder="0"></iframe>
                  </VideoThumbnail>
                  <CardContent sx={{ flexGrow: 1, p: 1 }}>
                    <Typography gutterBottom variant="body1" component="div" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                      {video.author}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                    <Button size="small" sx={{ color: 'green' }} onClick={() => handleOpen(video)}>
                      Assistir
                    </Button>
                    {userType === 'Professor' && (
                      <>
                        <IconButton size="small" sx={{ color: 'orange' }} onClick={() => handleEdit(video)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" sx={{ color: 'red' }} onClick={() => handleDelete(video)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton size="small" sx={{ color: 'blue' }} onClick={() => handleLike(video.id)}>
                      <ThumbUpIcon />
                    </IconButton>
                    <Typography variant="body2">
                      {video.likes.length} likes
                    </Typography>
                  </CardActions>
                </VideoCard>
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={Math.ceil(filteredVideos.length / videosPerPage)}
            page={currentPage}
            onChange={paginate}
            sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
          />
        </>
      )}
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          {selectedVideo && !editMode ? (
            <>
              <Typography id="modal-modal-title" variant="h4" component="h2" gutterBottom>
                {selectedVideo.title}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {selectedVideo.author}
              </Typography>
              <iframe
                src={selectedVideo.videoUrl}
                style={{ width: '100%', height: '60vh', border: 'none' }}
                title="Video Content"
              ></iframe>
            </>
          ) : (
            <AddVideo onClose={handleClose} video={editMode ? selectedVideo : null} />
          )}
        </Box>
      </Modal>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmar exclusão"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir o vídeo "{videoToDelete?.title}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LibraryVideos;
