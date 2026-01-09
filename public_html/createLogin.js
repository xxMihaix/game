
document.addEventListener('DOMContentLoaded', async () => {
    const welcome = document.querySelector('.welcome-user-container');
    const register = document.querySelector('.create-user-container');
    const login = document.querySelector('.login-user-container');

    const gologin = document.querySelector('.gologin button');
    const goregister = document.querySelector('.gocreate button');


    const res = await fetch('/session');
    const data = await res.json();

    if(!data.userid){
        welcome.style.display = 'none';
        login.style.display = 'none';
        register.style.display = 'flex';

        gologin.addEventListener('click', () => {
            register.style.display = 'none';
            login.style.display = 'flex';
        })

        goregister.addEventListener('click', () => {
            login.style.display = 'none';
            register.style.display = 'flex';
        })
    }
    else {
        welcome.style.display = 'flex';
        login.style.display = 'none';
        register.style.display = 'none';
    }

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

function gosettings() {
    const btn = document.querySelector('.settings-btn');

    btn.addEventListener('click', () => {
        window.location.href = 'settings.html';
    })
}

gosettings();

async function welcome(){
    const res = await fetch('/session');
    const data = await res.json();

    const res2 = await fetch('/money');
    const data2 = await res2.json();

    const welcomeText = document.getElementById('welcome');
    const moneyText = document.getElementById('account-balance');

    if(data.succes){
        welcomeText.textContent = `Hello, ${data.username}`;
    }

    if(data2.succes){
        moneyText.textContent = `Money: ${data2.money}`;
    }
}

async function navWelcome(){
    const res = await fetch('/session');
    const data = await res.json();

    const navwelcome = document.querySelector('.navbar');
    const welcome = document.querySelector('.welcome-user-container');
    const createLogin = document.querySelectorAll('.create-user-container, .login-user-container');
    

    if(data.succes) {
        navwelcome.textContent = `Hello, ${data.username}`;

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

