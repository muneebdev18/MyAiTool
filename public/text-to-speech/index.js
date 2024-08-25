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

document.getElementById('tts-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = document.getElementById('text-input').value;
  const loadingElement = document.getElementById('loading');
  const audioElement = document.getElementById('audio-output');

  // Show the loading indicator
  loadingElement.style.display = 'block';
  audioElement.src = ''; // Clear previous audio

  try {
      const response = await fetch('/synthesize', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
      });

      const result = await response.json();

      if (response.ok) {
          audioElement.src = result.audioUrl;
      } else {
          alert(result.error);
      }
  } catch (error) {
      alert('An error occurred. Please try again.');
  } finally {
      // Hide the loading indicator after the request is complete
      loadingElement.style.display = 'none';
  }
});