const { createTopic, getTopicsByClass, getTopicById, getAllTopics } = require('../models/Topic');
const { createDiscussion, getDiscussionsByTopic, likeDiscussion, getMostLikedComments } = require('../models/Discussion');
const { findClassById } = require('../models/Class');
const { findUserById } = require('../models/userModel');

// Função para verificar e atualizar status do tópico
const updateTopicStatus = (topics) => {
  const currentDate = new Date();
  return topics.map(topic => {
    if (new Date(topic.endDate) < currentDate && topic.status !== 'indisponível') {
      topic.status = 'indisponível';
    }
    return topic;
  });
};

exports.createTopicHandler = async (req, res) => {
  try {
    const { title, description, classId, status, startDate, endDate } = req.body;
    const author = req.user.id;

    const classData = await findClassById(classId);
    if (!classData) {
      return res.status(404).send('Turma não encontrada');
    }

    const newTopic = { title, description, author, classId: classData.id, status, startDate, endDate, createdAt: new Date() };
    const createdTopic = await createTopic(newTopic);
    res.status(201).send(createdTopic);
  } catch (error) {
    res.status(500).send('Erro ao criar tópico');
  }
};

exports.getTopicsHandler = async (req, res) => {
  try {
    const { classId } = req.query;
    let topics;
    if (classId) {
      topics = await getTopicsByClass(classId);
    } else {
      topics = await getAllTopics();
    }

    topics = updateTopicStatus(topics);

    const detailedTopics = await Promise.all(topics.map(async topic => {
      const author = await findUserById(topic.author);
      return {
        ...topic,
        professorName: `${author.nome} ${author.sobrenome}`,
        subject: author.materia,
        school: author.escola
      };
    }));

    res.status(200).send(detailedTopics);
  } catch (error) {
    res.status(500).send('Erro ao buscar tópicos');
  }
};

exports.getTopicHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await getTopicById(id);
    const discussions = await getDiscussionsByTopic(id);
    res.status(200).send({ topic, discussions });
  } catch (error) {
    res.status(500).send('Erro ao buscar tópico');
  }
};

exports.createDiscussionHandler = async (req, res) => {
  try {
    const { topicId, content } = req.body;
    const author = req.user.id;

    if (!topicId || !content || !author) {
      return res.status(400).send('Campos obrigatórios faltando');
    }

    const newDiscussion = { topicId, content, author, likes: [], createdAt: new Date() };
    const createdDiscussion = await createDiscussion(newDiscussion);
    res.status(201).send(createdDiscussion);
  } catch (error) {
    res.status(500).send('Erro ao criar discussão');
  }
};

exports.likeDiscussionHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const updatedDiscussion = await likeDiscussion(id, userId);
    res.status(200).send(updatedDiscussion);
  } catch (error) {
    res.status(500).send('Erro ao curtir discussão');
  }
};

exports.getMostLikedCommentsHandler = async (req, res) => {
  try {
    const comments = await getMostLikedComments();
    res.status(200).send(comments);
  } catch (error) {
    res.status(500).send('Erro ao buscar comentários mais curtidos');
  }
};
