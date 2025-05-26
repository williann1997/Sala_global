const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(http);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

let usuarios = new Map(); // socket.id => { username, cor }

io.on("connection", (socket) => {
  console.log(`Usuário conectado: ${socket.id}`);

  socket.on("entrar", (data) => {
    const { username, cor } = typeof data === "object" ? data : { username: data, cor: "#007bff" };
    usuarios.set(socket.id, { username, cor });
    atualizarUsuarios();

    socket.broadcast.emit("mensagem", {
      system: true,
      texto: `${username} entrou na sala.`,
    });
  });

  socket.on("mensagem", (data) => {
    const user = usuarios.get(socket.id);
    if (!user) return;
    const { username, cor } = user;
    const texto = data.texto || "";
    if (texto.trim().length === 0) return;

    io.emit("mensagem", {
      username,
      texto,
      cor,
      system: false,
    });
  });

  socket.on("imagem", (data) => {
    const user = usuarios.get(socket.id);
    if (!user) return;
    const { username, cor } = user;
    if (!data.imagem) return;

    io.emit("mensagem", {
      username,
      imagem: data.imagem,
      cor,
      system: false,
    });
  });

  socket.on("disconnect", () => {
    const user = usuarios.get(socket.id);
    if (user) {
      socket.broadcast.emit("mensagem", {
        system: true,
        texto: `${user.username} saiu da sala.`,
      });
      usuarios.delete(socket.id);
      atualizarUsuarios();
    }
    console.log(`Usuário desconectado: ${socket.id}`);
  });

  function atualizarUsuarios() {
    // Envia lista de { username, cor }
    io.emit("usuarios", Array.from(usuarios.values()));
  }
});

http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
