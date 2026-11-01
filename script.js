// Select DOM elements
const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const taskCounter = document.querySelector("#taskCounter");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.querySelector("#clearCompletedBtn");

// Application State
let tasks = loadTasksFromStorage();
let currentFilter = "all"; // 'all', 'active', 'completed'

// 1. Load tasks from localStorage
function loadTasksFromStorage() {
    const storedData = localStorage.getItem("averon_tasks");
    return storedData ? JSON.parse(storedData) : [];
}

// 2. Save tasks to localStorage
function saveTasksToStorage() {
    localStorage.setItem("averon_tasks", JSON.stringify(tasks));
}

// 3. Render tasks dynamically based on current filter
function renderTasks() {
    taskList.innerHTML = "";

    // Filter tasks using array method filter()
    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true; // 'all'
    });

    // Handle empty state display
    if (filteredTasks.length === 0) {
        emptyState.classList.remove("hidden");
    } else {
        emptyState.classList.add("hidden");
    }

    // Build DOM elements for each task
    filteredTasks.forEach(task => {
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;

        // Toggle task completion status on click
        checkbox.addEventListener("change", () => {
            toggleTaskCompletion(task.id);
        });

        const span = document.createElement("span");
        span.className = "task-text";
        span.textContent = task.text;

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "&times;";
        deleteBtn.title = "Delete task";

        // Delete task on click
        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    updateTaskCounter();
}

// 4. Update active remaining tasks counter
function updateTaskCounter() {
    const activeTasksCount = tasks.filter(task => !task.completed).length;
    taskCounter.textContent = activeTasksCount;
}

// 5. Add a new task
function handleAddTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("⚠️ Please enter a task description before adding.");
        return;
    }

    const newTask = {
        id: Date.now(), // Unique numeric identifier
        text: text,
        completed: false
    };

    tasks.push(newTask);
    saveTasksToStorage();
    taskInput.value = "";
    renderTasks();
}

// 6. Toggle task completion status
function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasksToStorage();
    renderTasks();
}

// 7. Delete individual task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasksToStorage();
    renderTasks();
}

// 8. Clear all completed tasks
function clearCompletedTasks() {
    tasks = tasks.filter(task => !task.completed);
    saveTasksToStorage();
    renderTasks();
}

// Event Listeners
addTaskBtn.addEventListener("click", handleAddTask);

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleAddTask();
    }
});

// Filter button event listeners
filterBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
        filterBtns.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
        currentFilter = e.target.getAttribute("data-filter");
        renderTasks();
    });
});

clearCompletedBtn.addEventListener("click", clearCompletedTasks);

// Initial application render on page load
renderTasks();