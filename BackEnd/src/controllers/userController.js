const { getAllUsers, createUser, findUserById } = require('../models/userModel');
const { db } = require('../config/firebaseConfig');
const { FieldValue } = require('firebase-admin/firestore');

const createUserHandler = async (req, res) => {
  try {
    const user = req.body;
    console.log('Criando usuário com os dados:', user);

    const createdUser = await createUser(user);

    res.status(201).send(createdUser);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).send('Erro ao criar usuário');
  }
};

const getAllUsersHandler = async (req, res) => {
  try {
    console.log('Buscando todos os usuários');
    const users = await getAllUsers();
    res.status(200).send(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro ao buscar usuários');
  }
};

const getUserByIdHandler = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('Buscando usuário com ID:', userId);
    const user = await findUserById(userId);
    if (!user) {
      console.log('Usuário não encontrado com ID:', userId);
      return res.status(404).send('Usuário não encontrado');
    }
    console.log('Usuário encontrado:', user);
    res.status(200).send(user);
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    res.status(500).send('Erro ao buscar dados do usuário');
  }
};

module.exports = { createUserHandler, getAllUsersHandler, getUserByIdHandler };
