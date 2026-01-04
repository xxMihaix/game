
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
        <div class="list-el" data-id="${user._id}" id='user-${user._id}'>
            <div class="content">
                <div class="crt">${ctr}</div>
                <div class="username">${user.username}</div>
                <div class="password-container">
                    <div class="password">${user.password}</div><button class="copy">Copy</button>
                </div>
                <div class="money">Soon...</div>
                <div class="role">${user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}</div>
                <div class="manage">
                    <button class="modify">Edit</button>
                </div>
            </div>
            <!-- Submenu -->
            <div class="submenu">
                <div class="sub">
                    <div class="role-pick">
                        <div class="role-by">Role:</div>
                        
                            <p class="selected-role">${user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}</p>
                            <div class="role-options">
                                <div id="opr1" class="opr1 optionr">Admin</div>
                                <div id="opr2" class="opr2 optionr">Player</div>
                            </div>
                        
                        <div class='balance-role'></div>
                    </div>
                <button class="delete-user" data-id="${user._id}">Delete User</button>
            </div>
        </div>`;

    listCont.innerHTML += el;
    })

    submenu();
    copy();
    deleteUser();
    roleManage();
    roleText();
    }
    else {
    const el = `<div class="dont-exist">Can't find: ${searchValue}</div>`;
    listCont.innerHTML += el;

    const dontExist = document.querySelector('.dont-exist');

    dontExist.style.display = 'flex';
}
}

async function deleteUser(){
    const delMenu = document.querySelector('.menu-delete');
    const no = document.querySelector('.no');
    const yes = document.querySelector('.yes');

    const deleteBtns = document.querySelectorAll('.delete-user');
    let currentUserId = null;

    deleteBtns.forEach(button => {
        button.addEventListener('click', () => {
            currentUserId = button.dataset.id;
            delMenu.classList.add('active');
        })
    })

    no.addEventListener('click', () => {
        delMenu.classList.remove('active');
        currentUserId = null;
        return;
    })

    yes.addEventListener('click', async () => {
        delMenu.classList.remove('active');

        if(!currentUserId){
            return;
        }

        const resSession = await fetch('/session');
        const dataSession = await resSession.json();

        const resRole = await fetch('/role');
        const dataRole = await resRole.json();

        if (dataSession.succes && dataRole.role === 'admin') {
            try {
                const res = await fetch(`/users/${currentUserId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (res.ok) {
                    const userEl = document.getElementById(`user-${currentUserId}`);
                    if (userEl) {
                        userEl.remove();
                    }
                }
            }
            catch (err) {
                console.log(err);
                alert('Error deleting user');
            }
        }
        else{
            alert('You are not authorized to delete this user.');
        }
    })
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

async function roleManage(){
    const btn = document.querySelectorAll('.selected-role');

    btn.forEach(btn => {
        btn.addEventListener('click', () =>{
            const src = btn.closest('.role-pick');
            const menu = src.querySelector('.role-options');

            document.querySelectorAll('.role-options').forEach(el => {
                if(el !== menu){
                    el.classList.remove('active');
                }
            })
            menu.classList.toggle('active');
        })
    })
}

function roleText(){
    const admin = document.querySelectorAll('.opr1');
    const player = document.querySelectorAll('.opr2');

    async function updateRole(userId, role){
        
        try{
            const res = await fetch('/update-role', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, role })
        })

        const data = await res.json(); 

        if(!data.succes){
            alert('Error at updating role');
        }
        }
        catch(err){
            console.log(err);
        }
    }

    admin.forEach(admin => {
        admin.addEventListener('click', async () => {

            const sure = document.querySelector('.menu-role');
            sure.classList.add('active');

            const no = document.querySelector('.no1');
            const yes = document.querySelector('.yes1');

            no.addEventListener('click', () => {
                sure.classList.remove('active');
                return;
            })

            yes.addEventListener('click', async () => {
                sure.classList.remove('active');

                const sessionRes = await fetch('/session');
                const sessionData = await sessionRes.json();

                const roleRes = await fetch('/role');
                const roleData = await roleRes.json();

                if (sessionData.succes && roleData.role === 'admin') {

                    const container = admin.closest('.role-pick');
                    const display = container.querySelector('.selected-role');
                    display.textContent = 'Admin';

                    const menu = admin.closest('.role-options');
                    menu.classList.remove('active');

                    const userId = admin.closest('.list-el').dataset.id;
                    updateRole(userId, 'admin');

                    const res = await fetch('/usersManagement');
                    const data = await res.json();

                    listUsers(data);
                }
                else{
                    alert('You are not authorized to modify this role.')
                }
            })
        })
    })

    player.forEach(player => {
        player.addEventListener('click', async () => {

            const sure = document.querySelector('.menu-role');
            sure.classList.add('active');

            const no = document.querySelector('.no1');
            const yes = document.querySelector('.yes1');

            no.addEventListener('click', () => {
                sure.classList.remove('active');
                return;
            })

            yes.addEventListener('click', async () => {
                sure.classList.remove('active');

                const sessionRes = await fetch('/session');
                const sessionData = await sessionRes.json();

                const roleRes = await fetch('/role');
                const roleData = await roleRes.json();

                if (sessionData.succes && roleData.role === 'admin') {

                    const container = player.closest('.role-pick');
                    const display = container.querySelector('.selected-role');
                    display.textContent = 'Player';

                    const menu = player.closest('.role-options');
                    menu.classList.remove('active');

                    const userId = player.closest('.list-el').dataset.id;
                    updateRole(userId, 'player');

                    const res = await fetch('/usersManagement');
                    const data = await res.json();

                    listUsers(data);
                }
                else {
                    alert('You are not authorized to modify this role.')
                }
            })
        })
    })
}

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