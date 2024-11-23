// URL und Token bereitstellen
const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";
const currentUser = "Tom"; // Der aktuell eingeloggte Benutzer

// Nutzer aus der Freundesliste extrahieren
const friendList = Array.from(document.querySelectorAll(".friendlist .listitems")).map(el => el.textContent);

// Funktion, um Nutzer vom Backend zu laden
function loadUsers() {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            const data = JSON.parse(xmlhttp.responseText);
            populateDatalist(data);
        }
    };
    xmlhttp.open("GET", `${backendUrl}/user`, true);
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    xmlhttp.send();
}

// Funktion, um datalist mit erlaubten Nutzern zu befüllen
function populateDatalist(users) {
    const datalist = document.getElementById("friend-selector");

    // Nutzer filtern: nicht aktueller Benutzer und nicht in der Freundesliste
    const allowedUsers = users.filter(user => user !== currentUser && !friendList.includes(user));

    // datalist füllen
    allowedUsers.forEach(user => {
        const option = document.createElement("option");
        option.value = user;
        datalist.appendChild(option);
    });
}

// Funktion, um eine Freundschaftsanfrage zu erstellen
function sendFriendRequest(username) {
    // Validierung: Ist der Nutzername in der datalist enthalten?
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
            } else {
                alert("Fehler beim Senden der Anfrage.");
            }
        }
    };
    xmlhttp.open("POST", `${backendUrl}/friend`, true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
    const payload = JSON.stringify({ username });
    xmlhttp.send(payload);
}

// Event-Listener für den Add-Button
document.querySelector(".greybuttonroundaction").addEventListener("click", () => {
    const input = document.getElementById("friend-request-name");
    const username = input.value.trim();
    sendFriendRequest(username);
    input.value = ""; // Inputfeld zurücksetzen
});

// Nutzer laden, sobald die Seite geladen ist
document.addEventListener("DOMContentLoaded", loadUsers);





