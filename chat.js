// Backend-Konfiguration
const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647"; // Collection ID
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw"; // Token für Tom

// 1. Chatpartner aus der URL ermitteln
function getChatPartner() {
    const url = new URL(window.location.href); // Aktuelle URL analysieren
    return url.searchParams.get('friend') || "Unknown"; // Fallback auf "Unknown"
}

// 2. Chatpartner anzeigen
const chatPartner = getChatPartner();
document.querySelector('h1.left').textContent = `Chat with ${chatPartner}`;

// 3. Nachrichten laden
function loadMessages() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const messages = JSON.parse(xmlhttp.responseText); // Nachrichten parsen
            updateMessages(messages);
        }
    };
    xmlhttp.open("GET", `${backendUrl}/message/${chatPartner}`, true); // Nachrichten-Endpunkt
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
}

// 4. Nachrichten in die Liste einfügen
function updateMessages(messages) {
    const messageList = document.getElementById('message-list');
    messageList.innerHTML = ""; // Alte Nachrichten entfernen
    messages.forEach(msg => {
        const li = document.createElement('li'); // Neues Listenelement erstellen
        li.textContent = `${msg.from}: ${msg.msg}`; // Absender und Nachricht
        messageList.appendChild(li); // Nachricht zur Liste hinzufügen
    });
}

// 5. Nachricht senden
function sendMessage(content) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 204) {
            loadMessages(); // Nach erfolgreichem Senden Nachrichten neu laden
        }
    };
    xmlhttp.open("POST", `${backendUrl}/message`, true); // POST-Endpoint
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send(JSON.stringify({ message: content, to: chatPartner })); // Nachricht senden
}

// 6. Event-Listener für den "Send"-Button
document.querySelector('.greybuttonroundaction').addEventListener('click', () => {
    const input = document.getElementById('message-input');
    const message = input.value.trim(); // Eingabe auslesen und trimmen
    if (!message) return; // Nichts tun, falls Eingabe leer
    sendMessage(message); // Nachricht senden
    input.value = ""; // Eingabefeld zurücksetzen
});

// 7. Nachrichten automatisch alle 1 Sekunde laden
setInterval(loadMessages, 1000); // Nachrichten regelmäßig aktualisieren
loadMessages(); // Direkt beim Laden der Seite aufrufen