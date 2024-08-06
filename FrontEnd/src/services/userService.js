import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';
const CLASS_API_URL = 'http://localhost:5000/api/classes';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return { Authorization: `Bearer ${token}` };
};

export const fetchUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return null;
  }
};

export const fetchClassById = async (classId) => {
  try {
    const response = await axios.get(`${CLASS_API_URL}/${classId}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar turma:', error);
    return null;
  }
};
