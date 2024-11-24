const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";
const currentUser = "Tom"; // aktuell eingeloggter Benutzer

// Freunde laden
function loadFriends() {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const friends = JSON.parse(xmlhttp.responseText)
                .filter(friend => friend.username !== currentUser); // Eingeloggten Nutzer herausfiltern
            updateFriendList(friends);
            updateDatalist();
        }
    };
    xmlhttp.open("GET", `${backendUrl}/friend`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
}

// Freundesliste aktualisieren
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

// Alle Nutzer vom Backend laden und in die Auswahlliste einfügen
function updateDatalist() {
    const datalist = document.getElementById('friend-selector');
    datalist.innerHTML = "";

    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const users = JSON.parse(xmlhttp.responseText)
                .filter(user => user !== currentUser); // "Tom" herausfiltern
            const friends = Array.from(document.querySelectorAll('.friendlist .listitems')).map(el => el.textContent);

            // Filterung für nicht aktueller Benutzer und nicht bereits Freund
            const allowedUsers = users.filter(user => !friends.includes(user));

            allowedUsers.forEach(user => {
                const option = document.createElement('option');
                option.value = user;
                datalist.appendChild(option);
            });
        }
    };
    xmlhttp.open("GET", `${backendUrl}/user`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
}

// Freund hinzufügen
function addFriend() {
    const input = document.getElementById('friend-request-name');
    const username = input.value.trim();

    // Eingabefeld validieren
    if (!username) {
        input.classList.add('error'); // Fehleranzeige
        return;
    }

    // Prüfen, ob der Nutzer sich selbst eingibt
    if (username === currentUser) {
        input.classList.add('error'); // Rote Umrandung bei Fehler
        alert("Du kannst dich nicht selbst hinzufügen!");
        return;
    }

    // Prüfen, ob Nutzer in der Auswahlliste enthalten ist
    const validUsernames = Array.from(document.querySelectorAll('#friend-selector option')).map(opt => opt.value);
    if (!validUsernames.includes(username)) {
        input.classList.add('error'); // Fehleranzeige
        alert("Ungültiger Nutzername/Nutzername bereits vorhanden!");
        return;
    }

    // Hinzufügen eines Freundes
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 204) {
                alert("Freund/in erfolgreich hinzugefügt!");
                input.value = ""; 
                input.classList.remove('error'); 
                loadFriends(); 
            } else {
                alert("Fehlgeschlagener Versuch jemanden hinzuzufügen.");
            }
        }
    };
    xmlhttp.open("POST", `${backendUrl}/friend`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify({ username }));
}

// EventListener 
if (document.querySelector('.friendlist')) {
    loadFriends(); 
    document.getElementById('add-friend-button').addEventListener('click', addFriend);
}

