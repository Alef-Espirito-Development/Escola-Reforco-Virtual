import axios from 'axios';

const API_URL = 'http://localhost:5000/api/classes';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const fetchClasses = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    return [];
  }
};
