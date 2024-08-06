const { db } = require('../config/firebaseConfig');

const createVideo = async (video) => {
  const videoRef = db.collection('videos').doc();
  video.id = videoRef.id;
  video.likes = []; // Inicializa o array de "likes"
  await videoRef.set(video);
  return video;
};

const getAllVideos = async () => {
  const snapshot = await db.collection('videos').get();
  return snapshot.docs.map(doc => doc.data());
};

const updateVideo = async (videoId, videoData) => {
  const videoRef = db.collection('videos').doc(videoId);
  await videoRef.update(videoData);
  const updatedVideo = await videoRef.get();
  return updatedVideo.data();
};

const deleteVideo = async (videoId) => {
  const videoRef = db.collection('videos').doc(videoId);
  await videoRef.delete();
};

const likeVideo = async (videoId, userId) => {
  const videoRef = db.collection('videos').doc(videoId);
  const videoDoc = await videoRef.get();
  if (!videoDoc.exists) {
    throw new Error('Vídeo não encontrado');
  }

  const videoData = videoDoc.data();
  if (!videoData.likes.includes(userId)) {
    videoData.likes.push(userId);
  }

  await videoRef.update({ likes: videoData.likes });
  return videoData;
};

module.exports = { createVideo, getAllVideos, updateVideo, deleteVideo, likeVideo };
