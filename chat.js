// URL und Token
const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";

// Chat Partner aus der URL holen
function getChatPartner() {
    const url = new URL(window.location.href);
    return url.searchParams.get("friend") || "Unknown";
}

// Nachrichten aktualisieren
function updateMessages(messages) {
    const messageList = document.querySelector('.message-list');
    if (!messageList) return;
    messageList.innerHTML = "";
    messages.forEach(msg => {
        const li = document.createElement('li');
        li.className = "chat-item";
        li.innerHTML = `
            <div class="message-content">
                <span class="message-time">${msg.time}</span>
                <span class="bold">${msg.from}:</span>
                ${msg.msg}
            </div>
        `;
        messageList.appendChild(li);
    });
}

// Nachrichten laden
async function loadMessages() {
    const chatPartner = getChatPartner();
    try {
        const response = await fetch(`${backendUrl}/message/${chatPartner}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.ok) {
            const messages = await response.json();
            updateMessages(messages);
        } else {
            console.error("Failed to load messages:", response.statusText);
        }
    } catch (err) {
        console.error("Error loading messages:", err);
    }
}

// Nachrichten senden
async function sendMessage(content) {
    const chatPartner = getChatPartner();
    try {
        const response = await fetch(`${backendUrl}/message`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: content, to: chatPartner })
        });
        if (response.ok) {
            loadMessages();
        } else {
            console.error("Failed to send message:", response.statusText);
        }
    } catch (err) {
        console.error("Error sending message:", err);
    }
}

// Initialisierung
if (document.querySelector('.chat-area')) {
    const chatPartner = getChatPartner();
    const chatHeader = document.querySelector('h1.left');
    if (chatHeader) chatHeader.textContent = `Chat with ${chatPartner}`;
    loadMessages();
    setInterval(loadMessages, 1000);

    document.querySelector('.greybuttonroundaction').addEventListener('click', (e) => {
        e.preventDefault();
        const input = document.getElementById('message-input');
        if (input && input.value.trim()) {
            sendMessage(input.value.trim());
            input.value = "";
        }
    });
}