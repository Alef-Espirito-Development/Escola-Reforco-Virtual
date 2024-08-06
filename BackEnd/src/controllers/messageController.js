const { getMessages, sendMessage } = require('../models/messageModel');
const { findUserById } = require('../models/userModel');

const getMessagesHandler = async (req, res) => {
  try {
    const { chatId } = req.params;
    const messages = await getMessages(chatId);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
};

const sendMessageHandler = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userId, content } = req.body;
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    const senderName = `${user.nome} ${user.sobrenome}`;
    const message = await sendMessage(chatId, userId, senderName, content);
    res.status(201).json(message);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
};

module.exports = { getMessagesHandler, sendMessageHandler };
