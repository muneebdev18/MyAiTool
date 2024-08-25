// function toggleMenu() {
//   const menu = document.querySelector('.mobile-menu');

//   menu.classList.add('mobile-menu-visible');
//   // if (menu.style.visibility === 'block') {
//   //   menu.classList.remove('show');
//   //   menu.style.display = 'none';
//   // } else {
//   //   menu.style.display = 'block';
//   //   menu.classList.add('show');
//   // }
// }

// // Close the menu if the user clicks outside of it
// window.onclick = function (event) {
//   if (!event.target.matches('.hamburger-icon')) {
//     var menu = document.querySelector('mobile-menu');
//     if (menu.style.display === 'block') {
//       menu.style.display = 'none';
//     }
//   }
// };

function toggleMenu() {
  const mainHeader = document.querySelector('.main-header');
  const menu = document.querySelector('.main-menu');

  if (!mainHeader || !menu) return;

  const dropdowns = mainHeader.querySelectorAll('.navigation li.dropdown');
  dropdowns.forEach(function (element) {
    const existingBtn = element.querySelector('.dropdown-btn');
    if (existingBtn) {
      existingBtn.remove();
    }

    const div = document.createElement('div');
    div.className = 'dropdown-btn';
    div.innerHTML = '<i class="fa fa-angle-down"></i>';
    element.appendChild(div);
  });

  const nav = menu.querySelector('.navigation');
  if (nav && nav.innerHTML.trim() === '') {
    const menuContent = mainHeader.innerHTML;
    nav.innerHTML = menuContent;
  }

  document.body.classList.toggle('main-menu-visible');

  const closeBtn = menu.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      document.body.classList.remove('main-menu-visible');
    });
  }

  menu.querySelectorAll('li.dropdown .dropdown-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const prevElement = this.previousElementSibling;
      if (prevElement) {
        prevElement.style.display = prevElement.style.display === 'block' ? 'none' : 'block';
      }
      this.classList.toggle('active');
    });
  });

  menu.querySelectorAll('.menu-backdrop, .close-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.body.classList.remove('main-menu-visible');
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  applySavedTheme();
  document.getElementById('toggleIcon').addEventListener('click', toggleTheme);
});

function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  const toggleIcon = document.getElementById('toggleIcon');
  const themeToApply = savedTheme;

  document.body.setAttribute('data-theme', themeToApply);

  if (themeToApply === 'light') {
    toggleIcon.classList.remove('fa-moon');
    toggleIcon.classList.add('fa-sun');
  } else {
    toggleIcon.classList.remove('fa-sun');
    toggleIcon.classList.add('fa-moon');
  }
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  document.body.setAttribute('data-theme', newTheme);

  const toggleIcon = document.getElementById('toggleIcon');
  if (newTheme === 'light') {
    toggleIcon.classList.remove('fa-moon');
    toggleIcon.classList.add('fa-sun');
  } else {
    toggleIcon.classList.remove('fa-sun');
    toggleIcon.classList.add('fa-moon');
  }
}

function openModal(selector_id) {
  console.log(selector_id);
  document.getElementById(selector_id).classList.remove('hidden');
}

function closeModal(selector_id) {
  document.getElementById(selector_id).classList.add('hidden');
}

// ------- Register API ---------

