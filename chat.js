
const backendUrl = "https://online-lectures-cs.thi.de/chat/ba1ad2f8-7e88-4ce4-92c2-6399ab16f647";
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiVG9tIiwiaWF0IjoxNzMyMzkwOTQwfQ.DQA6mSt-oo4qPZ0N09zS2W6Cd_2g4BJpn4qL_zr24dw";

function getChatPartner() {
    const url = new URL(window.location.href);
    return url.searchParams.get("friend") || "Unknown";
}

function updateMessages(messages) {
    const messageList = document.querySelector('#message-list');
    if (!messageList) {
        console.error("Element '#message-list' not found.");
        return;
    }

    messageList.innerHTML = '';

    messages.forEach((msg) => {
      
        const messageKey = `${msg.from}-${msg.msg}-${msg.time}`;

        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-start'; 
        li.dataset.messageKey = messageKey; 

        const messageContent = document.createElement('div');
        messageContent.innerHTML = `<span class="fw-bold">${msg.from}:</span> ${msg.msg}`;

        const timeElement = document.createElement('span');
        timeElement.className = 'text-muted'; 
        const messageDate = new Date(msg.time);
        timeElement.textContent = `${messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | ${messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' })}`;

        li.appendChild(messageContent);
        li.appendChild(timeElement);

        messageList.appendChild(li);
    });

    console.log("Messages updated.");
}

function loadMessages2() {
    const chatPartner = getChatPartner();
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

            updateMessages(messages);
        })
        .catch((error) => {
            console.error("Error loading messages:", error);
        });
}

function sendMessage(content) {
    const chatPartner = getChatPartner();
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "ajax_send_message.php", true);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        }
        loadMessages2();
    };
    xmlhttp.send(JSON.stringify({ to: chatPartner, message: content }));
}

document.addEventListener("DOMContentLoaded", () => {

    loadMessages2();

    window.setInterval(loadMessages2, 1000);

    const input = document.querySelector('input[name="message"]');
    const form = document.querySelector('form');
    if (form && input) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const messageContent = input.value.trim();
            if (messageContent) {
                sendMessage(messageContent);
                input.value = ""; 
            }
        });
    }
});
