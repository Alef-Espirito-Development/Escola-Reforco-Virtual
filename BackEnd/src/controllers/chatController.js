const { getUserChats, createChat } = require('../models/chatModel');
const { getAllUsers } = require('../models/userModel');
const { db } = require('../config/firebaseConfig');

const createChatHandler = async (req, res) => {
  try {
    const { name, participants, filter } = req.body;
    const creatorId = req.userId; // Supondo que o ID do usuário logado esteja disponível no req.userId
    const userType = req.userType; // Supondo que o tipo do usuário esteja disponível no req.userType
    console.log('Dados recebidos para criar chat:', req.body);

    if (!name || !Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: 'Nome do chat e participantes são obrigatórios' });
    }

    if (filter === 'class' && userType !== 'Professor') {
      return res.status(403).json({ error: 'Somente professores podem criar chats por turma' });
    }

    // Adicionar o ID do criador ao array de participantes, se ainda não estiver presente
    if (!participants.includes(creatorId)) {
      participants.push(creatorId);
    }

    const chatId = await createChat(name, participants);
    res.status(201).json({ chatId });
  } catch (error) {
    console.error('Erro ao criar chat:', error);
    res.status(500).json({ error: error.message });
  }
};

const getUserChatsHandler = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Buscando chats do usuário com ID:', id);
    const chats = await getUserChats(id);
    if (chats.length === 0) {
      console.log('Nenhum chat encontrado para o usuário com ID:', id);
      return res.status(404).send('Nenhum chat encontrado');
    }
    console.log('Chats encontrados:', chats);
    res.status(200).send(chats);
  } catch (error) {
    console.error('Erro ao buscar chats do usuário:', error);
    res.status(500).send('Erro ao buscar chats do usuário');
  }
};

const getAllUsersHandler = async (req, res) => {
  try {
    console.log('Buscando todos os usuários');
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: error.message });
  }
};

const getChatParticipantsHandler = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chatDoc = await db.collection('chats').doc(chatId).get();
    if (!chatDoc.exists) {
      return res.status(404).json({ error: 'Chat não encontrado' });
    }

    const participantsIds = chatDoc.data().participants;
    const participants = [];
    for (const userId of participantsIds) {
      if (userId) {
        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          participants.push(userDoc.data());
        }
      }
    }

    res.json(participants);
  } catch (error) {
    console.error('Erro ao buscar participantes do chat:', error);
    res.status(500).json({ error: 'Erro ao buscar participantes do chat' });
  }
};

module.exports = { createChatHandler, getUserChatsHandler, getAllUsersHandler, getChatParticipantsHandler };
