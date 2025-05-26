// script.js const socket = io();

const urlParams = new URLSearchParams(window.location.search); const username = urlParams.get("username") || "Anônimo";

const form = document.getElementById("formulario"); const input = document.getElementById("mensagem"); const chat = document.getElementById("chat"); const userList = document.getElementById("usuarios"); const toggleUsersBtn = document.getElementById("toggleUsers"); const photoInput = document.getElementById("photoInput"); const photoBtn = document.getElementById("photoBtn"); const audioBtn = document.getElementById("audioBtn"); const stopAudioBtn = document.getElementById("stopAudioBtn"); const previewAudio = document.getElementById("previewAudio");

// Adiciona usuário à lista socket.emit("usuario-novo", username);

socket.on("usuarios", usuarios => { userList.innerHTML = ""; usuarios.forEach(nome => { const li = document.createElement("li"); li.textContent = nome; li.addEventListener("click", () => { input.value += @${nome} ; input.focus(); }); userList.appendChild(li); }); });

// Envio de mensagem form.addEventListener("submit", e => { e.preventDefault(); if (input.value.trim()) { socket.emit("mensagem", { usuario: username, texto: input.value, }); input.value = ""; } });

// Recebimento de mensagem socket.on("mensagem", ({ usuario, texto, tipo }) => { const div = document.createElement("div"); div.classList.add("mensagem"); if (texto.includes(@${username})) div.classList.add("mencao");

if (tipo === "imagem") { const imgToggle = document.createElement("button"); imgToggle.textContent = "Ver imagem"; const img = document.createElement("img"); img.src = texto; img.style.display = "none"; imgToggle.addEventListener("click", () => { img.style.display = img.style.display === "none" ? "block" : "none"; imgToggle.textContent = img.style.display === "none" ? "Ver imagem" : "Ocultar imagem"; }); div.innerHTML = <strong>${usuario}:</strong><br />; div.appendChild(imgToggle); div.appendChild(img); } else if (tipo === "audio") { div.innerHTML = <strong>${usuario}:</strong><br />; const audio = document.createElement("audio"); audio.controls = true; audio.src = texto; div.appendChild(audio); } else { div.innerHTML = <strong>${usuario}:</strong> ${texto}; } chat.appendChild(div); chat.scrollTop = chat.scrollHeight; });

// Mostrar lista de usuários mobile if (toggleUsersBtn) { toggleUsersBtn.addEventListener("click", () => { userList.classList.toggle("mostrar"); }); }

// Envio de imagem photoBtn.addEventListener("click", () => photoInput.click());

photoInput.addEventListener("change", () => { const file = photoInput.files[0]; if (file) { const reader = new FileReader(); reader.onload = () => { socket.emit("mensagem", { usuario: username, texto: reader.result, tipo: "imagem", }); }; reader.readAsDataURL(file); } });

