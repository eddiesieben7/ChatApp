
//URL und Token
const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";

// Chat Partner aus der URL holen
function getChatPartner() {
    return new URLSearchParams(window.location.search).get('friend') || "Unknown";
}

// Nachrichten laden
function loadMessages() {
    const chatPartner = getChatPartner();
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const messages = JSON.parse(xmlhttp.responseText);
            updateMessages(messages);
        }
    };
    xmlhttp.open("GET", `${backendUrl}/message/${chatPartner}`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
}

// Nachrichten aktualisieren
function updateMessages(messages) {
    const messageList = document.querySelector('.message-list');
    messageList.innerHTML = "";
    messages.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `${msg.from}: ${msg.msg}`;
        messageList.appendChild(li);
    });
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

// Laden der Nachrichten einmal pro Sek. und EventListener der kein sumbit Event ist
if (document.querySelector('.chat-area')) {
    const chatPartner = getChatPartner();
    document.querySelector('h1.left').textContent = `Chat with ${chatPartner}`;
    loadMessages();
    setInterval(loadMessages, 1000);

    document.querySelector('.greybuttonroundaction').addEventListener('click', () => {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        if (message) {
            sendMessage(message);
            input.value = "";
        }
    });
}