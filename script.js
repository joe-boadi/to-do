document.getElementById('todo-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('date').value;
    addTodoItem(title, description, dueDate);
});

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

let todos = [];
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

function renderTodos() {
    const container = document.getElementById('todo-container');
    container.innerHTML = '';
    todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo-item');
        todoElement.innerHTML = `
            <h3>${todo.title}</h3>
            <p>${todo.description}</p>
            <p>Due: ${todo.dueDate.toLocaleString()}</p>
            <button onclick="deleteTodoItem(${todo.id})">Delete</button>
            <button onclick="markComplete(${todo.id})">Complete</button>
        `;
        container.appendChild(todoElement);
    });
}

function deleteTodoItem(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

function markComplete(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

document.getElementById('sort-asc').addEventListener('click', function() {
    todos.sort((a, b) => a.dueDate - b.dueDate);
    renderTodos();
});

document.getElementById('sort-desc').addEventListener('click', function() {
    todos.sort((a, b) => b.dueDate - a.dueDate);
    renderTodos();
});
