const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

const PORT = process.env.PORT || 3000;

// Servir arquivos da pasta "public"
app.use(express.static("public"));

// Lista de usuários conectados
let usuarios = {};

io.on("connection", (socket) => {
  let nomeUsuario = "";

  socket.on("entrar", (nome) => {
    nomeUsuario = nome || "Anônimo";
    usuarios[socket.id] = nomeUsuario;
    atualizarUsuarios();

    io.emit("mensagem", {
      username: "Sistema",
      texto: `${nomeUsuario} entrou na sala.`,
      fonte: "Inter",
      cor: "#aaaaaa"
    });
  });

  socket.on("mensagem", (data) => {
    const { username, texto, fonte, cor } = data;

    if (texto && username) {
      io.emit("mensagem", {
        username,
        texto,
        fonte: fonte || "Inter",
        cor: cor || "#ffffff"
      });
    }
  });

  socket.on("disconnect", () => {
    if (usuarios[socket.id]) {
      io.emit("mensagem", {
        username: "Sistema",
        texto: `${usuarios[socket.id]} saiu da sala.`,
        fonte: "Inter",
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
