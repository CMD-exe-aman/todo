// Get references to the DOM elements
const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const filterSelect = document.getElementById("filterSelect");
const clearButton = document.getElementById("clearButton");
const prioritySelect = document.getElementById("prioritySelect");

// Load tasks from localStorage on page load
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => {
        createTaskElement(task.text, task.completed, task.priority);
    });
}
//a
// Save tasks to localStorage
function saveTasks() {
    const tasks = [];
    const taskItems = taskList.querySelectorAll("li");
    taskItems.forEach(item => {
        const text = item.querySelector("span").textContent;
        const completed = item.classList.contains("completed");
        const priority = item.getAttribute("data-priority");
        tasks.push({ text, completed, priority });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Create a new task element
function createTaskElement(taskText, isCompleted = false, priority = 'Low') {
    const li = document.createElement("li");
    if (isCompleted) {
        li.classList.add("completed");
    }

    li.setAttribute("data-priority", priority);
    li.classList.add(priority.toLowerCase());

    // Add task text to the list item
    const span = document.createElement("span");
    span.textContent = taskText;
    li.appendChild(span);

    // Add "complete" button
    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.onclick = function () {
        li.classList.toggle("completed");
        saveTasks();
    };
    li.appendChild(completeButton);

    // Add "edit" button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = function () {
        taskInput.value = taskText;
        prioritySelect.value = priority;
        taskList.removeChild(li);
        saveTasks();
    };
    li.appendChild(editButton);

    // Add "delete" button with confirmation
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.classList.add("delete");
    deleteButton.onclick = function () {
        if (confirm("Are you sure you want to delete this task?")) {
            taskList.removeChild(li);
            saveTasks();
        }
    };
    li.appendChild(deleteButton);

    // Append the task item to the task list
    taskList.appendChild(li);

    // Save tasks to localStorage after creating the task
    saveTasks();
}

// Add task to the list
function addTask() {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    // Create and add task to the list
    createTaskElement(taskText, false, priority);

    // Clear the input field after adding the task
    taskInput.value = "";
}

// Filter tasks based on selected option
function filterTasks() {
    const filter = filterSelect.value;
    const taskItems = taskList.querySelectorAll("li");

    taskItems.forEach(item => {
        const isCompleted = item.classList.contains("completed");
        switch (filter) {
            case "all":
                item.style.display = "block";
                break;
            case "active":
                item.style.display = isCompleted ? "none" : "block";
                break;
            case "completed":
                item.style.display = isCompleted ? "block" : "none";
                break;
        }
    });
}

// Clear completed tasks
function clearCompletedTasks() {
    const completedTasks = taskList.querySelectorAll("li.completed");
    completedTasks.forEach(task => {
        taskList.removeChild(task);
    });
    saveTasks();
}

// Sort tasks by priority
function sortTasksByPriority() {
    const tasks = Array.from(taskList.querySelectorAll("li"));
    tasks.sort((a, b) => {
        const priorityA = a.getAttribute("data-priority");
        const priorityB = b.getAttribute("data-priority");
        const priorities = { 'Low': 1, 'Medium': 2, 'High': 3 };
        return priorities[priorityA] - priorities[priorityB];
    });

    tasks.forEach(task => {
        taskList.appendChild(task);
    });
    saveTasks();
}

// Add event listeners
addButton.addEventListener("click", addTask);
filterSelect.addEventListener("change", filterTasks);
clearButton.addEventListener("click", clearCompletedTasks);

// Allow pressing 'Enter' to add task
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Sort tasks on page load (optional)
document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
    sortTasksByPriority(); // Sort tasks by priority when the page loads
});
