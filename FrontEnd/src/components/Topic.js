import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider, IconButton, Paper, Avatar, useTheme } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchTopic, postDiscussion, likeDiscussion } from '../services/forumService';
import { fetchUserById } from '../services/userService';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SendIcon from '@mui/icons-material/Send';

const Topic = () => {
  const { id } = useParams();
  const [topic, setTopic] = useState(null);
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState('');
  const [userNames, setUserNames] = useState({});
  const theme = useTheme();

  useEffect(() => {
    const getTopic = async () => {
      try {
        const topicData = await fetchTopic(id);
        setTopic(topicData.topic);
        setDiscussions(topicData.discussions);

        const userIds = topicData.discussions.map(discussion => discussion.author);

        const userNamesData = await Promise.all(userIds.map(userId => fetchUserById(userId).catch(() => null)));
        const namesMap = {};
        userNamesData.forEach((user, index) => {
          if (user) {
            namesMap[userIds[index]] = `${user.nome} ${user.sobrenome}`;
          }
        });

        setUserNames(namesMap);
      } catch (error) {
        console.error('Erro ao buscar dados do tópico:', error);
      }
    };

    getTopic();
  }, [id]);

  const handlePostDiscussion = async () => {
    try {
      const discussion = await postDiscussion(id, newDiscussion);
      if (discussion) {
        setDiscussions([...discussions, discussion]);
        setNewDiscussion('');
      }
    } catch (error) {
      console.error('Erro ao postar discussão:', error);
    }
  };

  const handleLikeDiscussion = async (discussionId) => {
    try {
      const updatedDiscussion = await likeDiscussion(discussionId);
      if (updatedDiscussion) {
        setDiscussions(discussions.map(discussion => discussion.id === discussionId ? updatedDiscussion : discussion));
      }
    } catch (error) {
      console.error('Erro ao curtir discussão:', error);
    }
  };

  if (!topic) return <Typography>Carregando...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2, boxShadow: 4 }}>
        <Typography variant="h4" gutterBottom>
          {topic.title}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {topic.description}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: topic.status === 'disponível' ? theme.palette.success.main : theme.palette.error.main }}>
          Status: {topic.status}
        </Typography>
      </Paper>
      {topic.status === 'disponível' && (
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Adicionar comentário"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={newDiscussion}
            onChange={(e) => setNewDiscussion(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handlePostDiscussion}
          >
            Postar
          </Button>
        </Box>
      )}
      <List>
        {discussions.map((discussion) => (
          <React.Fragment key={discussion.id}>
            <ListItem alignItems="flex-start" sx={{ bgcolor: 'background.paper', borderRadius: 2, mb: 2, boxShadow: 1 }}>
              <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                {userNames[discussion.author]?.charAt(0)}
              </Avatar>
              <ListItemText
                primary={discussion.content}
                secondary={`Comentado por ${userNames[discussion.author] || discussion.author}`}
                sx={{ mb: 1 }}
              />
              <IconButton onClick={() => handleLikeDiscussion(discussion.id)}>
                <ThumbUpIcon color="primary" /> {discussion.likes.length}
              </IconButton>
            </ListItem>
            <Divider sx={{ my: 1 }} />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Topic;
