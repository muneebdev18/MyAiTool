function toggleMenu() {
    const menu = document.getElementById("menu");

    if (menu.style.display === "block") {
        menu.classList.remove("show");
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
        menu.classList.add("show");
    }
}

// Close the menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.hamburger-icon')) {
        var menu = document.getElementById("menu");
        if (menu.style.display === "block") {
            menu.style.display = "none";
        }
    }
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  const toggleIcon = document.getElementById('toggleIcon');
  document.body.setAttribute('data-theme', savedTheme || 'dark');
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('toggleIcon').addEventListener('click', toggleTheme);
});
