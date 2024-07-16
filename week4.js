document.addEventListener('DOMContentLoaded', loadTasks);

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskClick);

function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const task = createTaskElement(taskText);
        taskList.appendChild(task);
        saveTask(taskText);
        taskInput.value = '';
    }
}

function handleTaskClick(event) {
    const target = event.target;
    const li = target.closest('li');
    if (target.tagName === 'BUTTON') {
        const action = target.dataset.action;
        const taskText = li.firstChild.textContent.trim();
        if (action === 'edit') {
            const newTaskText = prompt('Edit task:', taskText);
            if (newTaskText) {
                li.firstChild.textContent = newTaskText;
                updateTask(taskText, newTaskText);
            }
        } else if (action === 'delete') {
            li.remove();
            deleteTask(taskText);
        }
    } else {
        li.classList.toggle('completed');
        toggleTaskCompletion(taskText);
    }
}

function createTaskElement(text) {
    const li = document.createElement('li');
    li.textContent = text;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.dataset.action = 'edit';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.dataset.action = 'delete';

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    return li;
}

function saveTask(taskText) {
    const tasks = getTasks();
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTask(oldText, newText) {
    const tasks = getTasks();
    const task = tasks.find(task => task.text === oldText);
    if (task) {
        task.text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function deleteTask(taskText) {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleTaskCompletion(taskText) {
    const tasks = getTasks();
    const task = tasks.find(task => task.text === taskText);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}

function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => {
        const taskElement = createTaskElement(task.text);
        if (task.completed) {
            taskElement.classList.add('completed');
        }
        taskList.appendChild(taskElement);
    });
}

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}
