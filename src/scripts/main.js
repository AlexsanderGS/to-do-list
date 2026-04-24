/* =========================
   DOM ELEMENT SELECTION
========================= */
const formTask = document.querySelector(".add-task-form");
const input = document.querySelector("#task-name");
const ulTask = document.querySelector(".tasks-items");

const editModal = document.querySelector(".edit-modal");
const modalInput = document.querySelector("#modal-task-name");
const editForm = document.querySelector(".edit-form");
const cancelEdit = document.querySelector(".cancel-edit");
const allTasksButton = document.querySelector(".all-tasks");
const pendingTasksButton = document.querySelector(".pending-tasks");
const completedTasksButton = document.querySelector(".completed-tasks");
const clearAllTasksButton = document.querySelector(".clear-tasks-button");
const taskDateInput = document.querySelector("#task-date");
const modalDateInput = document.querySelector("#modal-task-date");

/* =========================
   APPLICATION DATA
========================= */
const tasksList = JSON.parse(localStorage.getItem("tasks")) || [];
let currentTaskIndex = null;
let currentFilter = "all";

/* =========================
   LOCAL STORAGE
========================= */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasksList));
}

/* =========================
   MODAL CONTROL
========================= */
function openEditModal(task, index) {
  currentTaskIndex = index;

  modalInput.value = task.description;
  modalDateInput.value = task.date || "";

  editModal.classList.remove("hidden");
  modalInput.focus();
}

function closeEditModal() {
  editModal.classList.add("hidden");
  modalInput.value = "";
  modalDateInput.value = "";
  currentTaskIndex = null;
}

/* =========================
   TASK CREATION
========================= */
function createElementTask(task, index) {
  const list = document.createElement("li");
  list.classList.add("task-item");

  const taskContent = document.createElement("div");
  taskContent.classList.add("task-content");

  const listInput = document.createElement("input");
  listInput.type = "checkbox";
  listInput.classList.add("task-checkbox");
  listInput.checked = task.completed;

  const taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");

  const spanList = document.createElement("span");
  spanList.classList.add("task-text");
  spanList.textContent = task.description;

  const taskMeta = document.createElement("div");
  taskMeta.classList.add("task-meta");

  const calendarIcon = document.createElement("img");
  calendarIcon.setAttribute("src", "./src/assets/icons/calendar.svg");
  calendarIcon.setAttribute("alt", "");

  const dateSpan = document.createElement("span");
  dateSpan.classList.add("task-date");
  if (task.date) {
    dateSpan.textContent = formatDate(task.date);
  } else {
    dateSpan.textContent = "--/--";
    dateSpan.classList.add("empty");
  }

  const listActions = document.createElement("div");
  listActions.classList.add("list-actions");

  const editButton = document.createElement("button");
  editButton.classList.add("edit-task");
  editButton.type = "button";
  editButton.setAttribute("aria-label", "Editar tarefa");

  const editIcon = document.createElement("img");
  editIcon.setAttribute("src", "./src/assets/icons/edit.svg");
  editIcon.setAttribute("alt", "");
  editButton.append(editIcon);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("delete-task");
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", "Excluir tarefa");

  const deleteIcon = document.createElement("img");
  deleteIcon.setAttribute("src", "./src/assets/icons/trash.svg");
  deleteIcon.setAttribute("alt", "");
  deleteButton.append(deleteIcon);

  taskMeta.append(calendarIcon, dateSpan);
  taskInfo.append(spanList, taskMeta);
  taskContent.append(listInput, taskInfo);
  listActions.append(editButton, deleteButton);
  list.append(taskContent, listActions);

  /* initial visual state */
  list.classList.toggle("completed", task.completed);
  list.classList.toggle("pending", !task.completed);

  /* complete task */
  listInput.addEventListener("change", () => {
    task.completed = listInput.checked;

    list.classList.toggle("completed", task.completed);
    list.classList.toggle("pending", !task.completed);

    saveTasks();
    renderAllTasks();
  });

  /* delete task */
  deleteButton.addEventListener("click", () => {
    tasksList.splice(index, 1);
    saveTasks();
    renderAllTasks();
  });

  /* open edit modal */
  editButton.addEventListener("click", () => {
    openEditModal(task, index);
  });

  return list;
}

/* =========================
   RENDER
========================= */
function renderTask(task, index) {
  const elementTask = createElementTask(task, index);
  ulTask.append(elementTask);
}

function renderAllTasks() {
  ulTask.innerHTML = "";

  tasksList.forEach((task, index) => {
    const shouldRender =
      currentFilter === "all" ||
      (currentFilter === "pending" && !task.completed) ||
      (currentFilter === "completed" && task.completed);

    if (shouldRender) {
      renderTask(task, index);
    }
  });
}

function updateActiveFilterButton() {
  allTasksButton.classList.toggle("active", currentFilter === "all");
  pendingTasksButton.classList.toggle("active", currentFilter === "pending");
  completedTasksButton.classList.toggle(
    "active",
    currentFilter === "completed",
  );
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const [year, month, day] = dateString.split("-");
  return `${day}/${month}`;
}

/* =========================
   EVENTS
========================= */

/* add new task */
formTask.addEventListener("submit", (event) => {
  event.preventDefault();

  const description = input.value.trim();

  if (!description) {
    return;
  }

  const task = {
    description,
    date: taskDateInput.value,
    completed: false,
  };

  tasksList.push(task);
  saveTasks();
  renderAllTasks();

  input.value = "";
  taskDateInput.value = "";
  input.focus();
});

/* cancel edit */
cancelEdit.addEventListener("click", () => {
  closeEditModal();
});

/* save edit */
editForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newValue = modalInput.value.trim();

  if (!newValue || currentTaskIndex === null) {
    return;
  }

  tasksList[currentTaskIndex].description = newValue;
  tasksList[currentTaskIndex].date = modalDateInput.value;

  saveTasks();
  renderAllTasks();
  closeEditModal();
});

/* all tasks filter */
allTasksButton.addEventListener("click", () => {
  currentFilter = "all";
  updateActiveFilterButton();
  renderAllTasks();
});

/* pending tasks filter */
pendingTasksButton.addEventListener("click", () => {
  currentFilter = "pending";
  updateActiveFilterButton();
  renderAllTasks();
});

/* completed tasks filter */
completedTasksButton.addEventListener("click", () => {
  currentFilter = "completed";
  updateActiveFilterButton();
  renderAllTasks();
});

/* clear all tasks */
clearAllTasksButton.addEventListener("click", () => {
  const confirmDelete = confirm(
    "Essa ação irá apagar todas as tarefas. Deseja continuar?",
  );

  if (!confirmDelete) return;

  tasksList.length = 0;
  saveTasks();
  renderAllTasks();
});

/* =========================
   INITIAL LOAD
========================= */
updateActiveFilterButton();
renderAllTasks();
