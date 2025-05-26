// server.js
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const users = {};

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração de armazenamento para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Endpoint para upload de imagem
app.post('/upload', upload.single('imagem'), (req, res) => {
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Endpoint para upload de áudio
app.post('/audio', upload.single('audio'), (req, res) => {
  const audioUrl = `/uploads/${req.file.filename}`;
  res.json({ audioUrl });
});

// WebSocket
io.on('connection', socket => {
  socket.on('entrar', username => {
    users[socket.id] = username;
    io.emit('usuarios', Object.values(users));
  });

  socket.on('mensagem', data => {
    io.emit('mensagem', data);
  });

  socket.on('imagem', data => {
    io.emit('imagem', data);
  });

  socket.on('audio', data => {
    io.emit('audio', data);
  });

  socket.on('disconnect', () => {
    delete users[socket.id];
    io.emit('usuarios', Object.values(users));
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
