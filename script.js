// Capturando os elementos da tela
const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

// Buscando tarefas antigas no navegador ou iniciando uma lista vazia
let todos = JSON.parse(localStorage.getItem('minhas_tarefas')) || [];
let currentFilter = 'all'; // Filtro inicial: todas

// Função para salvar no LocalStorage do navegador
function saveTodos() {
    localStorage.setItem('minhas_tarefas', JSON.stringify(todos));
}

// Proteção para não quebrar a página se alguém digitar código HTML na tarefa
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}

// Adicionar nova tarefa
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskText = input.value.trim();
    
    if (taskText !== '') {
        const newTodo = {
            id: Date.now(),
            text: escapeHTML(taskText),
            completed: false
        };
        
        todos.push(newTodo);
        saveTodos();
        input.value = ''; // Limpa o campo
        renderTodos();    // Atualiza a tela
    }
});

// Deletar tarefa
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Marcar tarefa como concluída ou pendente
function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// Renderizar (desenhar) as tarefas na tela
function renderTodos() {
    todoList.innerHTML = '';
    
    // Aplicando a filtragem (Todas, A Fazer, Concluídas)
    let filteredTodos = todos;
    if (currentFilter === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }

    // Mensagem de lista vazia
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `<p class="text-center text-gray-500 mt-4">Nenhuma tarefa encontrada para este filtro.</p>`;
        return;
    }

    // Criando o HTML para cada tarefa dinamicamente
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 ${todo.completed ? 'opacity-60 bg-gray-100' : ''}`;
        
        li.innerHTML = `
            <div class="flex items-center gap-3 overflow-hidden cursor-pointer w-full" onclick="toggleTodo(${todo.id})">
                <input type="checkbox" class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer" ${todo.completed ? 'checked' : ''} onclick="event.stopPropagation(); toggleTodo(${todo.id})">
                <span class="flex-1 truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}">${todo.text}</span>
            </div>
            <button onclick="deleteTodo(${todo.id})" class="delete-btn text-red-500 hover:text-red-700 ml-2 p-1" title="Excluir">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        `;
        todoList.appendChild(li);
    });
}

// Lógica dos botões de filtro
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove a cor e o status "ativo" de todos os botões
        filterBtns.forEach(b => {
            b.classList.remove('active', 'text-indigo-600', 'font-semibold');
            b.classList.add('text-gray-500');
        });
        
        // Adiciona a cor e o status "ativo" no botão que foi clicado
        btn.classList.remove('text-gray-500');
        btn.classList.add('active', 'text-indigo-600', 'font-semibold');
        
        // Pega o valor (all, pending, completed) e atualiza a tela
        currentFilter = btn.dataset.filter;
        renderTodos();
    });
});

// Ao abrir a página pela primeira vez, desenha as tarefas salvas
renderTodos();