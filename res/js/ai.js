const chatWindow = document.getElementById("chat-window");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");

  function appendMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop = chatWindow.scrollHeight; // auto-scroll
  }

  chatForm.addEventListener("submit", e => {
    e.preventDefault();
    const userText = chatInput.value.trim();
    if (!userText) return;

    appendMessage(userText, "user");
    chatInput.value = "";

    // Simulated bot reply (replace with API call later)
    setTimeout(() => {
      appendMessage("This is a bot reply to: " + userText, "bot");
    }, 500);
  });