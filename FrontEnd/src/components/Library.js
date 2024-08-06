import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, Modal, Box, IconButton, TextField, MenuItem, CircularProgress, Pagination, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { jwtDecode } from 'jwt-decode';
import AddBook from './AddBook';
import LoadingMessage from './LoadingMessage';

const genres = ['Todos', 'Romance', 'Ficção', 'Mistério', 'Fantasia', 'Aventura', 'Não-ficção', 'Didático'];

const Library = () => {
  const [books, setBooks] = useState([]);
  const [userAge, setUserAge] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [userType, setUserType] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

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

        await fetchBooks();
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Erro ao buscar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem('token');
        const booksResponse = await fetch('http://localhost:5000/api/books', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!booksResponse.ok) {
          throw new Error('Erro ao buscar livros');
        }
        const booksData = await booksResponse.json();
        setBooks(booksData);
      } catch (error) {
        console.error('Erro ao buscar livros:', error);
        setError('Erro ao buscar livros. Tente novamente mais tarde.');
      }
    };

    fetchUserData();
  }, []);

  const filterBooksByAgeRating = (books) => {
    if (userType === 'Professor') {
      return books;
    }
    return books.filter((book) => {
      if (book.ageRating === 'Livre') return true;
      if (parseInt(book.ageRating, 10) <= userAge) return true;
      return false;
    });
  };

  const filterBooks = (books) => {
    return books.filter((book) => {
      const matchesGenre = selectedGenre === 'Todos' || (Array.isArray(book.genres) ? book.genres.includes(selectedGenre) : book.genres.split(',').includes(selectedGenre));
      const matchesSearchTerm = book.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGenre && matchesSearchTerm;
    });
  };

  const filteredBooks = filterBooks(filterBooksByAgeRating(books));

  const handleOpen = (book) => {
    setSelectedBook(book);
    setOpen(true);
    setEditMode(false);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBook(null);
  };

  const handleEdit = (book) => {
    setSelectedBook(book);
    setOpen(true);
    setEditMode(true);
  };

  const handleDelete = (book) => {
    setBookToDelete(book);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/books/${bookToDelete.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBooks(books.filter(book => book.id !== bookToDelete.id));
        setDeleteDialogOpen(false);
        setBookToDelete(null);
      } else {
        console.error('Erro ao deletar livro');
      }
    } catch (error) {
      console.error('Erro ao deletar livro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setBookToDelete(null);
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
    maxHeight: '110vh', // Reduza a altura máxima do modal
  };

  // Paginação
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (event, value) => {
    setCurrentPage(value);
  };

  if (loading) {
    return (
      <Container component="main" maxWidth="lg">
        <LoadingMessage loading={loading} message="Carregando livros..." />
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
        Biblioteca
      </Typography>
      {userType === 'Professor' && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => { setOpen(true); setEditMode(false); setSelectedBook(null); }} // Abre o modal para adicionar livro
          sx={{ mb: 4 }}
        >
          Adicionar Livro
        </Button>
      )}
      <TextField
        label="Buscar livros"
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
      <>
        <Grid container spacing={4}>
          {currentBooks.map((book) => (
            <Grid item key={book.id} xs={12} sm={6} md={3}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 4 }}>
                <CardMedia
                  component="img"
                  height="350"
                  image={book.coverUrl || 'https://via.placeholder.com/250x350'}
                  alt={book.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography gutterBottom variant="h6" component="div" sx={{ textAlign: 'center' }}>
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    {book.author}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button size="small" sx={{ color: 'green' }} onClick={() => handleOpen(book)}>
                    Ler
                  </Button>
                  {userType === 'Professor' && (
                    <>
                      <IconButton size="small" sx={{ color: 'orange' }} onClick={() => handleEdit(book)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'red' }} onClick={() => handleDelete(book)}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={Math.ceil(filteredBooks.length / booksPerPage)}
          page={currentPage}
          onChange={paginate}
          sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
        />
      </>
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
          {selectedBook && !editMode ? (
            <>
              <Typography id="modal-modal-title" variant="h4" component="h2" gutterBottom>
                {selectedBook.title}
              </Typography>
              <Typography variant="h6" gutterBottom>
                {selectedBook.author}
              </Typography>
              <iframe
                src={selectedBook.fileUrl}
                style={{ width: '100%', height: '80vh', border: 'none' }}
                title="Book Content"
              ></iframe>
            </>
          ) : (
            <AddBook onClose={handleClose} book={editMode ? selectedBook : null} />
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
            Tem certeza que deseja excluir o livro "{bookToDelete?.title}"?
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

export default Library;
