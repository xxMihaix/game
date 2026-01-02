
function goback(){
    const btn = document.querySelector('.goback');

    btn.addEventListener('click', () => {
        window.location.href = '/';
    })
}

goback();


function opSearch(){
    const showBtn = document.querySelector('.selected-option');
    const contOp = document.querySelector('.options');
    const selected = document.querySelector('.selected');

    const op1 = document.getElementById('op1');
    const op2 = document.getElementById('op2');
    const op3 = document.getElementById('op3');

    showBtn.addEventListener('click', () => {
        contOp.classList.toggle('active')
    })

    selected.textContent = 'Username';

    op1.addEventListener('click', () => {
        selected.textContent = 'Username';
    })

    op2.addEventListener('click', () => {
        selected.textContent = 'Role';
    })

    op3.addEventListener('click', () => {
        selected.textContent = 'Money';
    })
}

opSearch();


async function navWelcome(){
    res = await fetch('/session');
    data = await res.json();

    const navWelcome = document.querySelector('.navbar');

    if(data.succes){
        navWelcome.textContent = `Welcome, ${data.username}`;
    }
    else{
        console.log(err);
    }
}


async function protectPage(){
    try{
        const sessionRes = await fetch('/session');
        const sessionData = await sessionRes.json();

        if(!sessionData.succes){
            window.location.href = '/';
            return;
        }

        const roleRes = await fetch('/role');
        const roleData = await roleRes.json();

        if(!roleData.succes || roleData.role !== 'admin'){
            window.location.href = '/';
        }
    }
    catch(err){
        window.location.href = '/';
    }
}

async function listUsers(){
    res = await fetch('/usersManagement');
    data = await res.json();

    const listCont = document.querySelector('.list');
    listCont.innerHTML = ``;

    let ctr = 0;
    data.forEach(user => {
    ctr++;

    const el = `
            <div class="list-el">
                <div class="crt">${ctr}</div>
                <div class="username">${user.username}</div>
                <div class="password-container"><div class="password">${user.password}</div><button class="copy">Copy</button></div>
                <div class="money">Loading...</div>
                <div class="role">${user.role}</div>
                <div class="manage"><button class="modify">Modify</button></div>
            </div>`;

    listCont.innerHTML += el;
    })
}

listUsers();

document.addEventListener('DOMContentLoaded', () => {

    const width = window.innerWidth;
    const ctr = document.querySelector('.crtT');
    const user = document.querySelector('.usernameT');
    const pass = document.querySelector('.passwordT');
    const modifyEl = document.querySelectorAll('.modify');

    if (width < 520) {
        ctr.textContent = 'Nr.';
        user.textContent = 'User';
        pass.textContent = 'Pass';

        modifyEl.forEach(el => {
            el.textContent = 'Modify';
        })
        console.log('modify');
    }
})

document.addEventListener('DOMContentLoaded', function(){
    //navWelcome();
    //protectPage();
})

