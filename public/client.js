const socket = io();
const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get("username") || "Anônimo";

const form = document.getElementById("form");
const input = document.getElementById("mensagem");
const chat = document.getElementById("chat");
const fontSelect = document.getElementById("fontSelect");
const colorSelect = document.getElementById("colorSelect");
const btnImagem = document.getElementById("btnImagem");
const inputImagem = document.getElementById("inputImagem");
const btnToggleUsuarios = document.getElementById("btnToggleUsuarios");
const usuariosContainer = document.getElementById("usuariosContainer");
const btnAudio = document.getElementById("btnAudio");

// Set initial font and color from localStorage
fontSelect.value = localStorage.getItem("userFont") || "Inter";
colorSelect.value = localStorage.getItem("userColor") || "#ffffff";

// Save font/color changes
fontSelect.addEventListener("change", () => {
  localStorage.setItem("userFont", fontSelect.value);
});
colorSelect.addEventListener("change", () => {
  localStorage.setItem("userColor", colorSelect.value);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const texto = input.value.trim();
  if (texto) {
    const fonte = fontSelect.value;
    const cor = colorSelect.value;
    socket.emit("mensagem", { username, texto, fonte, cor });
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

btnAudio.addEventListener("click", () => {
  alert("Função de áudio ainda será implementada.");
});

// Função para criar mensagem com destaque para o usuário e menções
function criarMensagem({ username: autor, texto, fonte, cor }) {
  const div = document.createElement("div");
  // Checa se é mensagem do próprio usuário
  const ehProprioUsuario = autor === username;
  // Checa se texto contém menção (ex: @username)
  const regexMentions = new RegExp(`@${username}`, "i");
  const temMenção = regexMentions.test(texto);

  // Aplica estilos
  div.style.fontFamily = fonte || "Inter";
  div.style.color = cor || "#ffffff";
  div.style.padding = "5px";
  div.style.borderRadius = "5px";
  div.style.wordBreak = "break-word";

  if (ehProprioUsuario) {
    div.style.backgroundColor = "#cce4ff"; // azul claro para próprio usuário
  } else if (temMenção) {
    div.style.backgroundColor = "#e6f0ff"; // azul mais claro para menções
  }

  div.innerHTML = `<strong>${autor}:</strong> ${texto.replace(regexMentions, `<mark>@${username}</mark>`)}`;
  return div;
}

socket.on("mensagem", (data) => {
  const div = criarMensagem(data);
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

socket.on("imagem", ({ username: autor, imagem }) => {
  const div = document.createElement("div");
  const ehProprioUsuario = autor === username;
  div.style.padding = "5px";
  div.style.borderRadius = "5px";
  if (ehProprioUsuario) {
    div.style.backgroundColor = "#cce4ff";
  }
  div.innerHTML = `<strong>${autor}:</strong><br><div class="image-container"><img src="${imagem}" alt="imagem enviada" /></div>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

socket.on("usuarios", (lista) => {
  usuariosContainer.innerHTML = "<strong>Usuários online:</strong><br>" + lista.map(u => `- ${u}`).join("<br>");
});
