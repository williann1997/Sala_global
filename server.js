const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Servir arquivos da pasta "public"
app.use(express.static("public"));

// Lista de usuários conectados
const usuarios = {};

io.on("connection", (socket) => {
  console.log("Novo usuário conectado:", socket.id);
  let nomeUsuario = "";

  // Evento quando o usuário entra
  socket.on("entrar", (nome) => {
    nomeUsuario = nome?.trim() || "Anônimo";
    usuarios[socket.id] = nomeUsuario;

    // Avisar todos que um novo usuário entrou
    io.emit("mensagem", {
      username: "Sistema",
      texto: `${nomeUsuario} entrou na sala.`,
      fonte: "Inter",
      cor: "#aaaaaa"
    });

    // Atualizar lista de usuários para todos
    atualizarUsuarios();
  });

  // Mensagem de texto
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

  // Envio de imagem
  socket.on("imagem", (data) => {
    const { username, imagem } = data;

    if (imagem && username) {
      io.emit("imagem", { username, imagem });
    }
  });

  // Quando o usuário se desconecta
  socket.on("disconnect", () => {
    const nome = usuarios[socket.id];
    if (nome) {
      // Avisar que saiu
      io.emit("mensagem", {
        username: "Sistema",
        texto: `${nome} saiu da sala.`,
        fonte: "Inter",
        cor: "#aaaaaa"
      });

      delete usuarios[socket.id];
      atualizarUsuarios();
    }
  });

  // Função para atualizar a lista de usuários
  function atualizarUsuarios() {
    io.emit("usuarios", Object.values(usuarios));
  }
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
