// URL und Token bereitstellen
// const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";
//const currentUser = "Tom"; // Der aktuell eingeloggte Benutzer

// Nutzer aus der Freundesliste extrahieren und in ein Array von Benutzernamen umwandeln
const friendList = Array.from(document.querySelectorAll(".list .list-group-item")).map(el => el.textContent.trim());

// Funktion, um Nutzer vom Backend zu laden
function loadUsers() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const data = JSON.parse(xmlhttp.responseText);
            console.log("Alle Nutzer vom Backend:", data);
            populateDatalist(data);
        }
    };
    xmlhttp.open("GET", "ajax_load_users.php", true); 
    xmlhttp.send();
}

// Funktion, um datalist mit erlaubten Nutzern zu befüllen
function populateDatalist(users) {
    const datalist = document.getElementById("friend-selector");
    datalist.innerHTML = ""; // Alte Einträge löschen

    // Filtere den aktuellen Benutzer aus
    const allowedUsers = users.filter(user => user !== currentUser && !friendList.includes(user));

    allowedUsers.forEach(user => {
        const option = document.createElement("option");
        option.value = user;
        datalist.appendChild(option);
    });
}

// Funktion, um eine Freundschaftsanfrage zu erstellen
function sendFriendRequest(username) {
     //Validierung: Ist der Nutzername in der datalist enthalten?
    const validUsernames = Array.from(document.querySelectorAll("#friend-selector option")).map(opt => opt.value);
    if (!validUsernames.includes(username)) {
        alert("Ungültiger Nutzername oder Nutzer ist bereits Freund!");
        return;
    }

    // Anfrage senden
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 204) {
                alert("Freundschaftsanfrage erfolgreich gesendet!");
            } 
        }
    };
    xmlhttp.open("POST", "ajax_friend_action.php", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(`action=add&friend=${encodeURIComponent(username)}`);
}

// Event-Listener für den Add-Button
document.querySelector(".btn-primary").addEventListener("click", () => {
    const input = document.getElementById("friend-request-name");
    const username = input.value.trim();
    sendFriendRequest(username);
    input.value = ""; // Inputfeld zurücksetzen
});

// Nutzer laden, sobald die Seite geladen ist
document.addEventListener("DOMContentLoaded", loadUsers);


//ab hier Aufgabe b2
// Funktion, um die Freundesliste zu laden und zu aktualisieren
function loadFriends() {
     let xmlhttp = new XMLHttpRequest();
     xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
             const data = JSON.parse(xmlhttp.responseText);
             console.log("Daten vom Backend (Freundesliste):", data);

             // Daten analysieren
             const acceptedFriends = data.filter(friend => friend.status === "accepted");
             const requests = data.filter(friend => friend.status === "requested");

             // Freundesliste aktualisieren
             const friendListContainer = document.querySelector(".list");
            friendListContainer.innerHTML = ""; // Alte Liste löschen

            acceptedFriends.forEach(friend => {
                 const li = document.createElement("li");
                 li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");


                 // // Link für den Freund
                 const link = document.createElement("a");
                 link.classList.add( "text-dark" ,"text-decoration-none", "fs-6");
                 link.setAttribute("href", `chat.php?friend=${friend.username}`);
                 link.textContent = friend.username;
                 li.appendChild(link);


                // Span für ungelesene Nachrichten
                if (friend.unread && friend.unread > 0) {
                    const badge = document.createElement("span");
                    badge.classList.add("badge", "bg-primary", "rounded-pill", "fs-6");
                    badge.textContent = friend.unread;
                    li.appendChild(badge);
                }


                friendListContainer.appendChild(li);
            });

            console.log("Freundesliste aktualisiert:", acceptedFriends);


            //Freundschaftsanfragen aktualisieren
            const requestsContainer = document.querySelector("ol");
            requestsContainer.innerHTML = ""; // Alte Anfragen löschen


            requests.forEach(request => {
                const li = document.createElement("li");
                li.classList.add("list-group-item");

                const textBefore = document.createTextNode("Friend Request from ");

                // Span-Element für den Benutzernamen
                const usernameSpan = document.createElement("span");
                usernameSpan.textContent = request.username;
                usernameSpan.classList.add("fw-bold" );
                
                


                li.appendChild(textBefore);
                li.appendChild(usernameSpan);

                // Buttons für "Accept" und "Reject"
                // const acceptLink = document.createElement("a");
                // acceptLink.href = `friends.php?action=accept&friend=${encodeURIComponent(request.username)}`;
                // acceptLink.classList.add("btn-secondary");
                // acceptLink.textContent = "Accept";


                // const rejectLink = document.createElement("a");
                // rejectLink.href = `friends.php?action=reject&friend=${encodeURIComponent(request.username)}`;
                // rejectLink.classList.add("btn-primary");
                // rejectLink.textContent = "Reject";


                // li.appendChild(acceptLink);
                // li.appendChild(rejectLink);
                 requestsContainer.appendChild(li);
            });

            console.log("Freundschaftsanfragen aktualisiert:", requests);
        }
    };
    xmlhttp.open("GET", "ajax_load_friends.php", true); 
    xmlhttp.send();
}
document.addEventListener("DOMContentLoaded", () => {
    const requestsContainer = document.querySelector("ol");

    requestsContainer.addEventListener("click", (event) => {
        const target = event.target;

        // Überprüfen, ob der Benutzername geklickt wurde
        if (target.tagName === "SPAN" && target.classList.contains("fw-bold")) {
            const username = target.textContent;

            // Modal-Referenz
            const modalElement = document.getElementById("friendRequestModal");
            const modal = new bootstrap.Modal(modalElement);

            // Modal-Titel setzen
            document.getElementById("friendModalTitle").textContent = `Friend Request from ${username}`;

            // Modal-Inhalt setzen
            document.getElementById("friendModalBody").innerHTML = `<p>Accept or Reject <strong>${username}</strong>?</p>`;

            // Modal-Footer mit Buttons befüllen
            const footer = document.getElementById("friendModalFooter");
            footer.innerHTML = `
                <a href="friends.php?action=accept&friend=${encodeURIComponent(username)}" class="btn btn-secondary">Accept</a>
                <a href="friends.php?action=reject&friend=${encodeURIComponent(username)}" class="btn btn-primary">Reject</a>
            `;

            // Modal anzeigen
            modal.show();
        }
    });
});



window.setInterval(() => {
   loadFriends();
}, 
1000
);