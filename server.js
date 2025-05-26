const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

let usuarios = {};

io.on("connection", socket => {
  let nomeUsuario = "";

  socket.on("entrar", nome => {
    nomeUsuario = nome;
    usuarios[socket.id] = nomeUsuario;
    atualizarUsuarios();
    io.emit("mensagem", {
      username: "Sistema",
      text: `${nomeUsuario} entrou na sala.`
    });
  });

  socket.on("mensagem", data => {
    io.emit("mensagem", {
      username: data.username,
      text: data.text
    });
  });

  socket.on("disconnect", () => {
    if (usuarios[socket.id]) {
      io.emit("mensagem", {
        username: "Sistema",
        text: `${usuarios[socket.id]} saiu da sala.`
      });
      delete usuarios[socket.id];
      atualizarUsuarios();
    }
  });

  function atualizarUsuarios() {
    io.emit("usuarios", Object.values(usuarios));
  }
});

http.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
