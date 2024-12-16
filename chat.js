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

    // Nachrichtenliste leeren
    messageList.innerHTML = "";

    // Mit klassischer for-Schleife durch die Nachrichten iterieren
    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];

        // Neues Element für die Nachricht erzeugen
        const li = document.createElement('li');
        li.className = "chat-item";

        // Absender
        const from = document.createElement('span');
        from.className = "bold";
        from.textContent = `${msg.from}:`;

        // Zeitstempel
        const time = document.createElement('span');
        time.className = "message-time";
        time.textContent = msg.time;

        // Nachricht
        const content = document.createElement('span');
        content.textContent = msg.msg;

        // Struktur aufbauen
        li.appendChild(time);
        li.appendChild(from);
        li.appendChild(content);

        messageList.appendChild(li);
    }
}

// Nachrichten laden
function loadMessages() {
    const chatPartner = getChatPartner();
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            try {
                const messages = JSON.parse(xmlhttp.responseText);
                updateMessages(messages);
            } catch (e) {
                console.error("Error parsing messages:", e);
            }
        }
    };
    xmlhttp.open("GET", `${backendUrl}/message/${chatPartner}`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
}

// Nachrichten senden
function sendMessage(content) {
    const chatPartner = getChatPartner();
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", `${backendUrl}/message`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            loadMessages(); // Nachrichten neu laden
        }
    };
    xmlhttp.send(JSON.stringify({ message: content, to: chatPartner }));
}

// Initialisierung
if (document.querySelector('.chat-area')) {
    const chatPartner = getChatPartner();
    const chatHeader = document.querySelector('h1.left');
    if (chatHeader) chatHeader.textContent = `Chat with ${chatPartner}`;
    loadMessages(); // Nachrichten beim Laden der Seite abrufen
    setInterval(loadMessages, 1000); // Nachrichten jede Sekunde aktualisieren

    document.querySelector('.greybuttonroundaction').addEventListener('click', function (e) {
        e.preventDefault();
        const input = document.getElementById('message-input');
        if (input && input.value.trim()) {
            sendMessage(input.value.trim());
            input.value = ""; // Eingabefeld leeren
        }
    });
}