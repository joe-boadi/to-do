/**
 * Event listener for the todo form submission
 * @param {Event} event - The form submission event
 */
document.getElementById('todo-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title_field').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('date_field').value;

    if (!title || !description || !dueDate) {
        alert('All fields are required!');
        return;
    }

    if (document.getElementById('todo-form').dataset.editing) {
        const id = document.getElementById('todo-form').dataset.editing;
        updateTodoItem(id, title, description, dueDate);
    } else {
        addTodoItem(title, description, dueDate);
    }

    document.getElementById('todo-form').reset();
    delete document.getElementById('todo-form').dataset.editing;
});

/**
 * Checks if a date is valid
 * @param {Date} check_date - The date to check
 * @returns {boolean} - True if the date is valid, false otherwise
 */
function isValidDate(check_date) {
    return check_date instanceof Date && !isNaN(check_date);
}
// saves the current state of the todos array to local storage.
let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

/**
 * Adds a todo item to the list
 * @param {string} title - The title of the todo item
 * @param {string} description - The description of the todo item
 * @param {string} dueDate - The due date of the todo item
 */
function addTodoItem(title, description, dueDate) {
    const todo = {
        id: Date.now(),
        title,
        description,
        dueDate: new Date(dueDate),
        completed: false
    };
    todos.push(todo);
    renderTodos();
}

function updateTodoItem(id, title, description, dueDate) {
    const todo = todos.find(todo => todo.id == id);
    if (todo) {
        todo.title = title;
        todo.description = description;
        todo.dueDate = new Date(dueDate);
        renderTodos();
    }
}

/**
 * Renders the list of todo items
 */
function renderTodos() {
    const container = document.getElementById('todo-container');
    container.innerHTML = '';
    todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo-item');
        todoElement.setAttribute('data-id', todo.id);
        todoElement.innerHTML = `
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
            <p id="dueDate">Due: ${todo.dueDate.toLocaleString()}</p>
            <button id="onComplete" onclick="markComplete(${todo.id})">Complete</button>
            <button id="onEdit" onclick="editTodoItem(${todo.id})">Edit</button>
            <button id="onDelete" onclick="deleteTodoItem(${todo.id})">Delete</button>
        `;
        container.appendChild(todoElement);
    });
}

/**
 * Deletes a todo item from the list
 * @param {number} id - The ID of the todo item to delete
 */
function deleteTodoItem(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

/**
 * Marks a todo item as complete or incomplete
 * @param {number} id - The ID of the todo item to mark
 */
function markComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        const todoElement = document.querySelector(`.todo-item[data-id='${id}']`);
        if (todoElement) {
            todoElement.style.textDecoration = 'line-through';
            todoElement.style.color = '#051305';
            setTimeout(() => {
                deleteTodoItem(id);
            }, 1000);
        }
    }
}

function editTodoItem(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        document.getElementById('title_field').value = todo.title;
        document.getElementById('description').value = todo.description;
        document.getElementById('date_field').value = todo.dueDate.toISOString().slice(0, 16);
        document.getElementById('todo-form').dataset.editing = id;
    }
}

/** 
 * Sorts the todo items in ascending order by due date 
 */
document.getElementById('sort-asc').addEventListener('click', function() {
    todos.sort((firstTodo, secondTodo) => new Date(firstTodo.dueDate) - new Date(secondTodo.dueDate));
    renderTodos();
});
/**
 * Sorts the todo items in descending order by due date
 */
document.getElementById('sort-desc').addEventListener('click', function() {
    todos.sort((firstTodo, secondTodo) => new Date(secondTodo.dueDate) - new Date(firstTodo.dueDate));
    renderTodos();
});
