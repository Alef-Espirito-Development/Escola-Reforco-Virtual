const { db } = require('../config/firebaseConfig');

const createTopic = async (topic) => {
  const topicRef = db.collection('topics').doc();
  topic.id = topicRef.id;
  const cleanedTopic = JSON.parse(JSON.stringify(topic, (key, value) => (value === undefined ? null : value)));
  await topicRef.set(cleanedTopic);
  console.log('Tópico criado no Firestore:', cleanedTopic);
  return cleanedTopic;
};

const getTopicsByClass = async (classId) => {
  const snapshot = await db.collection('topics').where('classId', '==', classId).get();
  return snapshot.docs.map(doc => doc.data());
};

const getAllTopics = async () => {
  const snapshot = await db.collection('topics').get();
  return snapshot.docs.map(doc => doc.data());
};

const getTopicById = async (id) => {
  const topicRef = db.collection('topics').doc(id);
  const topicDoc = await topicRef.get();
  if (!topicDoc.exists) {
    throw new Error('Tópico não encontrado');
  }
  return topicDoc.data();
};

module.exports = { createTopic, getTopicsByClass, getTopicById, getAllTopics };
