import axios from 'axios';

const API_URL = 'http://localhost:5000/api/forum';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

const getUserId = () => {
  const userId = localStorage.getItem('userId');
  console.log('User ID recuperado do localStorage:', userId);  // Adicione este log para verificar o userId
  return userId;
};

export const fetchTopics = async (classId) => {
  try {
    console.log('Enviando solicitação para buscar tópicos para a turma:', classId);
    const response = await axios.get(`${API_URL}/topics`, {
      headers: getAuthHeader(),
      params: { classId }
    });
    console.log('Resposta recebida para buscar tópicos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tópicos:', error);
    return [];
  }
};

export const fetchTopic = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/topics/${id}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tópico:', error);
    return null;
  }
};

export const postDiscussion = async (topicId, content) => {
  try {
    console.log('Enviando solicitação para criar discussão:', { topicId, content });
    const userId = getUserId();
    const response = await axios.post(
      `${API_URL}/topics/${topicId}/discussions`,
      { topicId, content, author: userId },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao postar discussão:', error);
    return null;
  }
};

export const createTopic = async (title, description, classId, status, startDate, endDate) => {
  try {
    const response = await axios.post(
      `${API_URL}/topics`,
      { title, description, classId, status, startDate, endDate },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao criar tópico:', error);
    return null;
  }
};

export const likeDiscussion = async (discussionId) => {
  try {
    const userId = getUserId();
    console.log('Enviando solicitação para curtir discussão:', { discussionId, userId });
    const response = await axios.post(
      `${API_URL}/discussions/${discussionId}/like`,
      { userId },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Erro ao curtir discussão:', error);
    return null;
  }
};