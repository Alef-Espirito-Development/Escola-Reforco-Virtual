const { db } = require('../config/firebaseConfig');

/**
 * Cria um novo livro no Firestore.
 * @param {Object} book - Objeto contendo as informações do livro.
 * @returns {Object} - O livro criado.
 */
const createBook = async (book) => {
  const bookRef = db.collection('books').doc();
  book.id = bookRef.id;
  await bookRef.set(book);
  return book;
};

/**
 * Obtém todos os livros do Firestore.
 * @returns {Array} - Lista de livros.
 */
const getAllBooks = async () => {
  const snapshot = await db.collection('books').get();
  return snapshot.docs.map(doc => doc.data());
};

/**
 * Obtém livros filtrados pela faixa etária.
 * @param {string} ageRating - Faixa etária para filtrar os livros.
 * @returns {Array} - Lista de livros que correspondem à faixa etária.
 */
const getBooksByAgeRating = async (ageRating) => {
  const snapshot = await db.collection('books').where('faixaEtaria', '==', ageRating).get();
  return snapshot.docs.map(doc => doc.data());
};

/**
 * Atualiza um livro no Firestore.
 * @param {string} id - ID do livro a ser atualizado.
 * @param {Object} bookUpdates - Dados do livro atualizados.
 * @returns {Object} - O livro atualizado.
 */
const updateBook = async (id, bookUpdates) => {
  const bookRef = db.collection('books').doc(id);
  await bookRef.update(bookUpdates);
  const updatedBook = await bookRef.get();
  return updatedBook.data();
};

/**
 * Exclui um livro do Firestore.
 * @param {string} id - ID do livro a ser excluído.
 */
const deleteBook = async (id) => {
  const bookRef = db.collection('books').doc(id);
  await bookRef.delete();
};

module.exports = { createBook, getAllBooks, getBooksByAgeRating, updateBook, deleteBook };
