document.querySelector('form').addEventListener('submit', function(event) {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm_password').value.trim();

    let errorMessage = "";

    if (username.length < 3) {
        errorMessage = "Username must be at least 3 characters long.";
    } else if (password.length < 8) {
        errorMessage = "Password must be at least 8 characters long.";
    } else if (password !== confirmPassword) {
        errorMessage = "Passwords do not match!";
    }

    if (errorMessage) {
        alert(errorMessage);
        event.preventDefault();
    }
});