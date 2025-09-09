
// Seleciona o formulário, usando o ID que adicionamos no HTML.
// O formulário é o pai do botão, então vamos monitorar ele.
const taskForm = document.getElementById('form');

// Seleciona o campo de texto de entrada, para pegar o valor digitado.
const taskInput = document.getElementById('add_task');

// Seleciona a lista onde as tarefas serão adicionadas.
const taskList = document.getElementById('ul_list');

// Adiciona um ouvinte para o evento de 'submit' do formulário
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const taskText = taskInput.value;

    if (taskText.trim() === '') {
        return;
    }

    const newListItem = document.createElement('li');

    newListItem.innerHTML = `
        <input type="checkbox" class="task_check">
        <span class="task_text">${taskText}</span>
        <button class="task_delete_btn">X</button>
    `;

    taskList.appendChild(newListItem);
    taskInput.value = '';

    // NOVA LINHA: Salva as tarefas após adicionar uma nova
    saveTasks();
});

// Adiciona um "ouvinte" de cliques à lista inteira
taskList.addEventListener('click', function(event) {
    if (event.target.classList.contains('task_delete_btn')) {
        const listItem = event.target.parentElement;
        listItem.remove();

        // NOVA LINHA: Salva as tarefas após remover uma
        saveTasks();
    }
});

// NOVO BLOCO DE CÓDIGO AQUI
function saveTasks() {
    const tasks = taskList.querySelectorAll('li');
    const tasksArray = [];

    tasks.forEach(task => {
        const taskText = task.querySelector('.task_text').textContent;
        tasksArray.push(taskText);
    });

    localStorage.setItem('tasks', JSON.stringify(tasksArray));
}

// Função para carregar as tarefas do localStorage
function loadTasks() {
    // 1. Pega os dados do localStorage
    const savedTasks = localStorage.getItem('tasks');

    // 2. Se houver dados, converte a string JSON de volta para um array
    if (savedTasks) {
        const tasksArray = JSON.parse(savedTasks);

        // 3. Itera sobre o array e cria os elementos na tela
        tasksArray.forEach(taskText => {
            const newListItem = document.createElement('li');
            newListItem.innerHTML = `
                <input type="checkbox" class="task_check">
                <span class="task_text">${taskText}</span>
                <button class="task_delete_btn">X</button>
            `;
            taskList.appendChild(newListItem);
        });
    }
}

// Chama a função para carregar as tarefas assim que o script for carregado
loadTasks();
