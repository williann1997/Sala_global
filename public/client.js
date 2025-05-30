const socket = io(); const urlParams = new URLSearchParams(window.location.search); const username = urlParams.get("username") || "Anônimo"; let cor = urlParams.get("cor") || "#000000"; let fonte = urlParams.get("fonte") || "Inter";

const form = document.getElementById("form"); const input = document.getElementById("mensagem"); const chat = document.getElementById("chat"); const btnImagem = document.getElementById("btnImagem"); const inputImagem = document.getElementById("inputImagem"); const btnToggleUsuarios = document.getElementById("btnToggleUsuarios"); const usuariosContainer = document.getElementById("usuariosContainer"); const listaUsuarios = document.getElementById("listaUsuarios"); const btnAudio = document.getElementById("btnAudio"); const corPicker = document.getElementById("corPicker"); const fonteSelect = document.getElementById("fonteSelect");

socket.emit("entrar", username);

form.addEventListener("submit", (e) => { e.preventDefault(); if (input.value.trim()) { socket.emit("mensagem", { username, texto: input.value.slice(0, 300), cor, fonte }); input.value = ""; } });

socket.on("mensagem", (data) => { const { username: nome, texto, cor: corTexto, fonte } = data; const msg = document.createElement("div"); msg.className = "mensagem";

const isSelf = nome === username; const isMention = texto.includes("@" + username);

msg.innerHTML = <strong style="color: ${corTexto}; font-family: ${fonte};">${nome}</strong>: <span style="color: ${isMention ? '#ADD8E6' : isSelf ? '#00ffff' : '#000000'}">${texto}</span>;

if (isSelf) msg.style.background = "#333";

chat.appendChild(msg); chat.scrollTop = chat.scrollHeight; });

btnImagem.addEventListener("click", () => { inputImagem.click(); });

inputImagem.addEventListener("change", () => { const file = inputImagem.files[0]; if (file) { const reader = new FileReader(); reader.onload = () => { socket.emit("imagem", { username, imagem: reader.result, cor }); }; reader.readAsDataURL(file); } });

socket.on("imagem", (data) => { const div = document.createElement("div"); div.className = "mensagem imagem-msg";

const nome = data.username || "Usuário"; const imgId = "img-" + Date.now();

div.innerHTML = <strong style="color: ${data.cor || '#000'}">${nome}</strong>: <button onclick="document.getElementById('${imgId}').classList.toggle('hidden')">Mostrar/Ocultar Imagem</button> <img id="${imgId}" src="${data.imagem}" class="imagem hidden" />;

chat.appendChild(div); chat.scrollTop = chat.scrollHeight; });

socket.on("usuarios", (lista) => { listaUsuarios.innerHTML = ""; lista.forEach((nome) => { const li = document.createElement("li"); li.textContent = nome; listaUsuarios.appendChild(li); }); });

btnToggleUsuarios.addEventListener("click", () => { usuariosContainer.classList.toggle("active"); });

btnAudio.addEventListener("click", () => { alert("Função de áudio ainda em desenvolvimento."); });

if (corPicker) { corPicker.addEventListener("input", (e) => { cor = e.target.value; }); }

if (fonteSelect) { fonteSelect.addEventListener("change", (e) => { fonte = e.target.value; }); }

