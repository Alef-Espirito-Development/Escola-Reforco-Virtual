import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid, Card, CardContent, Divider, Avatar, IconButton } from '@mui/material';
import { styled, keyframes } from '@mui/system';
import { fetchMostLikedComments } from '../services/homeService';
import LoadingMessage from './LoadingMessage';
import Message from './Message';
import logo from '../imagem.png';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Root = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #2e7d32, #60ad5e)',
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[10],
  color: theme.palette.common.white,
  textAlign: 'center',
}));

const Logo = styled('img')({
  width: '150px',
  height: '150px',
  animation: `${spin} 10s linear infinite`,
  marginBottom: '32px',
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 'bold',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.4)',
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  marginTop: theme.spacing(1),
  fontSize: '1.2rem',
  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
}));

const CommentCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
  color: theme.palette.common.white,
  boxShadow: theme.shadows[4],
  borderRadius: theme.shape.borderRadius,
}));

const CommentContent = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const Home = () => {
  const [mostLikedComments, setMostLikedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const mostLikedCommentsData = await fetchMostLikedComments();
        console.log('Comentários com mais curtidas:', mostLikedCommentsData);
        setMostLikedComments(mostLikedCommentsData);
      } catch (error) {
        console.error('Erro ao buscar dados do servidor:', error);
        setErrorMessage('Erro ao buscar dados do servidor. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingMessage loading={loading} message="Carregando comentários..." />;
  }

  if (errorMessage) {
    return <Message type="error" text={errorMessage} />;
  }

  return (
    <Container component="main" maxWidth="md">
      <Root>
        <Logo src={logo} alt="Escola Estadual" />
        <Title component="h1" variant="h4" gutterBottom>
          E. E. JPV - Escola Estadual João Pereira Valim
        </Title>
        <Subtitle component="h2" variant="h6" gutterBottom>
          Inocência - MS
        </Subtitle>
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <CommentCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Comentários com Mais Curtidas
                </Typography>
                {mostLikedComments.length > 0 ? (
                  mostLikedComments.map((comment) => (
                    <Box key={comment.id} sx={{ mb: 2 }}>
                      <CommentContent variant="body1">{comment.content}</CommentContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Avatar alt={comment.authorName} src={comment.authorAvatar} sx={{ mr: 2 }} />
                        <CommentContent variant="body2">
                          {comment.authorName}
                        </CommentContent>
                        <IconButton sx={{ ml: 'auto', color: 'white' }}>
                          <ThumbUpIcon /> {comment.likes.length}
                        </IconButton>
                      </Box>
                      <Divider sx={{ mt: 1, mb: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }} />
                    </Box>
                  ))
                ) : (
                  <CommentContent variant="body2">
                    Nenhum comentário encontrado.
                  </CommentContent>
                )}
              </CardContent>
            </CommentCard>
          </Grid>
        </Grid>
      </Root>
    </Container>
  );
};

export default Home;
