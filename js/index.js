document.addEventListener('DOMContentLoaded', () => {
    const btnAdd = document.querySelector('#add-btn');
    const input = document.querySelector('#input-task');
    const col__tasks_todo = document.querySelector('.col__tasks_todo');
    const col__tasks_progress = document.querySelector('.col__tasks_progress');
    const col__tasks_done = document.querySelector('.col__tasks_done');

    const getRandomKey = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

    let array_todo = [];
    let array_inprogress = [];
    let array_done = [];

    const saveToLocalStorage = () => {
        const string_todo = JSON.stringify(array_todo);
        localStorage.setItem('todo', string_todo);
        const string_inprogress = JSON.stringify(array_inprogress);
        localStorage.setItem('progress', string_inprogress);
        const string_done = JSON.stringify(array_done);
        localStorage.setItem('done', string_done);
    };

    const restoreFromLocalStorage = () => {
        col__tasks_todo.innerHTML = (JSON.parse(localStorage.getItem('todo')) || []).map(item => {
            return `<div class="card" id="${item.id}">
                        <div class="card_content">
                            <div class="top">
                                <p>${item.inputValue}</p>
                                <p class="btn-remove">X</p>
                            </div>
                            <button class="btnAction">In Progress</button>
                        </div>
                    </div>`;
        }).join('');

        col__tasks_progress.innerHTML = (JSON.parse(localStorage.getItem('progress')) || []).map(item => {
            return `<div class="card" id="${item.id}">
                        <div class="card_content">
                            <div class="top">
                                <p>${item.inputValue}</p>
                                <p class="btn-remove">X</p>
                            </div>
                            <button class="btnAction">In Progress</button>
                        </div>
                    </div>`;
        }).join('');

        col__tasks_done.innerHTML = localStorage.getItem('done') || '';
        addEventListeners(); 
    };

    
    const addEventListeners = () => {
        col__tasks_todo.querySelectorAll('.btnAction').forEach(btnAction => {
            btnAction.addEventListener('click', moveInProgress);
        });

        col__tasks_progress.querySelectorAll('.btnAction').forEach(btnAction => {
            btnAction.addEventListener('click', moveDone);
        });

        col__tasks_todo.querySelectorAll('.btn-remove').forEach(btnRemove => {
            btnRemove.addEventListener('click', removeCard);
        });

        col__tasks_progress.querySelectorAll('.btn-remove').forEach(btnRemove => {
            btnRemove.addEventListener('click', removeCard);
        });

        col__tasks_done.querySelectorAll('.btn-remove').forEach(btnRemove => {
            btnRemove.addEventListener('click', removeCard);
        });
    };

    const moveInProgress = function() {
        const card = this.closest('.card');
        const cardId = card.id;
        const cardIndex = array_todo.findIndex(item => item.id === cardId);
        
        if (cardIndex !== -1) {
            const movedCard = array_todo.splice(cardIndex, 1)[0];
            array_inprogress.push(movedCard); 
            saveToLocalStorage(); 
        }
    
        col__tasks_progress.append(card);
        this.textContent = 'Done';
        this.removeEventListener('click', moveInProgress);
        this.addEventListener('click', moveDone);
    };
    

    const moveDone = function() {
        const card = this.closest('.card');
        const cardId = card.id; 
        const cardIndex = array_inprogress.findIndex(item => item.id === cardId); 
        
        if (cardIndex !== -1) { 
            const movedCard = array_inprogress.splice(cardIndex, 1)[0]; 
            saveToLocalStorage(); 
        }
    
        col__tasks_done.append(card);
        this.textContent = 'Remove';
        this.removeEventListener('click', moveDone);
        this.addEventListener('click', removeCard);
    };
    
    const removeCard = function() {
        const card = this.closest('.card');
        const cardId = card.id; 
        console.log("Removing card with id:", cardId);
        card.remove();
    
        array_todo = array_todo.filter(item => item.id !== cardId);
        array_inprogress = array_inprogress.filter(item => item.id !== cardId);
        array_done = array_done.filter(item => item.id !== cardId);
    
        saveToLocalStorage();
    };
    
    

    restoreFromLocalStorage();

    btnAdd.addEventListener('click', () => {
        const card = document.createElement('div');
        const id = getRandomKey(); 
        console.log("Generated id:", id); 
        card.className = 'card';
        card.id = id; 
        card.innerHTML = `
            <div class="card_content">
                <div class="top">
                    <p>${input.value}</p>
                    <p class="btn-remove">X</p>
                </div>
                <button class="btnAction">In Progress</button>
            </div>
        `;
        col__tasks_todo.append(card);

        const inputValue = input.value;

        const message = {
            id, 
            inputValue
        };
        array_todo.push(message);
        saveToLocalStorage();
        addEventListeners();
    });
});






