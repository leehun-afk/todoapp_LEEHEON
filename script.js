document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const filters = document.querySelectorAll('.filter-btn');
    const clearCompleted = document.getElementById('clear-completed');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const updateStats = () => {
        const count = todos.filter(t => !t.completed).length;
        itemsLeft.innerText = `${count} ${count === 1 ? 'item' : 'items'} left`;
    };

    const createTodoElement = (todo) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.dataset.id = todo.id;

        li.innerHTML = `
            <div class="checkbox ${todo.completed ? 'checked' : ''}" onclick="toggleTodo(${todo.id})">
                <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span class="todo-text">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})" aria-label="Delete task">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
        `;

        return li;
    };

    const render = () => {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        filteredTodos.forEach(todo => {
            todoList.appendChild(createTodoElement(todo));
        });

        updateStats();
    };

    window.toggleTodo = (id) => {
        todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveTodos();
        render();
    };

    window.deleteTodo = (id) => {
        const item = document.querySelector(`.todo-item[data-id="${id}"]`);
        item.style.transform = 'translateX(20px)';
        item.style.opacity = '0';
        
        setTimeout(() => {
            todos = todos.filter(t => t.id !== id);
            saveTodos();
            render();
        }, 300);
    };

    const addTodo = () => {
        const text = input.value.trim();
        if (text) {
            const newTodo = {
                id: Date.now(),
                text,
                completed: false
            };
            todos.push(newTodo);
            input.value = '';
            saveTodos();
            render();
        }
    };

    addBtn.addEventListener('click', addTodo);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    clearCompleted.addEventListener('click', () => {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        render();
    });

    // Initial render
    render();
});
