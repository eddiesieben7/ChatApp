document.addEventListener("DOMContentLoaded", function () {
    const removeFriendLink = document.querySelector('a.special');

    removeFriendLink.addEventListener('click', function (event) {
        const confirmed = confirm("Are you sure you want to remove this friend?");
        if (!confirmed) {
            event.preventDefault();
        }
    });
});