const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username");
const corNick = urlParams.get("cor") || "#000000";

const form = document.getElementById("form");
const input = document.getElementById("mensagem");
const chat = document.getElementById("chat");
const btnImagem = document.getElementById("btnImagem");
const inputImagem = document.getElementById("inputImagem");
const btnToggleUsuarios = document.getElementById("btnToggleUsuarios");
const usuariosContainer = document.getElementById("usuariosContainer");
const btnAudio = document.getElementById("btnAudio");

socket.emit("entrar", { nome: username, cor: corNick });

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("mensagem", {
      username,
      texto: input.value,
      cor: corNick
    });
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

socket.on("mensagem", (data) => {
  const div = document.createElement("div");
  div.classList.add("mensagem");

  const nome = document.createElement("strong");
  nome.textContent = `${data.username}: `;
  nome.style.color = data.cor || "#000000";

  const texto = document.createElement("span");
  texto.textContent = data.texto;

  div.appendChild(nome);
  div.appendChild(texto);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

socket.on("imagem", (data) => {
  const div = document.createElement("div");
  div.classList.add("mensagem");

  const nome = document.createElement("strong");
  nome.textContent = `${data.username}: `;
  nome.style.color = data.cor || "#000000";

  const img = document.createElement("img");
  img.src = data.imagem;
  img.style.maxWidth = "200px";
  img.style.cursor = "pointer";

  img.addEventListener("click", () => {
    img.style.display = img.style.display === "none" ? "block" : "none";
  });

  div.appendChild(nome);
  div.appendChild(img);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

socket.on("audio", (data) => {
  const div = document.createElement("div");
  div.classList.add("mensagem");

  const nome = document.createElement("strong");
  nome.textContent = `${data.username}: `;
  nome.style.color = data.cor || "#000000";

  const audio = document.createElement("audio");
  audio.controls = true;
  audio.src = data.audio;

  div.appendChild(nome);
  div.appendChild(audio);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

socket.on("usuarios", (lista) => {
  const container = document.getElementById("usuariosLista");
  container.innerHTML = "";
  lista.forEach((usuario) => {
    const div = document.createElement("div");
    div.textContent = usuario.nome;
    div.style.color = usuario.cor;
    container.appendChild(div);
  });
});

// Áudio
let mediaRecorder;
let audioChunks = [];

btnAudio.addEventListener("click", async () => {
  if (!mediaRecorder || mediaRecorder.state === "inactive") {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.start();
      btnAudio.textContent = "Gravando... (clique p/ parar)";
      audioChunks = [];

      mediaRecorder.addEventListener("dataavailable", (e) => {
        audioChunks.push(e.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => {
          socket.emit("audio", { username, audio: reader.result, cor: corNick });
        };
        reader.readAsDataURL(audioBlob);
        btnAudio.textContent = "Áudio";
      });
    } catch (err) {
      alert("Permissão de microfone negada ou erro ao acessar.");
    }
  } else if (mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
});
