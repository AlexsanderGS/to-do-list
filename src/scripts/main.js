const html = document.querySelector("html");

const formTask = document.querySelector(".add-task-form");
const input = document.querySelector("#task-name");
const ulTask = document.querySelector(".tasks-items");

const tasksList = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasksList));
}

function createElementTask(task) {
  const list = document.createElement("li");
  list.classList.add("task-item");

  const taskContent = document.createElement("div");
  taskContent.classList.add("task-content");

  const listInput = document.createElement("input");
  listInput.type = "checkbox";
  listInput.classList.add("task-checkbox");

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
  dateSpan.textContent = task.date || "--/--";

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

  return list;
}

function renderTask(task) {
  const elementTask = createElementTask(task);
  ulTask.append(elementTask);
}

formTask.addEventListener("submit", (event) => {
  event.preventDefault();

  const description = input.value.trim();

  if (!description) {
    return;
  }

  const task = {
    description,
    date: "",
  };

  tasksList.push(task);
  saveTasks();
  renderTask(task);

  input.value = "";
  input.focus();
});

tasksList.forEach((task) => {
  renderTask(task);
});
