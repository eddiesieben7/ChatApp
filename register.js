const backendURL = "ajax_check_user.php";

// Funktion zur Prüfung, ob der Benutzername existiert
function userExists(name) {
    return new Promise((resolve, reject) => {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4) {
                if (xmlhttp.status == 204) {
                    resolve(true); // Benutzername existiert
                } else if (xmlhttp.status == 404) {
                    resolve(false); // Benutzername verfügbar
                } else {
                    reject(new Error('Request failed with status ' + xmlhttp.status));
                }
            }
        };
        let url = `${backendURL}?user=${encodeURIComponent(name)}`;
        xmlhttp.open("GET", url, true);
        xmlhttp.send();
    });
}

// Event-Listener für die Formularvalidierung
window.onload = function () {
    const usernameInput = document.querySelector('input[name="username"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const confirmInput = document.querySelector('input[name="confirm_password"]');
    
    usernameInput.addEventListener('input', function () {
        if (usernameInput.value.length < 3) {
            usernameInput.classList.add('input-invalid');
        } else {
            usernameInput.classList.remove('input-invalid');
        }
    });

    passwordInput.addEventListener('input', function () {
        if (passwordInput.value.length < 8) {
            passwordInput.classList.add('input-invalid');
        } else {
            passwordInput.classList.remove('input-invalid');
        }
    });

    confirmInput.addEventListener('input', function () {
        if (passwordInput.value !== confirmInput.value) {
            confirmInput.classList.add('input-invalid');
        } else {
            confirmInput.classList.remove('input-invalid');
        }
    });

    document.getElementById('register-button').addEventListener('click', async function (event) {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmInput.value.trim();

        let valid = true;

        // Lokale Validierungen
        if (username.length < 3) {
            alert('Username must be at least 3 characters long.');
            valid = false;
        }
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            valid = false;
        }
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            valid = false;
        }

        // Überprüfung, ob der Benutzername existiert
        if (valid) {
            try {
                const userExistsResult = await userExists(username);
                if (userExistsResult) {
                    alert('Username already exists.');
                    valid = false;
                }
            } catch (error) {
                console.error('Error checking username:', error);
                alert('Error checking username. Please try again.');
                valid = false;
            }
        }

        // Registrierung abschicken, wenn alles gültig ist
        if (valid) {
            document.getElementById('register-form').submit();
        } else {
            alert('Registration failed.');
        }
    });
};