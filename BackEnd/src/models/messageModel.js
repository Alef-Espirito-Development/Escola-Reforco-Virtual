const { admin, db } = require('../config/firebaseConfig');

const getMessages = async (chatId) => {
  const messagesRef = db.collection('chats').doc(chatId).collection('messages').orderBy('timestamp', 'asc');
  const snapshot = await messagesRef.get();
  if (snapshot.empty) {
    return [];
  }
  const messages = [];
  snapshot.forEach(doc => {
    messages.push({ id: doc.id, ...doc.data() });
  });
  return messages;
};

const sendMessage = async (chatId, senderId, senderName, content) => {
  const message = {
    senderId,
    senderName, // Inclui o nome do remetente
    content,
    timestamp: admin.firestore.Timestamp.now(),
  };
  const messagesRef = db.collection('chats').doc(chatId).collection('messages');
  const messageRef = await messagesRef.add(message);
  return { id: messageRef.id, ...message };
};

module.exports = { getMessages, sendMessage };
