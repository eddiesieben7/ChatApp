// URL und Token
// const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";

// Chat Partner aus der URL holen
function getChatPartner() {
    const url = new URL(window.location.href);
    return url.searchParams.get("friend") || "Unknown";
}

// Nachrichten aktualisieren und in die Nachrichtenliste einfügen
function updateMessages(messages) {
    const messageList = document.querySelector('.message-list');
    if (!messageList) return;

    // Debug-Ausgabe für empfangene Nachrichten
    console.log("Received messages for update:", messages);

    // Nachrichtenliste leeren und neu rendern
    messageList.innerHTML = '';

    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i]; // Nachricht holen
        console.log("Adding message to DOM:", msg); // Debug-Ausgabe

        const li = document.createElement('li');
        li.className = 'chat-item';
        li.dataset.messageId = msg.id;

        const time = document.createElement('span');
        time.className = 'message-time';
        time.textContent = new Date(msg.time).toLocaleString();

        const from = document.createElement('span');
        from.className = 'bold';
        from.textContent = `${msg.from}: `;

        const content = document.createElement('span');
        content.textContent = msg.msg;

        li.appendChild(time);
        li.appendChild(from);
        li.appendChild(content);
        messageList.appendChild(li);
    }

    // Nach unten scrollen
    messageList.scrollTop = messageList.scrollHeight;
    console.log("Message list DOM after update:", messageList.innerHTML); // Debug-Ausgabe
}

// Nachrichten laden
function loadMessages() {
    const chatPartner = new URLSearchParams(window.location.search).get('friend');
    const timestamp = new Date().getTime(); // Cache-Verhinderung

    console.log("Fetching messages for:", chatPartner); // Debug-Ausgabe

    fetch(`ajax_load_messages.php?to=${encodeURIComponent(chatPartner)}&t=${timestamp}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((messages) => {
            console.log("Loaded messages from backend:", messages); // Debug-Ausgabe
            updateMessages(messages);
        })
        .catch((error) => {
            console.error("Error loading messages:", error); // Fehlerausgabe
        });
}

// Initialer Aufruf beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
    loadMessages(); // Nachrichten initial laden
    window.setInterval(loadMessages, 1000); // Nachrichten alle 1 Sekunde aktualisieren
});

// Nachricht senden
function sendMessage(content) {
    const chatPartner = getChatPartner();
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "ajax_send_message.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            console.log("Message sent successfully."); // Debug-Ausgabe
        }
    };
    xmlhttp.send(JSON.stringify({ to: chatPartner, message: content }));
}

// Initialisierung für die Chat-Oberfläche
if (document.querySelector('.chat-area')) {
    const chatPartner = getChatPartner();
    const chatHeader = document.querySelector('h1.left');
    if (chatHeader) chatHeader.textContent = `Chat with ${chatPartner}`;
    document.querySelector('.greybuttonroundaction').addEventListener('click', function (e) {
        e.preventDefault();
        const input = document.getElementById('message-input');
        if (input && input.value.trim()) {
            sendMessage(input.value.trim());
            input.value = ""; // Eingabefeld leeren
        }
    });
}