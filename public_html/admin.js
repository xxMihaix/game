
document.addEventListener('DOMContentLoaded', function(){
    navWelcome();
    protectPage();
})

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

document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('search');

    search.addEventListener('input', () => {
        searchList();
    })
})

async function searchList() {
    const res = await fetch('/usersManagement');
    const data = await res.json();

    const selected = document.querySelector('.selected').textContent;
    const searchValue = document.getElementById('search').value.trim().toLowerCase();
    
    const filtered = data.filter(user => {
        if (selected === 'Username') {
            return user.username.toLowerCase().includes(searchValue);
        }
        else if (selected === 'Role') {
            return user.role.toLowerCase().includes(searchValue);
        }
        else if (selected === 'Money') {
            console.log('Comming soon');
        }
    });

    listUsers(filtered, searchValue);
}


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

async function startList(){
    res = await fetch('/usersManagement');
    data = await res.json();

    return listUsers(data);
}

startList();

async function listUsers(data, searchValue){

    const listCont = document.querySelector('.list');
    listCont.innerHTML = ``;

    if(data.length > 0){

    let ctr = 0;
    data.forEach(user => {
    ctr++;

    const el = `
        <div class="list-el">
            <div class="content">
                <div class="crt">${ctr}</div>
                <div class="username">${user.username}</div>
                <div class="password-container">
                    <div class="password">${user.password}</div><button class="copy">Copy</button>
                </div>
                <div class="money">Soon...</div>
                <div class="role">${user.role}</div>
                <div class="manage">
                    <button class="modify">Edit</button>
                </div>
            </div>
            <!-- Submenu -->
            <div class="submenu">
                <div class="soon">Edit Coming Soon..</div>
            </div>
        </div>`;

    listCont.innerHTML += el;
    })

    submenu();
    copy();
    }
    else {
    const el = `<div class="dont-exist">Can't find: ${searchValue}</div>`;
    listCont.innerHTML += el;

    const dontExist = document.querySelector('.dont-exist');

    dontExist.style.display = 'flex';
}
}

function copy(){
    const copybtn = document.querySelectorAll('.copy');
    
    copybtn.forEach(btn => {
        btn.addEventListener('click', () => {
            const contDiv = btn.closest('.password-container');
            const contText = contDiv.querySelector('.password').textContent;
            
            navigator.clipboard.writeText(contText)
        })
    })
}

function submenu(){
    const btn = document.querySelectorAll('.modify');

    btn.forEach(btn => {
        btn.addEventListener('click', () => {
            const listEl = btn.closest('.list-el');
            const current = listEl.querySelector('.submenu');

            document.querySelectorAll('.submenu').forEach(sub => {
                if(sub !== current){
                    sub.classList.remove('active');
                }
            })

            current.classList.toggle('active');
    })
    })
}

submenu();

/*
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
*/