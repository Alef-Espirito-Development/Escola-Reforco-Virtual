// models/activityModel.js
const { db } = require('../config/firebaseConfig');

const createActivity = async (activityData) => {
  const activityRef = await db.collection('activities').add(activityData);
  return { id: activityRef.id, ...activityData };
};

const listActivities = async () => {
  const snapshot = await db.collection('activities').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const findActivityById = async (activityId) => {
  const activityRef = await db.collection('activities').doc(activityId).get();
  if (!activityRef.exists) return null;
  return { id: activityRef.id, ...activityRef.data() };
};

const updateActivity = async (activityId, activityData) => {
  await db.collection('activities').doc(activityId).update(activityData);
  return { id: activityId, ...activityData };
};

const deleteActivity = async (activityId) => {
  const activityRef = await db.collection('activities').doc(activityId).get();
  if (!activityRef.exists) return null;
  await db.collection('activities').doc(activityId).delete();
  return activityRef.data();
};

module.exports = { createActivity, listActivities, findActivityById, updateActivity, deleteActivity };
