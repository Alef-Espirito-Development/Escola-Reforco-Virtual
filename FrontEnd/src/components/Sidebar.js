// src/Sidebar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, Box, IconButton, Collapse, Avatar, Divider } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MenuIcon from '@mui/icons-material/Menu';
import ForumIcon from '@mui/icons-material/Forum';
import {jwtDecode} from 'jwt-decode';

const drawerWidth = 265;
const drawerCollapsedWidth = 55;
const primaryColor = '#2e7d32';

const Sidebar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          const userResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const data = await userResponse.json();
            setUserData(data);
          } else {
            console.error('Erro ao buscar dados do usuário:', userResponse.statusText);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Drawer
      sx={{
        width: open ? drawerWidth : drawerCollapsedWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : drawerCollapsedWidth,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          background: `linear-gradient(135deg, #2e7d32, #60ad5e)`,
          color: '#fff',
          boxShadow: 10,
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar
        sx={{
          justifyContent: open ? 'space-between' : 'center',
          transition: 'justify-content 0.3s',
          background: `linear-gradient(135deg, #2e7d32, #60ad5e)`,
          color: '#fff',
        }}
      >
        {open && (
          <Typography variant="h6" noWrap>
            E. R. T
          </Typography>
        )}
        <IconButton onClick={toggleDrawer} sx={{ color: '#fff' }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Box sx={{ overflow: 'auto' }}>
        <Collapse in={open}>
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ width: 80, height: 80, mb: 2, bgcolor: '#fff', color: primaryColor }}>
              {userData.nome?.charAt(0)}
            </Avatar>
            <Typography variant="h6">{userData.nome} {userData.sobrenome}</Typography>
            <Typography variant="body2" color="textSecondary">Tipo - {userData.tipo}</Typography>
            <Typography variant="body2" color="textSecondary">{userData.escola}</Typography>
            {userData.tipo === 'Aluno' && (
              <Typography variant="body2" color="textSecondary"> Usuário - {userData.email}</Typography>
            )}
            {userData.tipo === 'Professor' && (
              <Typography variant="body2" color="textSecondary"> Matéria - {userData.materia}</Typography>
            )}
          </Box>
        </Collapse>
        <List>
          <ListItem button onClick={() => navigate('/home')}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <HomeIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Home" />}
          </ListItem>
          <ListItem button onClick={() => navigate('/library')}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <MenuBookIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Biblioteca" />}
          </ListItem>
          <ListItem button onClick={() => navigate('/library-videos')}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <OndemandVideoIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Vídeos" />}
          </ListItem>
          <ListItem button onClick={() => navigate('/forum')}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <ForumIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Fórum" />}
          </ListItem>
          <ListItem button onClick={() => navigate("/chat-list")}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <ChatIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Chats" />}
          </ListItem>
        </List>
        <Divider sx={{ mt: 'auto', backgroundColor: '#fff' }} />
        <List>
          <ListItem button onClick={handleLogout} sx={{ color: '#fff' }}>
            <ListItemIcon sx={{ color: '#fff' }}>
              <ExitToAppIcon />
            </ListItemIcon>
            {open && <ListItemText primary="Logout" />}
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
