const { db } = require('../config/firebaseConfig');

const addClass = async (className) => {
  const classRef = db.collection('classes').doc();
  const newClass = {
    nome: className,
    id: classRef.id,
    students: [] // Certifique-se de que estamos inicializando isso
  };
  await classRef.set(newClass);
  console.log('Turma criada no Firestore:', newClass);
  return newClass;
};

const findClassById = async (classId) => {
  const classRef = db.collection('classes').doc(classId);
  const classDoc = await classRef.get();
  if (!classDoc.exists) {
    return null;
  }
  return { id: classDoc.id, ...classDoc.data() };
};

const findClassByName = async (className) => {
  const classesRef = db.collection('classes');
  const snapshot = await classesRef.where('nome', '==', className).get();
  if (snapshot.empty) {
    return null;
  }
  let classData = null;
  snapshot.forEach(doc => {
    classData = doc.data();
  });
  console.log('Turma encontrada no Firestore:', classData);
  return classData;
};

// Função para buscar todas as turmas
const getClasses = async () => {
  const snapshot = await db.collection('classes').get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    // Certifique-se de que o campo 'students' exista
    if (!data.students) {
      data.students = [];
    }
    return { id: doc.id, ...data };
  });
};

module.exports = { addClass, findClassByName, getClasses, findClassById };
