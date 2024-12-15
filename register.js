document.querySelector('form').addEventListener('submit', function(event) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    if (username.length < 3) {
        alert('Username must be at least 3 characters long.');
        event.preventDefault();
    } else if (password.length < 8) {
        alert('Password must be at least 8 characters long.');
        event.preventDefault();
    } else if (password !== confirmPassword) {
        alert('Passwords do not match!');
        event.preventDefault();
    }
});