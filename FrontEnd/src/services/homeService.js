import axios from 'axios';

const API_URL = 'http://localhost:5000/api/forum';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, { headers: getAuthHeader() });
    console.log('fetchNotifications response:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    throw error;
  }
};

export const fetchUpcomingEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events/upcoming`, { headers: getAuthHeader() });
    console.log('fetchUpcomingEvents response:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar próximos eventos:', error);
    throw error;
  }
};

export const fetchMostReadBooks = async () => {
  try {
    const response = await axios.get(`${API_URL}/books/most-read`, { headers: getAuthHeader() });
    console.log('fetchMostReadBooks response:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar livros mais lidos:', error);
    throw error;
  }
};

export const fetchLastAccess = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/last-access`, { headers: getAuthHeader() });
    console.log('fetchLastAccess response:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar último acesso dos usuários:', error);
    throw error;
  }
};

export const fetchMostWatchedVideos = async () => {
  try {
    const response = await axios.get(`${API_URL}/videos/most-watched`, { headers: getAuthHeader() });
    console.log('fetchMostWatchedVideos response:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar vídeos mais assistidos:', error);
    throw error;
  }
};

export const fetchMostLikedVideos = async () => {
  try {
    const response = await axios.get(`${API_URL}/videos/most-liked`, { headers: getAuthHeader() });
    console.log('fetchMostLikedVideos response:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar vídeos com mais curtidas:', error);
    throw error;
  }
};

export const fetchMostLikedComments = async () => {
  try {
    const response = await axios.get(`${API_URL}/comments/most-liked`, { headers: getAuthHeader() });
    const comments = response.data;

    // Fetch user details for each comment
    const userPromises = comments.map(comment => 
      axios.get(`${API_URL}/users/${comment.author}`, { headers: getAuthHeader() })
        .then(userResponse => ({
          ...comment,
          authorName: userResponse.data.nome + ' ' + userResponse.data.sobrenome
        }))
        .catch(error => {
          console.error(`Erro ao buscar detalhes do usuário para ${comment.author}:`, error);
          return { ...comment, authorName: 'Usuário desconhecido' };
        })
    );

    return Promise.all(userPromises);
  } catch (error) {
    console.error('Erro ao buscar comentários mais curtidos:', error);
    throw error;
  }
};
