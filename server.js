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

  socket.on("entrar", (nome) => {
    nomeUsuario = nome || "Anônimo";
    usuarios[socket.id] = { nome: nomeUsuario, cor: corUsuario };
    atualizarUsuarios();

    io.emit("mensagem", {
      username: "Sistema",
      texto: `${nomeUsuario} entrou na sala.`,
      fonte: "Inter",
      cor: "#888888"
    });
  });

  socket.on("mensagem", (data) => {
    const { username, texto, cor, fonte } = data;

    if (texto && username) {
      usuarios[socket.id] = { nome: username, cor: cor || "#000000" };

      io.emit("mensagem", {
        username,
        texto,
        cor: cor || "#000000",
        fonte: fonte || "Inter"
      });
    }
  });

  socket.on("imagem", (data) => {
    const { username, imagem, cor } = data;

    if (imagem && username) {
      io.emit("imagem", {
        username,
        imagem,
        cor: cor || "#000000"
      });
    }
  });

  socket.on("disconnect", () => {
    const usuario = usuarios[socket.id];
    if (usuario) {
      io.emit("mensagem", {
        username: "Sistema",
        texto: `${usuario.nome} saiu da sala.`,
        fonte: "Inter",
        cor: "#888888"
      });
      delete usuarios[socket.id];
      atualizarUsuarios();
    }
  });

  function atualizarUsuarios() {
    const nomes = Object.values(usuarios).map((u) => u.nome);
    io.emit("usuarios", nomes);
  }
});

http.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
