// server.js
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(__dirname + '/public'));

// WebSocket
io.on('connection', socket => {
  console.log('Novo usuário conectado');

  socket.on('mensagem', data => {
    io.emit('mensagem', data); // transmite para todos
  });

  socket.on('disconnect', () => {
    console.log('Usuário saiu');
  });
});

// Porta local
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
