const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username") || "Anônimo";
const cor = urlParams.get("cor") || "#000000";

const form = document.getElementById("form");
const input = document.getElementById("mensagem");
const chat = document.getElementById("chat");
const btnImagem = document.getElementById("btnImagem");
const inputImagem = document.getElementById("inputImagem");
const btnToggleUsuarios = document.getElementById("btnToggleUsuarios");
const usuariosContainer = document.getElementById("usuariosContainer");
const listaUsuarios = document.getElementById("listaUsuarios");
const btnAudio = document.getElementById("btnAudio");

// Envia nome para o servidor ao conectar
socket.emit("entrar", username);

// Enviar mensagem de texto
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("mensagem", {
      username,
      texto: input.value,
      cor,
const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username") || "Anônimo";
const cor = urlParams.get("cor") || "#000000";

const form = document.getElementById("form");
const input = document.getElementById("mensagem");
const chat = document.getElementById("chat");
const btnImagem = document.getElementById("btnImagem");
const inputImagem = document.getElementById("inputImagem");
const btnToggleUsuarios = document.getElementById("btnToggleUsuarios");
const usuariosContainer = document.getElementById("usuariosContainer");
const listaUsuarios = document.getElementById("listaUsuarios");
const btnAudio = document.getElementById("btnAudio");

// Envia nome para o servidor ao conectar
socket.emit("entrar", username);

// Enviar mensagem de texto
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("mensagem", {
      username,
      texto: input.value,
      cor,
      fonte: "Inter"
    });
    input.value = "";
  }
});

// Receber mensagem do servidor
socket.on("mensagem", (data) => {
  const { username: nome, texto, cor: corTexto, fonte } = data;

  const msg = document.createElement("div");
  msg.className = "mensagem";

  const isMention = texto.includes("@" + username);

  msg.innerHTML = `
    <strong style="color: ${corTexto}; font-family: ${fonte};">${nome}</strong>:
    <span style="color: ${isMention ? '#ffff00' : '#000'}">${texto}</span>
  `;

  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
});

// Enviar imagem
btnImagem.addEventListener("click", () => {
  inputImagem.click();
});

inputImagem.addEventListener("change", () => {
  const file = inputImagem.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("imagem", { username, imagem: reader.result, cor });
    };
    reader.readAsDataURL(file);
  }
});

// Receber imagem
socket.on("imagem", (data) => {
  const div = document.createElement("div");
  div.className = "mensagem imagem-msg";

  const nome = data.username || "Usuário";
  const imgId = "img-" + Date.now();

  div.innerHTML = `
    <strong style="color: ${data.cor || '#000'}">${nome}</strong>:
    <button onclick="document.getElementById('${imgId}').classList.toggle('hidden')">Mostrar/Ocultar Imagem</button>
    <img id="${imgId}" src="${data.imagem}" class="imagem hidden" />
  `;

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

// Atualizar lista de usuários online
socket.on("usuarios", (lista) => {
  listaUsuarios.innerHTML = "";
  lista.forEach((nome) => {
    const li = document.createElement("li");
    li.textContent = nome;
    listaUsuarios.appendChild(li);
  });
});

// Alternar exibição da lista de usuários
btnToggleUsuarios.addEventListener("click", () => {
  usuariosContainer.classList.toggle("active");
});

// Áudio (ainda será implementado)
btnAudio.addEventListener("click", () => {
  alert("Função de áudio ainda em desenvolvimento.");
});￼Enter