document.getElementById('register-button').addEventListener('click', async (event) => {
  event.preventDefault();
  
  const fullname = document.getElementById('user_login').value;
  const email = document.getElementById('user_email').value;
  const password = document.getElementById('user_pass').value;
  
  const userData = { fullname, email, password };
  
  try {
    const response = await fetch('/api/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    console.log(result); // Log the result to see the exact response

    const messageResponse = document.getElementById('responseMessageRegister');
    
    if (result.success) {
      messageResponse.innerText = result.message;
      messageResponse.style.color = 'green';
      setTimeout(() => {
       window.location.reload();
      }, 2000);
    } else {
      messageResponse.innerText = result.message;
      messageResponse.style.color = '#ff0000';
      setTimeout(() => {
        messageResponse.innerText = '';
      }, 4000);
    }
  } catch (error) {
    const messageResponse = document.getElementById('responseMessageRegister');
    messageResponse.innerText = `Error: ${error.message}`;
    messageResponse.style.color = '#ff0000';
    setTimeout(() => {
      messageResponse.innerText = '';
    }, 4000);
  }
});



// -------- Login API Handling ---------
document.getElementById('login-button').addEventListener('click', async (event) => {
  event.preventDefault();
  // Collect form data
  const email = document.getElementById('login_user_email').value;
  const password = document.getElementById('login_user_pass').value;

  // Prepare the data to be sent
  const userData = { email, password };

  try {
    // Send POST request to the server
    const response = await fetch('/api/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    // Parse the JSON response
    const result = await response.json();
    console.log(result);

    const messageResponse = document.getElementById('responseMessage');
    if (result?.success) {
      localStorage.setItem('token', result?.data?.token);
      messageResponse.innerText = result.message;
      messageResponse.style.color = 'green';
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      messageResponse.innerText = result.message;
      messageResponse.style.color = '#ff0000';
      setTimeout(() => {
        messageResponse.innerText = ''
}, 4000);
    }
  } catch (error) {
    // Handle error
    const messageResponse = document.getElementById('responseMessage');
    messageResponse.innerText = `Error: ${error.message}`;
    messageResponse.style.color = '#ff0000';
    setTimeout(() => {
      messageResponse.innerText = '';
}, 4000);
  }
});
// -------- Logout Handler --------
const logoutHandler = () =>{
  const removeTokenFromLocal = localStorage.removeItem('token')
    window.location.reload()

}

// ------ Controll the Logout Button --------

// const isToken = localStorage.getItem('token')
// const isPresent = !!isToken

// const loginButton = document.getElementById('login-button-btn')
// const registerButton = document.getElementById('register-button-btn')
// const logoutButton = document.getElementById('logout-button-btn')

// if(isPresent){
// loginButton.style.display = 'none'
// registerButton.style.display = 'none'
// logoutButton.style.display = 'block'

// }
// else{
//   logoutButton.style.display = 'none'
// }

// --------User Logged In Profile -------

const token = localStorage.getItem('token')
const tokenAvailable = !!token
// console.log(tokenAvailable);
const userLoggedInHandler = async()=>{
  try {
    const response = await fetch('/api/user/userProfile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      // body: JSON.stringify(userData)
    });

    const result = await response.json();
    // console.log(result); // Log the result to see the exact response

    const messageResponse = document.getElementById('loggedInUser_name');
    
    if (result.success) {
      messageResponse.innerText = result.data?.fullname;
    }
     else {
      messageResponse.innerText = '';
      messageResponse.style.color = '#ff0000';
      // setTimeout(() => {
      //   messageResponse.innerText = '';
      // }, 4000);
    }
  }
   catch (error) {
    const messageResponse = document.getElementById('loggedInUser_name');
    messageResponse.innerText = `Error: ${error.message}`;
    messageResponse.style.color = '#ff0000';
  }
}

if(tokenAvailable){

  userLoggedInHandler()
}


// Example: Extracting the email query parameter in the frontend
const params = new URLSearchParams(window.location.search);
const email = params.get('email');
const googleId = params.get('googleId')
if (email) {
  console.log('User email:', email,googleId);
  // You can now use this email in your frontend logic
}

if(googleId !== null){
 localStorage.setItem('saveGoogleId', googleId)
}



// --------Google Logged In Profile -------

const googleIdInLocal = localStorage.getItem('saveGoogleId')
const googleIdAvailable = !!googleIdInLocal
// console.log(tokenAvailable);
const googleLoginHandler = async()=>{
  try {
    const response = await fetch(`/api/user/googleLogin/${googleId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}`
      },
      // body: JSON.stringify(userData)
    });

    const result = await response.json();
    console.log(result); // Log the result to see the exact response

    const messageResponse = document.getElementById('loggedInUser_name');
    
    if (result.success) {
      messageResponse.innerText = result.data?.fullname;
    }
     else {
      messageResponse.innerText = '';
      messageResponse.style.color = '#ff0000';
      // setTimeout(() => {
      //   messageResponse.innerText = '';
      // }, 4000);
    }
  }
   catch (error) {
    const messageResponse = document.getElementById('loggedInUser_name');
    // messageResponse.innerText = `Error: ${error.message}`;
    messageResponse.style.color = '#ff0000';
  }
}

if(googleIdAvailable){

  googleLoginHandler()
}


const isGoogleId = localStorage.getItem('saveGoogleId')

const isGoogleIdPresent = !!isGoogleId

const loginButtonG = document.getElementById('login-button-btn')
const registerButtonG = document.getElementById('register-button-btn')
const logoutButtonG = document.getElementById('logout-button-btn')

const isgenericToken = localStorage.getItem('token')
const isgenericPresent = !!isgenericToken

if(isGoogleIdPresent || isgenericPresent){
loginButtonG.style.display = 'none'
registerButtonG.style.display = 'none'
logoutButtonG.style.display = 'block'

}
else{
  logoutButtonG.style.display = 'none'
}

logoutButtonG.addEventListener('click', () => {
  // Clear googleId from localStorage and reload the page
  localStorage.removeItem('saveGoogleId');
  window.location.href="/"
});