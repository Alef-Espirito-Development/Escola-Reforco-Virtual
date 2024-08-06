// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/userModel');
const { findClassByName, addClass } = require('../models/Class');

// Controlador para registrar usuários
const register = async (req, res) => {
  try {
    console.log('Dados recebidos para registro:', req.body);
    const { nome, sobrenome, email, senha, tipo, materia, escola, idade, turma } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).send('Email já registrado');
    }

    let classData = await findClassByName(turma);
    if (!classData) {
      classData = await addClass(turma); // Adicionar a turma se não existir
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    const newUser = { nome, sobrenome, email, senha: hashedPassword, tipo, materia, escola, idade, classId: classData.id };
    const createdUser = await createUser(newUser);

    res.status(201).send(createdUser);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).send('Erro ao registrar usuário');
  }
};

// Controlador para login de usuários
const login = async (req, res) => {
  try {
    console.log('Dados recebidos para login:', req.body);
    const { email, senha } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).send('Usuário não encontrado');
    }

    console.log('Senha armazenada:', user.senha); // Log para a senha armazenada
    if (!user.senha) {
      return res.status(500).send('Erro ao fazer login: senha não encontrada no usuário');
    }

    if (!senha) {
      return res.status(400).send('Senha não fornecida');
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(400).send('Senha incorreta');
    }

    const token = jwt.sign({ id: user.id, email: user.email, tipo: user.tipo }, process.env.JWT_SECRET, { expiresIn: '10h' });
    console.log('Token gerado:', token);
    res.status(200).send({ token, userId: user.id, tipo: user.tipo }); // Adicionar userId na resposta
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).send('Erro ao fazer login');
  }
};

module.exports = { register, login };
