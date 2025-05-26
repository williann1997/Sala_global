const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");

const form = document.getElementById("form");
const input = document.getElementById("mensagem");
const chat = document.getElementById("chat");
const btnImagem = document.getElementById("btnImagem");
const inputImagem = document.getElementById("inputImagem");
const btnToggleUsuarios = document.getElementById("btnToggleUsuarios");
const usuariosContainer = document.getElementById("usuariosContainer");
const btnAudio = document.getElementById("btnAudio");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("mensagem", { username, texto: input.value });
    input.value = "";
  }
});

btnImagem.addEventListener("click", () => {
  inputImagem.click();
});

inputImagem.addEventListener("change", () => {
  const file = inputImagem.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit("imagem", { username, imagem: reader.result });
    };
    reader.readAsDataURL(file);
  }
});

btnToggleUsuarios.addEventListener("click", () => {
  usuariosContainer.classList.toggle("active");
});

// Exemplo para áudio (simples log, gravação exige MediaRecorder)
btnAudio.addEventListener("click", () => {
  alert("Gravação de áudio ainda não implementada completamente.");
});
