// controllers/activityController.js
const { createActivity, listActivities, findActivityById, updateActivity, deleteActivity } = require('../models/activityModel');

const addActivity = async (req, res) => {
  try {
    const activityData = req.body;
    const createdActivity = await createActivity(activityData);
    res.status(201).send(createdActivity);
  } catch (error) {
    res.status(500).send('Erro ao adicionar atividade');
  }
};

const getActivities = async (req, res) => {
  try {
    const activities = await listActivities();
    res.status(200).send(activities);
  } catch (error) {
    res.status(500).send('Erro ao buscar atividades');
  }
};

const getActivityById = async (req, res) => {
  try {
    const activityId = req.params.id;
    const activity = await findActivityById(activityId);
    if (!activity) {
      return res.status(404).send('Atividade não encontrada');
    }
    res.status(200).send(activity);
  } catch (error) {
    res.status(500).send('Erro ao buscar atividade');
  }
};

const editActivity = async (req, res) => {
  try {
    const activityId = req.params.id;
    const activityData = req.body;
    const updatedActivity = await updateActivity(activityId, activityData);
    res.status(200).send(updatedActivity);
  } catch (error) {
    res.status(500).send('Erro ao editar atividade');
  }
};

const removeActivity = async (req, res) => {
  try {
    const activityId = req.params.id;
    const deletedActivity = await deleteActivity(activityId);
    if (!deletedActivity) {
      return res.status(404).send('Atividade não encontrada');
    }
    res.status(200).send(deletedActivity);
  } catch (error) {
    res.status(500).send('Erro ao remover atividade');
  }
};

module.exports = { addActivity, getActivities, getActivityById, editActivity, removeActivity };
