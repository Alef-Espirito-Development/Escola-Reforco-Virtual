const { createVideo, getAllVideos, likeVideo, deleteVideo } = require('../models/videoModel');
const { bucket } = require('../config/firebaseConfig');
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const createVideoHandler = async (req, res) => {
  try {
    const { title, author, genres, ageRating } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).send('Nenhum arquivo de vídeo enviado');
    }

    const blob = bucket.file(Date.now() + '-' + file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on('error', (err) => {
      console.error('Erro ao fazer upload do arquivo para o Firebase Storage:', err);
      res.status(500).send('Erro ao fazer upload do arquivo');
    });

    blobStream.on('finish', async () => {
      const videoUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      const video = { title, author, genres, ageRating, videoUrl };
      const createdVideo = await createVideo(video);
      res.status(201).send(createdVideo);
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error('Erro ao criar vídeo:', error);
    res.status(500).send('Erro ao criar vídeo');
  }
};

const getAllVideosHandler = async (req, res) => {
  try {
    const videos = await getAllVideos();
    res.status(200).send(videos);
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error);
    res.status(500).send('Erro ao buscar vídeos');
  }
};

const updateVideoHandler = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { title, author, genres, ageRating } = req.body;
    const file = req.file;

    const videoData = { title, author, genres, ageRating };

    if (file) {
      const blob = bucket.file(Date.now() + '-' + file.originalname);
      const blobStream = blob.createWriteStream({
        resumable: false,
      });

      blobStream.on('error', (err) => {
        console.error('Erro ao fazer upload do arquivo para o Firebase Storage:', err);
        res.status(500).send('Erro ao fazer upload do arquivo');
      });

      blobStream.on('finish', async () => {
        const videoUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
        videoData.videoUrl = videoUrl;
        const updatedVideo = await updateVideo(videoId, videoData);
        res.status(200).send(updatedVideo);
      });

      blobStream.end(file.buffer);
    } else {
      const updatedVideo = await updateVideo(videoId, videoData);
      res.status(200).send(updatedVideo);
    }
  } catch (error) {
    console.error('Erro ao atualizar vídeo:', error);
    res.status(500).send('Erro ao atualizar vídeo');
  }
};

const deleteVideoHandler = async (req, res) => {
  try {
    const { videoId } = req.params;
    await deleteVideo(videoId);
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    res.status(500).send('Erro ao deletar vídeo');
  }
};

const likeVideoHandler = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    console.log('Curtindo vídeo ID:', videoId, 'por usuário ID:', userId);
    const updatedVideo = await likeVideo(videoId, userId);
    console.log('Vídeo atualizado com sucesso:', updatedVideo);
    res.status(200).send(updatedVideo);
  } catch (error) {
    console.error('Erro ao dar gostei no vídeo:', error);
    res.status(500).send('Erro ao dar gostei no vídeo');
  }
};

module.exports = { createVideoHandler, getAllVideosHandler, likeVideoHandler, authenticateToken, deleteVideoHandler, updateVideoHandler };
