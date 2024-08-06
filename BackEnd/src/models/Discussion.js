const { db } = require('../config/firebaseConfig');

const createDiscussion = async (discussion) => {
  if (!discussion.topicId || !discussion.content || !discussion.author) {
    throw new Error('Campos obrigatórios faltando');
  }

  const discussionRef = db.collection('discussions').doc();
  discussion.id = discussionRef.id;
  await discussionRef.set(discussion);
  return discussion;
};

const getDiscussionsByTopic = async (topicId) => {
  const snapshot = await db.collection('discussions').where('topicId', '==', topicId).get();
  return snapshot.docs.map(doc => doc.data());
};

const likeDiscussion = async (discussionId, userId) => {
  const discussionRef = db.collection('discussions').doc(discussionId);
  const discussionDoc = await discussionRef.get();
  if (!discussionDoc.exists) {
    throw new Error('Discussão não encontrada');
  }

  const discussionData = discussionDoc.data();
  console.log('Curtindo discussão ID:', discussionId, 'por usuário ID:', userId);
  if (!discussionData.likes.includes(userId)) {
    discussionData.likes.push(userId);
  }

  await discussionRef.update({ likes: discussionData.likes });
  return discussionData;
};

const getMostLikedComments = async () => {
  console.log('Buscando comentários mais curtidos');
  const snapshot = await db.collection('discussions').orderBy('likes', 'desc').limit(5).get();
  const comments = snapshot.docs.map(doc => doc.data());
  console.log('Comentários mais curtidos encontrados:', comments);
  return comments;
};

module.exports = { createDiscussion, getDiscussionsByTopic, likeDiscussion, getMostLikedComments };
