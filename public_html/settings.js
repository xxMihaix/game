
import { imgProfile } from './profilepic.js';

document.addEventListener('DOMContentLoaded', () => {
    //securityPage();
    navWelcome();
})

async function securityPage(){
    const res = await fetch('/session');
    const data = await res.json();

    if(!data.succes){
        window.location.href = '/';
    }
}

async function navWelcome() {
    const res = await fetch('/session');
     const data = await res.json();

    const navWelcome = document.querySelector('.navbar');

    if (data.succes) {
        navWelcome.textContent = `Hello, ${data.username}`;
    }
    else {
        console.log('Nu s-a putut obține username-ul', data.message);
    }
}

function openClose(){
    const open = document.querySelector('.img-cont');
    const close = document.querySelector('.close');
    const menu = document.querySelector('.pic-container');

    open.addEventListener('click', () => {
        menu.classList.add('active');
    })

    close.addEventListener('click', () => {
        menu.classList.remove('active');
    })
}

openClose();

function goback() {
    const btn = document.querySelector('.goback');

    btn.addEventListener('click', () => {
        window.location.href = '/';
    })
}

goback();


function renderPic(){
    const container = document.querySelector('.pic-cont-in');
    const picImport = imgProfile;

    container.innerHTML = '';

    picImport.forEach((el, index) => {
        const cont = `<div data-id="${index}" class="pic-el">
                         <img src="${picImport[index]}">
                      </div>
        `;

        container.innerHTML += cont;
    })
}

renderPic();


async function primaryPic(){
    const profPic = document.querySelector('.img-cont img');
    const res = await fetch('/session');
    const data = await res.json();

    if(data.succes){
        profPic.src = `${imgProfile[Number(data.profilePic)]}`;
    }
}

primaryPic();

async function currentUser(){
    const text = document.querySelector('.name2');

    const res = await fetch('/session');
    const data = await res.json();

    if(data.succes){
        text.textContent = `Current name: ${data.username}`;
    }
}


async function eventPic(){

    document.querySelectorAll('.pic-el').forEach(pic => {
        pic.addEventListener('click', async () => {

            const picid = pic.dataset.id;
            console.log(picid);

            const resSession = await fetch('/session');
            const dataSession = await resSession.json();

            if(dataSession.userid){
                const userid = dataSession.userid;
                
                const res = await fetch('/setPic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userid, picid })
                })

                const data = await res.json();

                if(data.success){
                    document.querySelector('.pic-container').classList.remove('active');
                    primaryPic();
                }
                else{
                    alert(data.message);
                }
            } 
        })
    })
}

eventPic();


currentUser()

async function changeUsername() {
    const input = document.querySelector('.input-name');
    const submit = document.querySelector('.submit-new-name');
    const display = document.querySelector('.warring');
    const menu = document.querySelector('.confirm-change-user-container');
    const yes = document.querySelector('.yes-user');
    const no = document.querySelector('.no-user');

    submit.addEventListener('click', () => {
        if (!input.value.trim()) return;
        menu.classList.add('active');
    });

    no.addEventListener('click', () => {
        menu.classList.remove('active');
    });

    yes.addEventListener('click', async () => {
        menu.classList.remove('active');

        const newValue = input.value.trim();
        if (!newValue) return;

        const res = await fetch('/userUpdate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newValue })
        });

        const data = await res.json();

        if (!data.success && data.remainingMs) {
            startCooldown(data.remainingMs);
            return;
        }

        if (data.success) {
            navWelcome();
            currentUser();
        } else {
            alert(data.message);
        }
    });

    function formatTime(totalSeconds) {
        const days = Math.floor(totalSeconds / 86400);        // 60 * 60 * 24
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        const parts = [];
        if (days) parts.push(`${days}d`);
        if (hours) parts.push(`${hours}h`);
        if (minutes) parts.push(`${minutes}m`);
        if (seconds || parts.length === 0) parts.push(`${seconds}s`);

        return parts.join(' ');
    }

    function startCooldown(ms) {
    let seconds = Math.ceil(ms / 1000);

    const timeLeft = document.querySelector('.warring');

    const interval = setInterval(() => {
        timeLeft.textContent = `Time left: ${formatTime(seconds)}`;
        seconds--;

        if (seconds < 0) {
            clearInterval(interval);
            timeLeft.textContent = 'Warning: next change can be made in 14 days.';
        }
    }, 1000);
}
}

changeUsername();


async function changePassowrd(){
    const submit = document.querySelector('.submit-new-pass');

    submit.addEventListener('click', async (e) => {
        e.preventDefault();

        const menu = document.querySelector('.confirm-change-password-container');
        const no = document.querySelector('.no-pass');
        const yes = document.querySelector('.yes-pass')

        menu.classList.add('active');

        no.addEventListener('click', () => {
            menu.classList.remove('active');
            return;
        })

        yes.addEventListener('click', async () => {
            menu.classList.remove('active');

            const currentPassword = document.querySelector('.input1').value.trim();
            const newPassword = document.querySelector('.input2').value.trim();
            const confirmNewPassword = document.querySelector('.input3').value.trim();

            const res = await fetch('/newPassword', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword })
            })

            const data = await res.json();

            if (data.success) {
                alert(data.message)
            }
            else {
                alert(data.message);
            }
        })
    })
}

changePassowrd();