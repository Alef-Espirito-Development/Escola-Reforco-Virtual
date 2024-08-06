const { db, admin } = require('../config/firebaseConfig');

const createChat = async (name, participants) => {
  if (!Array.isArray(participants)) {
    throw new Error('Participants must be an array');
  }

  const chatRef = db.collection('chats').doc();
  const chatData = {
    name,
    participants: participants.filter(participant => participant !== undefined),
    createdAt: new Date()
  };

  await chatRef.set(chatData);
  console.log('Chat criado com ID:', chatRef.id, 'e dados:', chatData);
  return chatRef.id;
};

const getUserChats = async (userId) => {
  console.log('Buscando chats para o usuário com ID:', userId);
  const chatsRef = db.collection('chats').where('participants', 'array-contains', userId);
  const snapshot = await chatsRef.get();
  if (snapshot.empty) {
    console.log('Nenhum chat encontrado para o usuário com ID:', userId);
    return [];
  }
  const chats = [];
  snapshot.forEach(doc => {
    chats.push({ id: doc.id, ...doc.data() });
  });
  return chats;
};

module.exports = { createChat, getUserChats };
