// To-Do List Application with Local Storage

class TodoApp {
    constructor() {
        // DOM Elements
        this.todoInput = document.getElementById('todoInput');
        this.addBtn = document.getElementById('addBtn');
        this.todoList = document.getElementById('todoList');
        this.clearBtn = document.getElementById('clearBtn');
        this.deleteAllBtn = document.getElementById('deleteAllBtn');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.totalTasksSpan = document.getElementById('totalTasks');
        this.completedTasksSpan = document.getElementById('completedTasks');
        this.activeTasksSpan = document.getElementById('activeTasks');

        // State
        this.todos = [];
        this.currentFilter = 'all';
        this.editingId = null;

        // Initialize
        this.init();
    }

    init() {
        // Load todos from local storage
        this.loadFromStorage();

        // Event listeners
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });

        this.clearBtn.addEventListener('click', () => this.clearCompleted());
        this.deleteAllBtn.addEventListener('click', () => this.deleteAll());

        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Initial render
        this.render();
    }

    // Load todos from local storage
    loadFromStorage() {
        const stored = localStorage.getItem('todos');
        this.todos = stored ? JSON.parse(stored) : [];
    }

    // Save todos to local storage
    saveToStorage() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    // Add a new todo
    addTodo() {
        const text = this.todoInput.value.trim();

        if (!text) {
            alert('Please enter a task!');
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toLocaleString()
        };

        this.todos.unshift(todo);
        this.saveToStorage();
        this.todoInput.value = '';
        this.render();
    }

    // Delete a todo
    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveToStorage();
        this.render();
    }

    // Toggle todo completion status
    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveToStorage();
            this.render();
        }
    }

    // Edit a todo
    editTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            const newText = prompt('Edit task:', todo.text);
            if (newText && newText.trim()) {
                todo.text = newText.trim();
                this.saveToStorage();
                this.render();
            }
        }
    }

    // Clear all completed todos
    clearCompleted() {
        if (this.todos.some(t => t.completed)) {
            if (confirm('Delete all completed tasks?')) {
                this.todos = this.todos.filter(t => !t.completed);
                this.saveToStorage();
                this.render();
            }
        } else {
            alert('No completed tasks to clear!');
        }
    }

    // Delete all todos
    deleteAll() {
        if (this.todos.length > 0) {
            if (confirm('Delete ALL tasks? This cannot be undone!')) {
                this.todos = [];
                this.saveToStorage();
                this.render();
            }
        } else {
            alert('No tasks to delete!');
        }
    }

    // Set filter
    setFilter(filter) {
        this.currentFilter = filter;
        this.filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    // Filter todos based on current filter
    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'active':
                return this.todos.filter(t => !t.completed);
            case 'completed':
                return this.todos.filter(t => t.completed);
            default:
                return this.todos;
        }
    }

    // Update stats
    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const active = total - completed;

        this.totalTasksSpan.textContent = `Total: ${total}`;
        this.completedTasksSpan.textContent = `Completed: ${completed}`;
        this.activeTasksSpan.textContent = `Active: ${active}`;
    }

    // Render the todo list
    render() {
        const filtered = this.getFilteredTodos();

        // Clear the list
        this.todoList.innerHTML = '';

        // Update stats
        this.updateStats();

        // If no todos, show empty state
        if (filtered.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <div>${this.currentFilter === 'all' ? 'No tasks yet. Add one to get started!' : `No ${this.currentFilter} tasks.`}</div>
                </div>
            `;
            return;
        }

        // Render todos
        filtered.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="app.toggleTodo(${todo.id})"
                >
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <div class="todo-actions">
                    <button class="edit-btn" onclick="app.editTodo(${todo.id})">Edit</button>
                    <button class="delete-btn" onclick="app.deleteTodo(${todo.id})">Delete</button>
                </div>
            `;
            this.todoList.appendChild(li);
        });
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}

// Initialize the app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TodoApp();
});
