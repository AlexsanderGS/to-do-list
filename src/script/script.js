
// Seleciona o formulário, usando o ID que adicionamos no HTML.
// O formulário é o pai do botão, então vamos monitorar ele.
const taskForm = document.getElementById('form');

// Seleciona o campo de texto de entrada, para pegar o valor digitado.
const taskInput = document.getElementById('add_task');

// Seleciona a lista onde as tarefas serão adicionadas.
const taskList = document.getElementById('ul_list');

// Adiciona um ouvinte para o evento de 'submit' do formulário
taskForm.addEventListener('submit', function (event) {
    // Impede o recarregamento da página
    event.preventDefault();

    // Captura o valor do input
    const taskText = taskInput.value;

    // Se o input estiver vazio, não faz nada e sai da função.
    if (taskText.trim() === '') {
        return;
    }

    // Adiciona um "ouvinte" de cliques à lista inteira
    taskList.addEventListener('click', function (event) {
        // Verifica se o clique foi em um elemento com a classe 'task_delete_btn'
        if (event.target.classList.contains('task_delete_btn')) {
            // Encontra o elemento 'li' pai do botão e o remove
            const listItem = event.target.parentElement;
            listItem.remove();
        }
    });

    // Cria um novo elemento de lista (<li>)
    const newListItem = document.createElement('li');

    // Adiciona o HTML de dentro do novo <li>
    newListItem.innerHTML = `
    <input type="checkbox" class="task_check">
    <span class="task_text">${taskText}</span>
    <button class="task_delete_btn">X</button>
`;

    // Adiciona o novo item (<li>) à lista (<ul>) no HTML
    taskList.appendChild(newListItem);

    // Limpa o campo de input para a próxima tarefa
    taskInput.value = '';
});