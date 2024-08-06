import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const fetchUserChats = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/chats`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar chats:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

export const createChat = async ({ name, participants, createdAt }) => {
  try {
    const response = await api.post('/chats', { name, participants, createdAt });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar chat:', error);
    throw error;
  }
};

export const fetchMessages = async (chatId) => {
  try {
    const response = await api.get(`/chats/${chatId}/messages`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    throw error;
  }
};

export const sendMessage = async (chatId, userId, senderName, content) => {
  try {
    const response = await api.post(`/chats/${chatId}/messages`, { userId, senderName, content });
    return response.data;
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
};

export const fetchChat = async (chatId) => {
  const response = await api.get(`/chats/${chatId}`);
  return response.data;
};

export const fetchChatDetails = async (chatId) => {
  try {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  } catch (error) {
    throw new Error('Erro ao buscar detalhes do chat');
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

export const fetchChatParticipants = async (chatId) => {
  try {
    const response = await api.get(`/chats/${chatId}/participants`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar participantes do chat:', error);
    throw error;
  }
};
