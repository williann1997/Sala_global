// server.js
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, 'public')));

const usuarios = new Map();

io.on('connection', socket => {
  console.log('Novo usuário conectado');

  let nomeUsuario = '';

  socket.on('entrar', nome => {
    nomeUsuario = nome;
    usuarios.set(socket.id, nome);
    io.emit('usuarios', Array.from(usuarios.values()));
    socket.broadcast.emit('sistema', `${nome} entrou na sala`);
  });

  socket.on('mensagem', data => {
    io.emit('mensagem', data);
  });

  socket.on('disconnect', () => {
    if (nomeUsuario) {
      usuarios.delete(socket.id);
      io.emit('usuarios', Array.from(usuarios.values()));
      socket.broadcast.emit('sistema', `${nomeUsuario} saiu da sala`);
    }
    console.log('Usuário desconectado');
  });
});

// Porta
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
