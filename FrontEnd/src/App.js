import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Library from './components/Library';
import AddBook from './components/AddBook';
import Sidebar from './components/Sidebar';
import AddVideo from './components/AddVideo';
import LibraryVideos from './components/VideoLibrary';
import Assistente from './components/Assistente';
import Forum from './components/Forum';
import Topic from './components/Topic';
import CreateTopic from './components/CreateTopic';
import Footer from './components/Footer';
import LoadingMessage from './components/LoadingMessage';
import Chat from './components/Chat';
import ChatList from './components/ChatList';
import ChatCreate from './components/ChatCreate';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  React.useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        {isAuthenticated && <Sidebar />}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: isAuthenticated ? { sm: `calc(100% - 240px)` } : '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<PrivateRoute element={<Home />} />} />
              <Route path="/library" element={<PrivateRoute element={<Library />} />} />
              <Route path="/add-book" element={<PrivateRoute element={<AddBook />} />} />
              <Route path="/library-videos" element={<PrivateRoute element={<LibraryVideos />} />} />
              <Route path="/add-videos" element={<PrivateRoute element={<AddVideo />} />} />
              <Route path="/forum" element={<PrivateRoute element={<Forum />} />} />
              <Route path="/topic/:id" element={<PrivateRoute element={<Topic />} />} />
              <Route path="/create-topic" element={<PrivateRoute element={<CreateTopic />} />} />
              <Route path="/chat-list" element={<PrivateRoute element={<ChatList />} />} />
              <Route path="/chat/:chatId" element={<PrivateRoute element={<Chat />} />} />
              <Route path="/create-chat" element={<PrivateRoute element={<ChatCreate />} />} />
              <Route path="/" element={<Navigate to="/home" />} />
            </Routes>
          </Box>
          {isAuthenticated && <Assistente />}
        </Box>
      </Box>
      <LoadingMessage loading={loading} message={message} />
    </Router>
  );
};

export default App;
