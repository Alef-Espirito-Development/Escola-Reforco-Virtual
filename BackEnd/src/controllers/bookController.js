const { createBook, getAllBooks, getBooksByAgeRating, updateBook, deleteBook } = require('../models/bookModel');
const { bucket } = require('../config/firebaseConfig');

/**
 * Controlador para criar um livro.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
const createBookHandler = async (req, res) => {
  try {
    const { title, author, genres, ageRating } = req.body;
    const file = req.files['file'][0];
    const coverImage = req.files['coverImage'][0];

    console.log("Dados recebidos:", { title, author, genres, ageRating });
    console.log("Arquivos recebidos:", { file, coverImage });

    if (!file || !coverImage) {
      return res.status(400).send('Arquivo ou imagem de capa não enviados');
    }

    const fileBlob = bucket.file(Date.now() + '-' + file.originalname);
    const coverBlob = bucket.file(Date.now() + '-' + coverImage.originalname);

    const fileBlobStream = fileBlob.createWriteStream({ resumable: false });
    const coverBlobStream = coverBlob.createWriteStream({ resumable: false });

    fileBlobStream.on('error', (err) => {
      console.error('Erro ao fazer upload do arquivo para o Firebase Storage:', err);
      res.status(500).send('Erro ao fazer upload do arquivo');
    });

    coverBlobStream.on('error', (err) => {
      console.error('Erro ao fazer upload da imagem de capa para o Firebase Storage:', err);
      res.status(500).send('Erro ao fazer upload da imagem de capa');
    });

    fileBlobStream.on('finish', async () => {
      const fileUrl = `https://storage.googleapis.com/${bucket.name}/${fileBlob.name}`;
      coverBlobStream.end(coverImage.buffer);

      coverBlobStream.on('finish', async () => {
        const coverUrl = `https://storage.googleapis.com/${bucket.name}/${coverBlob.name}`;
        const book = { title, author, genres, ageRating, fileUrl, coverUrl };
        console.log("Livro a ser criado:", book);
        const createdBook = await createBook(book);
        res.status(201).send(createdBook);
      });
    });

    fileBlobStream.end(file.buffer);
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    res.status(500).send('Erro ao criar livro');
  }
};

/**
 * Controlador para obter todos os livros.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
const getAllBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    res.status(200).send(books);
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    res.status(500).send('Erro ao buscar livros');
  }
};

/**
 * Controlador para obter livros por faixa etária.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
const getBooksByAgeRatingHandler = async (req, res) => {
  try {
    const { faixaEtaria } = req.params;
    const books = await getBooksByAgeRating(faixaEtaria);
    res.status(200).send(books);
  } catch (error) {
    console.error('Erro ao buscar livros por faixa etária:', error);
    res.status(500).send('Erro ao buscar livros por faixa etária');
  }
};

/**
 * Controlador para atualizar um livro.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
const updateBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const bookUpdates = req.body;
    const updatedBook = await updateBook(id, bookUpdates);
    console.log("Atualizando livro com ID:", id);
    console.log("Novos dados:", bookUpdates);
    res.status(200).send(updatedBook);
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    res.status(500).send('Erro ao atualizar livro');
  }
};

/**
 * Controlador para excluir um livro.
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
const deleteBookHandler = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deletando livro com ID:", id);
    await deleteBook(id);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    res.status(500).send('Erro ao excluir livro');
  }
};

module.exports = { createBookHandler, getAllBooksHandler, getBooksByAgeRatingHandler, updateBookHandler, deleteBookHandler };
