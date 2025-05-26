const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const usuarios = new Map();

io.on('connection', socket => {
  console.log('Novo usuário conectado:', socket.id);

  socket.on('entrar', username => {
    usuarios.set(socket.id, username);
    io.emit('usuariosAtualizados', Array.from(usuarios.values()));
    console.log(`Usuário entrou: ${username}`);
  });

  socket.on('mensagem', data => {
    // data: { tipo: 'texto'|'imagem'|'audio', autor, conteudo }
    io.emit('mensagem', data);
  });

  socket.on('disconnect', () => {
    const nome = usuarios.get(socket.id);
    usuarios.delete(socket.id);
    io.emit('usuariosAtualizados', Array.from(usuarios.values()));
    console.log('Usuário saiu:', nome);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
