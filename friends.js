// URL und Token bereitstellen
// const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";
// const currentUser = "Tom"; // Der aktuell eingeloggte Benutzer

// Nutzer aus der Freundesliste extrahieren
const friendList = Array.from(document.querySelectorAll(".friendlist .listitems")).map(el => el.textContent);

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
    xmlhttp.open("GET", "ajax_load_friends.php", true); 
    xmlhttp.send();
}

// Funktion, um datalist mit erlaubten Nutzern zu befüllen
// function populateDatalist(users) {
//         const datalist = document.getElementById("friend-selector");
//         datalist.innerHTML = ""; // Alte Einträge löschen

//          // Freundesliste korrekt extrahieren
//     const friendList = Array.from(document.querySelectorAll(".friendlist .listitems"))
//     .map(el => el.textContent.trim());
// console.log("Freundesliste nach Extraktion:", friendList);

// const allowedUsers = users.filter(user => {
//     const isCurrentUser = user === currentUser;
//     const isInFriendList = friendList.some(friend => friend.toLowerCase() === user.toLowerCase());
//     return !isCurrentUser && !isInFriendList;
// });
// console.log("Gefilterte Nutzer:", allowedUsers);

    

//     // Optionen zur datalist hinzufügen
//     allowedUsers.forEach(user => {
//         const option = document.createElement("option");
//         option.value = user;
//         datalist.appendChild(option);
//     });
// }

// // Funktion, um eine Freundschaftsanfrage zu erstellen
// function sendFriendRequest(username) {
//      //Validierung: Ist der Nutzername in der datalist enthalten?
//     const validUsernames = Array.from(document.querySelectorAll("#friend-selector option")).map(opt => opt.value);
//     if (!validUsernames.includes(username)) {
//         alert("Ungültiger Nutzername oder Nutzer ist bereits Freund!");
//         return;
//     }

//     // Anfrage senden
//     let xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function () {
//         if (xmlhttp.readyState === 4) {
//             if (xmlhttp.status === 204) {
//                 alert("Freundschaftsanfrage erfolgreich gesendet!");
//             } else {
//                 alert("Fehler beim Senden der Anfrage.");
//             }
//         }
//     };
//     xmlhttp.open("GET", "ajax_load_friends.php", true); 
//     xmlhttp.setRequestHeader("Content-type", "application/json");
//     xmlhttp.setRequestHeader("Authorization", `Bearer ${token}`);
//     const payload = JSON.stringify({ username });
//     xmlhttp.send();}

// // Event-Listener für den Add-Button
// document.querySelector(".greybuttonroundaction").addEventListener("click", () => {
//     const input = document.getElementById("friend-request-name");
//     const username = input.value.trim();
//     sendFriendRequest(username);
//     input.value = ""; // Inputfeld zurücksetzen
// });

// // Nutzer laden, sobald die Seite geladen ist
// document.addEventListener("DOMContentLoaded", loadUsers);


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
             const friendListContainer = document.querySelector(".friendlist ul");
            friendListContainer.innerHTML = ""; // Alte Liste löschen

            acceptedFriends.forEach(friend => {
                 const li = document.createElement("li");
                

                 // // Link für den Freund
                 const link = document.createElement("a");
                 link.classList.add( "listitems");
                 link.setAttribute("href", `chat.php?friend=${friend.username}`);
                 link.textContent = friend.username;
                 li.appendChild(link);
                

                // Span für ungelesene Nachrichten
                 if (friend.unread && friend.unread > 0) {
                    const unreadP = document.createElement("p");
                    unreadP.classList.add("pnumber");
                    unreadP.textContent = ` ${friend.unread}`;
                     li.appendChild(unreadP);
                 }

                
                friendListContainer.appendChild(li);
            });

            console.log("Freundesliste aktualisiert:", acceptedFriends);

            
            //Freundschaftsanfragen aktualisieren
            const requestsContainer = document.querySelector("ol");
            requestsContainer.innerHTML = ""; // Alte Anfragen löschen


            requests.forEach(request => {
                const li = document.createElement("li");
                li.classList.add("listitems");

                const textBefore = document.createTextNode("Friend Request from ");

                // Span-Element für den Benutzernamen
                const usernameSpan = document.createElement("span");
                usernameSpan.textContent = request.username;
                usernameSpan.classList.add("bold");

            
                li.appendChild(textBefore);
                li.appendChild(usernameSpan);
        
                // Buttons für "Accept" und "Reject"
                const acceptLink = document.createElement("a");
                acceptLink.href = `friends.php?action=accept&friend=${encodeURIComponent(request.username)}`;
                acceptLink.classList.add("acceptbutton");
                acceptLink.textContent = "Accept";
                
        
                const rejectLink = document.createElement("a");
                rejectLink.href = `friends.php?action=reject&friend=${encodeURIComponent(request.username)}`;
                rejectLink.classList.add("rejectbutton");
                rejectLink.textContent = "Reject";
                
        
                li.appendChild(acceptLink);
                li.appendChild(rejectLink);
                requestsContainer.appendChild(li);
            });
        
            console.log("Freundschaftsanfragen aktualisiert:", requests);
        }
    };
    xmlhttp.open("GET", "ajax_load_friends.php", true); 
    xmlhttp.send();
}

window.setInterval(() => {
   loadFriends();
}, 
1000
);
loadFriends();
