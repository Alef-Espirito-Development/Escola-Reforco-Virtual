import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography, MenuItem, Paper, FormControlLabel, Checkbox } from '@mui/material';
import LoadingMessage from './LoadingMessage';
import Message from './Message';

const Register = () => {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('Aluno');
  const [materia, setMateria] = useState('');
  const [escola, setEscola] = useState('');
  const [idade, setIdade] = useState('');
  const [turma, setTurma] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const classes = [
    '8ª - A', '8ª - B', '8ª - C', '8ª - D',
    '9ª - A', '9ª - B', '9ª - C', '9ª - D',
    '1ª - A', '1ª - B', '1ª - C', '1ª - D', 
    '2ª - A', '2ª - B', '2ª - C', '2ª - D', 
    '3ª - A', '3ª - B', '3ª - C', '3ª - D'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const userData = {
      nome,
      sobrenome,
      email,
      senha,
      tipo,
      materia: tipo === 'Professor' ? materia : '',
      escola,
      idade: tipo === 'Aluno' ? idade : '',
      turma: tipo === 'Aluno' ? turma : ''
    };

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('Usuário registrado com sucesso', userData);
        setSuccessMessage('Usuário registrado com sucesso.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.error('Erro ao registrar usuário');
        setErrorMessage('Erro ao registrar usuário.');
      }
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      setErrorMessage('Erro ao registrar usuário. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 3, marginTop: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ marginBottom: 2 }}>
            Registrar
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="nome"
              label="Nome"
              name="nome"
              autoComplete="nome"
              autoFocus
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="sobrenome"
              label="Sobrenome"
              name="sobrenome"
              autoComplete="sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type="password"
              id="senha"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>Tipo de Usuário</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={tipo === 'Aluno'}
                  onChange={() => setTipo('Aluno')}
                  name="tipo"
                  color="primary"
                />
              }
              label="Aluno"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={tipo === 'Professor'}
                  onChange={() => setTipo('Professor')}
                  name="tipo"
                  color="primary"
                />
              }
              label="Professor"
            />
            {tipo === 'Professor' && (
              <TextField
                variant="outlined"
                margin="normal"
                fullWidth
                id="materia"
                label="Matéria"
                name="materia"
                value={materia}
                onChange={(e) => setMateria(e.target.value)}
              />
            )}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="escola"
              label="Escola"
              name="escola"
              value={escola}
              onChange={(e) => setEscola(e.target.value)}
            />
            {tipo === 'Aluno' && (
              <>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="idade"
                  label="Idade"
                  name="idade"
                  value={idade}
                  onChange={(e) => setIdade(e.target.value)}
                />
                <TextField
                  select
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="turma"
                  label="Classe"
                  name="turma"
                  value={turma}
                  onChange={(e) => setTurma(e.target.value)}
                >
                  {classes.map((classe) => (
                    <MenuItem key={classe} value={classe}>
                      {classe}
                    </MenuItem>
                  ))}
                </TextField>
              </>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrar
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              onClick={() => navigate('/login')}
            >
              Voltar para Login
            </Button>
          </Box>
          <LoadingMessage loading={loading} message="Registrando usuário..." />
          {successMessage && <Message type="success" text={successMessage} />}
          {errorMessage && <Message type="error" text={errorMessage} />}
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
