// URL und Token
const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";

// Chat Partner aus der URL holen
function getChatPartner() {
    const url = new URL(window.location.href);
    return url.searchParams.get("friend") || "Unknown";
}

// Nachrichten aktualisieren und in die Nachrichtenliste einfügen
function updateMessages(messages) {
    const messageList = document.querySelector('.message-list');
    if (!messageList) {
        console.error("Element '.message-list' nicht gefunden.");
        return;
    }

    // Bestehende Nachrichten extrahieren (wir verwenden eine Kombination aus `from`, `msg`, `time`)
    const existingMessages = Array.from(messageList.children).map(
        (msg) => msg.dataset.messageKey
    );

    let newMessagesAdded = false;



    for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];

        // Kombiniere `from`, `msg`, und `time` zu einem eindeutigen Schlüssel
        const messageKey = `${msg.from}-${msg.msg}-${msg.time}`;

        if (!existingMessages.includes(messageKey)) {
            console.log("Neue Nachricht wird hinzugefügt:", msg);
        
            const li = document.createElement('li');
            li.className = 'chat-item';
            li.dataset.messageKey = messageKey; // Eindeutigen Schlüssel speichern
        
            // Nachrichtenelement erstellen
            const messageContent = document.createElement('div');
            messageContent.className = 'message-content';
        
            const time = document.createElement('span');
            time.className = 'message-time';
            time.textContent = new Date(msg.time).toLocaleString();            
        
            const from = document.createElement('span');
            from.className = 'bold';
            from.textContent = `${msg.from}: `;
        
            const content = document.createElement('span');
            content.textContent = msg.msg;
        
            // Elemente zur Nachricht hinzufügen
            messageContent.appendChild(time);
            messageContent.appendChild(from);
            messageContent.appendChild(content);
        
            // Nachricht zum Listenelement hinzufügen
            li.appendChild(messageContent);
            messageList.appendChild(li);
        
            newMessagesAdded = true;
        
        } else {
            console.log("Nachricht existiert bereits im DOM:", msg);
        }
    }

    if (newMessagesAdded) {
        console.log("Neue Nachrichten hinzugefügt, scrolle zum Ende.");
        messageList.scrollTop = messageList.scrollHeight; // Scrollen
    } else {
        console.log("Keine neuen Nachrichten hinzugefügt.");
    }


}


// Nachrichten laden
function loadMessages2() {
    const chatPartner = new URLSearchParams(window.location.search).get('friend');
    console.log("Fetching messages for:", chatPartner);

    fetch(`ajax_load_messages.php?to=${encodeURIComponent(chatPartner)}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((messages) => {
            console.log("Messages loaded:", messages);

            // Nachrichtenliste leeren (keine Duplikate)
            const messageList = document.querySelector('.message-list');
            if (messageList) {
                messageList.innerHTML = ''; // Leere die Nachrichtenliste vor dem Update
            }

            updateMessages(messages);
        })
        .catch((error) => {
            console.error("Error loading messages:", error);
        });
}



// Nachricht senden
function sendMessage(content) {
    const chatPartner = getChatPartner();
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "ajax_send_message.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            // Erfolgreiches Senden, keine Notwendigkeit für erneutes Laden hier,
            // da es alle 1 Sekunde automatisch aktualisiert wird
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
// Initialer Aufruf beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
    loadMessages2(); // Nachrichten initial laden
    window.setInterval(loadMessages2, 1000); // Nachrichten alle 1 Sekunde aktualisieren
});
