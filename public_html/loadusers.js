

async function loadUsers(){
    const res = await fetch('/users');
    const users = await res.json();

    const container = document.querySelector('.table-container');
    container.innerHTML='';

    let ctr = 0;
    users.forEach(el => {
        ctr++;
        let row = `
        <div class="user-el">
                    <div>${ctr}</div>
                    <div>${el.username}</div>
                    <div>${el.role}</div>
                </div>
        `;

        container.innerHTML += row;
    })
}

loadUsers();
