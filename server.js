const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let usuarios = {};

io.on("connection", (socket) => {
  let nomeUsuario = "";
  let corUsuario = "#000000";

  socket.on("entrar", (data) => {
    nomeUsuario = data.nome || "Anônimo";
    corUsuario = data.cor || "#000000";
    usuarios[socket.id] = { nome: nomeUsuario, cor: corUsuario };
    atualizarUsuarios();

    io.emit("mensagem", {
      username: "Sistema",
      texto: `${nomeUsuario} entrou na sala.`,
      cor: "#aaaaaa"
    });
  });

  socket.on("mensagem", (data) => {
    const { username, texto, cor } = data;
    if (texto && username) {
      io.emit("mensagem", { username, texto, cor: cor || "#000000" });
    }
  });

  socket.on("imagem", (data) => {
    const { username, imagem } = data;
    if (imagem && username) {
      io.emit("imagem", { username, imagem, cor: corUsuario });
    }
  });

  socket.on("audio", (data) => {
    const { username, audio } = data;
    if (audio && username) {
      io.emit("audio", { username, audio, cor: corUsuario });
    }
  });

  socket.on("disconnect", () => {
    if (usuarios[socket.id]) {
      io.emit("mensagem", {
        username: "Sistema",
        texto: `${usuarios[socket.id].nome} saiu da sala.`,
        cor: "#aaaaaa"
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
