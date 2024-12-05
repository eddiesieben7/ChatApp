// URL und Token
const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";

// Chat Partner aus der URL holen
function getChatPartner() {
    const url = new URL(window.location.href);
    const queryParams = url.searchParams;
    console.log(`Chatpartner: ${queryParams.get("friend")}`);
    return queryParams.get("friend") || "Unknown";
}

// Nachrichten aktualisieren
function updateMessages(messages) {
    const messageList = document.querySelector('.message-list');
    messageList.innerHTML = ""; // Liste leeren

    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];

        const li = document.createElement('li');
        li.classList.add('message-item');

        // Zeitstempel formatieren
        const timestamp = new Date(msg.time * 1000);
        const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Zeitstempel-Element
        const timeText = document.createElement('span');
        timeText.textContent = `${formattedTime} `;
        timeText.classList.add('message-time');

        // Nachrichtentext
        const messageContent = document.createTextNode(`${msg.from}: ${msg.msg}`);

        li.appendChild(timeText);
        li.appendChild(messageContent);
        messageList.appendChild(li);
    }
}

// Nachrichten laden
function loadMessages() {
    const chatPartner = getChatPartner();
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        console.log(`Zustand der Anfrage: readyState=${xmlhttp.readyState}, status=${xmlhttp.status}`);
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
                console.log("Nachrichten wurden geladen.");
                console.log("Inhalt der Antwort:", xmlhttp.responseText);
                const messages = JSON.parse(xmlhttp.responseText);
                console.log("Geparste Nachrichten:", messages);
                updateMessages(messages);
            } else {
                console.error(`Fehler beim Laden der Nachrichten: Status ${xmlhttp.status}`);
            }
        }
    };
    xmlhttp.open("GET", `${backendUrl}/message/${chatPartner}`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
    console.log("Anfrage an den Server gesendet.");
}

// Nachrichten senden
function sendMessage(content) {
    const chatPartner = getChatPartner();
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", `${backendUrl}/message`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({ message: content, to: chatPartner }));
    loadMessages();
}

// Laden der Nachrichten einmal pro Sekunde und EventListener
if (document.querySelector('.chat-area')) {
    const chatPartner = getChatPartner();
    document.querySelector('h1.left').textContent = `Chat with ${chatPartner}`;
    loadMessages();
    setInterval(() => {
        loadMessages();
        console.log("Nachrichten werden einmal pro Sek. aktualisiert."); }, 1000);

    document.querySelector('.greybuttonroundaction').addEventListener('click', () => {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        if (message) {
            sendMessage(message);
            console.log(`Nachricht gesendet: "${message}" an ${chatPartner}`);
            input.value = "";
        } else {
            console.warn("Leere Nachricht wurde nicht gesendet.");
        }
    });
}