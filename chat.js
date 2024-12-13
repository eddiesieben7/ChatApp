const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const chatMessages = document.getElementById("chat-messages");

const friend = new URLSearchParams(window.location.search).get("friend");

// Funktion zum Laden von Nachrichten
async function loadMessages() {
    try {
        const response = await fetch(`ajax_load_messages.php?to=${friend}`);
        const messages = await response.json();
        chatMessages.innerHTML = "";
        messages.forEach((msg) => {
            const li = document.createElement("li");
            li.textContent = `${msg.sender}: ${msg.content} (${msg.time})`;
            chatMessages.appendChild(li);
        });
    } catch (err) {
        console.error("Error loading messages:", err);
    }
}

// Funktion zum Senden einer Nachricht
chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message === "") return;

    try {
        await fetch("ajax_send_message.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: friend, message }),
        });
        messageInput.value = "";
        loadMessages();
    } catch (err) {
        console.error("Error sending message:", err);
    }
});

// Nachrichten alle 5 Sekunden aktualisieren
setInterval(loadMessages, 5000);
loadMessages();