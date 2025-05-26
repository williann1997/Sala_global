let usuariosOnline = [];

socket.on("usuarios", (usuarios) => {
  usuariosOnline = usuarios;
});

const mentionDropdown = document.createElement("ul");
mentionDropdown.id = "mentionDropdown";
mentionDropdown.style.position = "absolute";
mentionDropdown.style.display = "none";
mentionDropdown.style.background = "#1e1e1e";
mentionDropdown.style.border = "1px solid #333";
mentionDropdown.style.padding = "5px";
mentionDropdown.style.listStyle = "none";
mentionDropdown.style.zIndex = "9999";
mentionDropdown.style.maxHeight = "150px";
mentionDropdown.style.overflowY = "auto";
document.body.appendChild(mentionDropdown);

input.addEventListener("input", (e) => {
  const cursorPos = input.selectionStart;
  const textBeforeCursor = input.value.substring(0, cursorPos);
  const match = textBeforeCursor.match(/@(\w*)$/);

  if (match) {
    const search = match[1].toLowerCase();
    const resultados = usuariosOnline.filter(u => u.toLowerCase().startsWith(search));

    if (resultados.length > 0) {
      mentionDropdown.innerHTML = "";
      resultados.forEach(user => {
        const item = document.createElement("li");
        item.textContent = user;
        item.style.cursor = "pointer";
        item.style.padding = "4px";
        item.addEventListener("mousedown", () => {
          const before = input.value.substring(0, match.index);
          const after = input.value.substring(cursorPos);
          input.value = `${before}@${user} ${after}`;
          mentionDropdown.style.display = "none";
          input.focus();
        });
        mentionDropdown.appendChild(item);
      });

      const rect = input.getBoundingClientRect();
      mentionDropdown.style.top = rect.bottom + "px";
      mentionDropdown.style.left = rect.left + "px";
      mentionDropdown.style.display = "block";
    } else {
      mentionDropdown.style.display = "none";
    }
  } else {
    mentionDropdown.style.display = "none";
  }
});
