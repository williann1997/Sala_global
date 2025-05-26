// server.js
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const usuariosOnline = new Map();

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket => {
  console.log('Novo usuário conectado');

  socket.on('usuario_entrando', nome => {
    usuariosOnline.set(socket.id, nome);
    io.emit('atualizar_usuarios', Array.from(usuariosOnline.values()));
  });

  socket.on('mensagem', data => {
    io.emit('mensagem', data);
  });

  socket.on('disconnect', () => {
    usuariosOnline.delete(socket.id);
    io.emit('atualizar_usuarios', Array.from(usuariosOnline.values()));
    console.log('Usuário desconectado');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
