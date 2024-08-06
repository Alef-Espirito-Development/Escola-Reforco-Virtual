const db = require('../config/firebaseConfig').db;
const { FieldValue } = require('firebase-admin/firestore');

const createUser = async (userData) => {
  const userRef = db.collection('users').doc();
  userData.id = userRef.id;

  const cleanedData = JSON.parse(JSON.stringify(userData, (key, value) => value === '' ? undefined : value));

  await userRef.set(cleanedData, { merge: true });
  console.log('Dados armazenados no Firestore:', cleanedData);

  // Verificar se a classId está presente e adicionar o ID do usuário à turma
  if (userData.classId) {
    const classRef = db.collection('classes').doc(userData.classId);
    await classRef.update({
      students: FieldValue.arrayUnion(userData.id)
    });
    console.log(`Usuário ${userData.id} adicionado à turma ${userData.classId}`);
  }

  return cleanedData;
};

const findUserByEmail = async (email) => {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('email', '==', email).get();
  if (snapshot.empty) {
    console.log('Nenhum usuário encontrado com email:', email);
    return null;
  }
  let user = null;
  snapshot.forEach(doc => {
    user = doc.data();
  });
  console.log('Usuário encontrado:', user);
  return user;
};

const findUserById = async (id) => {
  const userRef = db.collection('users').doc(id);
  const userDoc = await userRef.get();
  if (!userDoc.exists) {
    console.log('Nenhum usuário encontrado com ID:', id);
    return null;
  }
  console.log('Usuário encontrado com ID:', id, userDoc.data());
  return userDoc.data();
};

const getAllUsers = async () => {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();
  if (snapshot.empty) {
    return [];
  }
  const users = [];
  snapshot.forEach(doc => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};

module.exports = { createUser, findUserByEmail, findUserById, getAllUsers };
