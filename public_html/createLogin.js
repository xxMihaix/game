

const switchbtn = document.querySelectorAll('.gologin button, .gocreate button');
const login = document.querySelector('.create-user-container');
const register = document.querySelector('.login-user-container');

switchbtn.forEach(btn => {
    btn.addEventListener('click', function(){
    register.classList.toggle('active');
    login.classList.toggle('active');
})
})


const form = document.getElementById('register');
const message = document.getElementById('user-exist');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const res = await fetch('/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    });

    const data = await res.json();

    if(res.ok){
        message.style.color = 'green';
        message.textContent = data.message;
        loadUsers();
        form.reset();
        navWelcome();
        welcome();
    }
    else{
        message.style.color = 'red';
        message.textContent = data.message;
    }
})

const formLogin = document.getElementById('login');
const messageLogin = document.getElementById('error-login');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username2').value;
    const password = document.getElementById('password2').value;

    const res = await fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    })

    const data = await res.json();

    if(res.ok){
        messageLogin.style.color = 'red';
        messageLogin.textContent = data.message;
        form.reset();
        navWelcome();
        welcome();
    }
    else{
        messageLogin.style.color = 'red';
        messageLogin.textContent = data.message;
    }
})

async function adminBtn(){
    try{
        const res = await fetch('/role');
        const data = await res.json();

        if(data.succes && data.role === 'admin'){
            const adminBtn = document.querySelector('.admin-btn');
            adminBtn.style.display = 'block';

            adminBtn.addEventListener('click', () => {
                window.location.href = 'admin.html';
            });
        }
    }
    catch(err){
        console.log(err);
    }
}

async function welcome(){
    const res = await fetch('/session');
    const data = await res.json();

    const welcomeText = document.getElementById('welcome');
    const moneyText = document.getElementById('account-balance');

    if(data.succes){
        welcomeText.textContent = `Welcome, ${data.username}`;
        moneyText.textContent = `Money: ${data.money}`;
    }
}

async function navWelcome(){
    const res = await fetch('/session');
    const data = await res.json();

    const navwelcome = document.querySelector('.navbar');
    const welcome = document.querySelector('.welcome-user-container');
    const welcomeText = document.getElementById('welcome');
    const createLogin = document.querySelectorAll('.create-user-container, .login-user-container');
    

    if(data.succes) {
        navwelcome.textContent = `Welcome, ${data.username}`;

        createLogin.forEach(el => {
            el.style.display = 'none';
        })
        welcome.style.display = 'flex';
    }

    adminBtn();
}

function logout(){
    const button = document.querySelector('.logout');

    button.addEventListener('click', async (e) => {
        e.preventDefault();
        try{
            const res = await fetch('/logout', {
                method: 'POST',
            })

             const data = await res.json();

             if(data.succes){
                window.location.href = '/';
             }
        }
        catch(err){
            console.error('Logoutfailed', err);
        }


    })
}

logout();



// la finalul scriptului tău JS:
document.addEventListener('DOMContentLoaded', () => {
    welcome();
    navWelcome();
});

