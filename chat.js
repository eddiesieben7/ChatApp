const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";

// Prüfen, ob friends.html oder chat.html 
if (document.querySelector('.friendlist')) {
    loadFriends();
    loadFriendRequests();
    document.getElementById('add-friend-button').addEventListener('click', addFriend);
} else {
    const chatPartner = getChatPartner();
    document.querySelector('h1.left').textContent = `Chat with ${chatPartner}`;
    loadMessages();
    // Nachrichten jede Sekunde laden
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

// Freunde laden
function loadFriends() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const friends = JSON.parse(xmlhttp.responseText);
            updateFriendList(friends);
        }
    };
    xmlhttp.open("GET", `${backendUrl}/friend`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
}
// Update Freundesliste 
function updateFriendList(friends) {
    const friendList = document.querySelector('.friendlist ul');
    friendList.innerHTML = "";
    friends.forEach(friend => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = `chat.html?friend=${friend.username}`;
        link.className = "listitems";
        link.textContent = friend.username;

        li.appendChild(link);

        if (friend.unread > 0) {
            const span = document.createElement('span');
            span.className = "pnumber";
            span.textContent = friend.unread;
            li.appendChild(span);
        }

        friendList.appendChild(li);
    });
}

// Freundschaftsanfragen laden
function loadFriendRequests() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const requests = JSON.parse(xmlhttp.responseText).filter(req => req.status === "requested");
            updateFriendRequests(requests);
        }
    };
    xmlhttp.open("GET", `${backendUrl}/friend`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
}

// Update Freundschaftsanfragen
function updateFriendRequests(requests) {
    const requestList = document.querySelector('ol');
    requestList.innerHTML = "";
    requests.forEach(req => {
        const li = document.createElement('li');
        li.textContent = `Friend Request from ${req.username}`;

        const accept = document.createElement('button');
        accept.textContent = "Accept";
        accept.className = "acceptbutton";
        accept.addEventListener('click', () => respondToRequest(req.username, true));

        const reject = document.createElement('button');
        reject.textContent = "Reject";
        reject.className = "rejectbutton";
        reject.addEventListener('click', () => respondToRequest(req.username, false));

        li.appendChild(accept);
        li.appendChild(reject);
        requestList.appendChild(li);
    });
}

// Antwort auf Freundschaftsanfrage
function respondToRequest(username, accept) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", `${backendUrl}/friend`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({ username, status: accept ? "accepted" : "rejected" }));
    loadFriendRequests();
}

// Nachricht senden
function sendMessage(content) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", `${backendUrl}/message`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({ message: content, to: getChatPartner() }));
}

// Chat-Partner aus URL extrahieren
function getChatPartner() {
    return new URLSearchParams(window.location.search).get('friend') || "Unknown";
}

// Nachrichten laden
function loadMessages() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const messages = JSON.parse(xmlhttp.responseText);
            updateMessages(messages);
        }
    };
    xmlhttp.open("GET", `${backendUrl}/message/${getChatPartner()}`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
}

// Nachrichten aktualisieren, wenn neue Nachrichten vorhanden sind
function updateMessages(messages) {
    const messageList = document.querySelector('.message-list');
    messageList.innerHTML = "";
    messages.forEach(msg => {
        const li = document.createElement('li');
        li.textContent = `${msg.from}: ${msg.msg}`;
        messageList.appendChild(li);
    });
}

// Freund hinzufügen
function addFriend() {
    const input = document.getElementById('friend-request-name');
    const username = input.value.trim();
    if (!username) return;

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", `${backendUrl}/friend`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({ username }));
    loadFriends();
}