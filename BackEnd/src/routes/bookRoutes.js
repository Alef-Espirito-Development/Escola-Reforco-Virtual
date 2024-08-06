const express = require('express');
const router = express.Router();
const { createBookHandler, getAllBooksHandler, getBooksByAgeRatingHandler, updateBookHandler, deleteBookHandler } = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Rota para criar um livro (apenas para usuários autenticados)
router.post('/', authMiddleware, uploadMiddleware.fields([{ name: 'file', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]), createBookHandler);

// Rota para obter todos os livros (apenas para usuários autenticados)
router.get('/', authMiddleware, getAllBooksHandler);

// Rota para obter livros por faixa etária (apenas para usuários autenticados)
router.get('/faixa-etaria/:faixaEtaria', authMiddleware, getBooksByAgeRatingHandler);

// Rota para atualizar um livro (apenas para usuários autenticados)
router.put('/:id', authMiddleware, updateBookHandler);

// Rota para deletar um livro (apenas para usuários autenticados)
router.delete('/:id', authMiddleware, deleteBookHandler);

module.exports = router;
