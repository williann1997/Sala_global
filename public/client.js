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

let gravando = false;
let mediaRecorder;
let audioChunks = [];

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

// Áudio: iniciar/parar gravação e enviar
btnAudio.addEventListener("click", async () => {
  if (!gravando) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = () => {
          socket.emit("audio", { username, audio: reader.result });
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      gravando = true;
      btnAudio.textContent = "Parar Áudio";
    } catch (err) {
      alert("Erro ao acessar o microfone.");
      console.error(err);
    }
  } else {
    mediaRecorder.stop();
    gravando = false;
    btnAudio.textContent = "Gravar Áudio";
  }
});

// Receber mensagem de texto
socket.on("mensagem", (data) => {
  const div = document.createElement("div");
  const ehMinhaMsg = data.username === username;
  const mencao = data.texto && data.texto.includes("@" + username);

  div.classList.add("mensagem");
  if (ehMinhaMsg) div.classList.add("minha-msg");
  else if (mencao) div.classList.add("mencao");

  div.innerHTML = `<strong style="color: ${data.cor || "#fff"}">${data.username}</strong>: <span>${data.texto}</span>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

// Receber imagem
socket.on("imagem", (data) => {
  const div = document.createElement("div");
  div.classList.add("mensagem");

  div.innerHTML = `
    <strong style="color: ${data.cor || "#fff"}">${data.username}</strong>: 
    <img src="${data.imagem}" style="max-width: 200px; max-height: 200px; cursor: pointer;" onclick="this.style.display = this.style.display === 'none' ? 'block' : 'none'" />
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

// Receber áudio
socket.on("audio", (data) => {
  const div = document.createElement("div");
  div.classList.add("mensagem");

  div.innerHTML = `
    <strong style="color: ${data.cor || "#fff"}">${data.username}</strong>: 
    <audio controls src="${data.audio}" style="max-width: 100%;"></audio>
  `;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});
