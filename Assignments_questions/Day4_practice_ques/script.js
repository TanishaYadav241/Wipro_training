// ========================================
// BLOG & TODO PLATFORM
// Using Revealing Module Pattern
// ========================================

/**
 * BlogTodoApp Module
 * Handles fetching, displaying, and managing blog posts and todos
 * Implements error handling and uses the Revealing Module Pattern
 */
const BlogTodoApp = (function() {
    // ========================================
    // PRIVATE VARIABLES
    // ========================================
    const API_BASE = 'https://jsonplaceholder.typicode.com';
    let postsData = [];
    let todosData = [];
    let currentFilter = 'all';
    let nextTodoId = 1000; // Start custom IDs from 1000
    let nextPostId = 1000; // Start custom post IDs from 1000

    // ========================================
    // PRIVATE HELPER FUNCTIONS
    // ========================================

    /**
     * Handles and displays errors to the user
     * @param {Error} error - The error object
     * @param {HTMLElement} containerElement - The container to display error in
     * @param {string} errorMessage - User-friendly error message
     */
    const handleError = (error, containerElement, errorMessage) => {
        console.error('Error:', error);
        containerElement.innerHTML = `
            <div class="error">
                <strong>❌ Error:</strong>
                <p>${errorMessage}</p>
                <small>${error.message}</small>
            </div>
        `;
    };

    /**
     * Shows loading indicator
     * @param {HTMLElement} containerElement - The container to show loading in
     * @param {string} message - Loading message to display
     */
    const showLoading = (containerElement, message = 'Loading...') => {
        containerElement.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                ${message}
            </div>
        `;
    };

    /**
     * Shows success message
     * @param {string} message - Success message to display
     * @param {HTMLElement} containerElement - Container to insert message before
     */
    const showSuccessMessage = (message, containerElement) => {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        containerElement.parentElement.insertBefore(successDiv, containerElement);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    };

    // ========================================
    // FETCH FUNCTIONS
    // ========================================

    /**
     * Fetches blog posts from the API
     * Implements error handling for network failures and invalid responses
     */
    const fetchPosts = async () => {
        const container = document.getElementById('posts-container');
        showLoading(container, 'Fetching blog posts...');

        try {
            // Make API request
            const response = await fetch(`${API_BASE}/posts?_limit=10`);
            
            // Check if response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse JSON data
            const data = await response.json();
            
            // Validate data
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No posts data received');
            }

            // Store data and render
            postsData = data;
            renderPosts();
        } catch (error) {
            // Handle any errors that occurred
            handleError(
                error,
                container,
                'Failed to load blog posts. Please check your internet connection and try again.'
            );
        }
    };

    /**
     * Fetches todo list from the API
     * Implements error handling for network failures and invalid responses
     */
    const fetchTodos = async () => {
        const container = document.getElementById('todos-container');
        showLoading(container, 'Fetching todos...');

        try {
            // Make API request
            const response = await fetch(`${API_BASE}/todos?_limit=20`);
            
            // Check if response is successful
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse JSON data
            const data = await response.json();
            
            // Validate data
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('No todos data received');
            }

            // Store data and render
            todosData = data;
            renderTodos();
            renderStats();
        } catch (error) {
            // Handle any errors that occurred
            handleError(
                error,
                container,
                'Failed to load todos. Please check your internet connection and try again.'
            );
        }
    };

    // ========================================
    // RENDER FUNCTIONS
    // ========================================

    /**
     * Renders blog posts to the DOM
     * Creates post cards with title, body, and metadata
     */
    const renderPosts = () => {
        const container = document.getElementById('posts-container');
        
        // Generate HTML for each post
        const postsHTML = postsData.map(post => `
            <div class="post-card" data-post-id="${post.id}">
                ${post.isNew ? '<span class="new-badge">NEW</span>' : ''}
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <div class="post-meta">
                    <span>👤 User ${post.userId}</span>
                    <span>📄 Post #${post.id}</span>
                </div>
            </div>
        `).join('');

        // Update DOM
        container.innerHTML = `<div class="posts-grid">${postsHTML}</div>`;
    };

    /**
     * Renders todo list to the DOM
     * Applies current filter and displays todos accordingly
     */
    const renderTodos = () => {
        const container = document.getElementById('todos-container');
        
        // Apply filter
        let filteredTodos = todosData;
        if (currentFilter === 'active') {
            filteredTodos = todosData.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todosData.filter(todo => todo.completed);
        }

        // Handle empty results
        if (filteredTodos.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No todos found</p>';
            return;
        }

        // Generate HTML for each todo
        const todosHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" data-todo-id="${todo.id}">
                ${todo.isNew ? '<span class="new-badge">NEW</span>' : ''}
                <div class="todo-checkbox"></div>
                <div class="todo-text">${todo.title}</div>
            </div>
        `).join('');

        // Update DOM
        container.innerHTML = `<div class="todo-list">${todosHTML}</div>`;
        
        // Add click event listeners to todo items
        attachTodoClickListeners();
    };

    /**
     * Renders statistics for todos
     * Shows total, active, and completed counts
     */
    const renderStats = () => {
        const statsContainer = document.getElementById('todo-stats');
        
        // Calculate statistics
        const total = todosData.length;
        const completed = todosData.filter(todo => todo.completed).length;
        const active = total - completed;

        // Generate and update stats HTML
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${total}</div>
                <div class="stat-label">Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${active}</div>
                <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${completed}</div>
                <div class="stat-label">Completed</div>
            </div>
        `;
    };

    // ========================================
    // TODO MANAGEMENT FUNCTIONS
    // ========================================

    /**
     * Adds a new todo to the list
     * @param {string} title - The todo title
     */
    const addTodo = (title) => {
        if (!title || title.trim() === '') {
            alert('Please enter a todo task!');
            return;
        }

        // Create new todo object
        const newTodo = {
            userId: 1,
            id: nextTodoId++,
            title: title.trim(),
            completed: false,
            isNew: true // Flag to show "NEW" badge
        };

        // Add to the beginning of the array
        todosData.unshift(newTodo);
        
        // Re-render todos and stats
        renderTodos();
        renderStats();
        
        // Show success message
        const container = document.getElementById('todos-container');
        showSuccessMessage('✓ Todo added successfully!', container);
        
        // Hide form and clear input
        toggleTodoForm(false);
        document.getElementById('todo-input').value = '';
    };

    /**
     * Toggles todo completion status
     * @param {number} todoId - The ID of the todo to toggle
     */
    const toggleTodoComplete = (todoId) => {
        const todo = todosData.find(t => t.id === todoId);
        if (todo) {
            todo.completed = !todo.completed;
            renderTodos();
            renderStats();
        }
    };

    /**
     * Attaches click listeners to todo items
     */
    const attachTodoClickListeners = () => {
        const todoItems = document.querySelectorAll('.todo-item');
        todoItems.forEach(item => {
            item.addEventListener('click', function() {
                const todoId = parseInt(this.getAttribute('data-todo-id'));
                toggleTodoComplete(todoId);
            });
        });
    };

    // ========================================
    // POST MANAGEMENT FUNCTIONS
    // ========================================

    /**
     * Adds a new blog post
     * @param {string} title - The post title
     * @param {string} body - The post content
     */
    const addPost = (title, body) => {
        if (!title || title.trim() === '') {
            alert('Please enter a post title!');
            return;
        }
        if (!body || body.trim() === '') {
            alert('Please enter post content!');
            return;
        }

        // Create new post object
        const newPost = {
            userId: 1,
            id: nextPostId++,
            title: title.trim(),
            body: body.trim(),
            isNew: true // Flag to show "NEW" badge
        };

        // Add to the beginning of the array
        postsData.unshift(newPost);
        
        // Re-render posts
        renderPosts();
        
        // Show success message
        const container = document.getElementById('posts-container');
        showSuccessMessage('✓ Blog post published successfully!', container);
        
        // Hide form and clear inputs
        togglePostForm(false);
        document.getElementById('post-title-input').value = '';
        document.getElementById('post-body-input').value = '';
    };

    // ========================================
    // FORM TOGGLE FUNCTIONS
    // ========================================

    /**
     * Toggles the todo form visibility
     * @param {boolean} show - Whether to show or hide the form
     */
    const toggleTodoForm = (show) => {
        const form = document.getElementById('add-todo-form');
        if (show) {
            form.classList.remove('hidden');
            document.getElementById('todo-input').focus();
        } else {
            form.classList.add('hidden');
        }
    };

    /**
     * Toggles the post form visibility
     * @param {boolean} show - Whether to show or hide the form
     */
    const togglePostForm = (show) => {
        const form = document.getElementById('add-post-form');
        if (show) {
            form.classList.remove('hidden');
            document.getElementById('post-title-input').focus();
        } else {
            form.classList.add('hidden');
        }
    };

    // ========================================
    // FILTER FUNCTION
    // ========================================

    /**
     * Filters todos based on completion status
     * @param {string} filter - Filter type: 'all', 'active', or 'completed'
     */
    const filterTodos = (filter) => {
        currentFilter = filter;
        
        // Update button states
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            }
        });
        
        // Re-render todos with new filter
        renderTodos();
    };

    // ========================================
    // EVENT LISTENERS SETUP
    // ========================================

    /**
     * Sets up all event listeners for the application
     */
    const setupEventListeners = () => {
        // Refresh Posts button
        const refreshPostsBtn = document.getElementById('refresh-posts-btn');
        if (refreshPostsBtn) {
            refreshPostsBtn.addEventListener('click', fetchPosts);
        }

        // Refresh Todos button
        const refreshTodosBtn = document.getElementById('refresh-todos-btn');
        if (refreshTodosBtn) {
            refreshTodosBtn.addEventListener('click', fetchTodos);
        }

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                filterTodos(filter);
            });
        });

        // Add Todo button
        const addTodoBtn = document.getElementById('add-todo-btn');
        if (addTodoBtn) {
            addTodoBtn.addEventListener('click', function() {
                toggleTodoForm(true);
            });
        }

        // Submit Todo button
        const submitTodoBtn = document.getElementById('submit-todo-btn');
        if (submitTodoBtn) {
            submitTodoBtn.addEventListener('click', function() {
                const todoInput = document.getElementById('todo-input');
                addTodo(todoInput.value);
            });
        }

        // Cancel Todo button
        const cancelTodoBtn = document.getElementById('cancel-todo-btn');
        if (cancelTodoBtn) {
            cancelTodoBtn.addEventListener('click', function() {
                toggleTodoForm(false);
                document.getElementById('todo-input').value = '';
            });
        }

        // Add Post button
        const addPostBtn = document.getElementById('add-post-btn');
        if (addPostBtn) {
            addPostBtn.addEventListener('click', function() {
                togglePostForm(true);
            });
        }

        // Submit Post button
        const submitPostBtn = document.getElementById('submit-post-btn');
        if (submitPostBtn) {
            submitPostBtn.addEventListener('click', function() {
                const titleInput = document.getElementById('post-title-input');
                const bodyInput = document.getElementById('post-body-input');
                addPost(titleInput.value, bodyInput.value);
            });
        }

        // Cancel Post button
        const cancelPostBtn = document.getElementById('cancel-post-btn');
        if (cancelPostBtn) {
            cancelPostBtn.addEventListener('click', function() {
                togglePostForm(false);
                document.getElementById('post-title-input').value = '';
                document.getElementById('post-body-input').value = '';
            });
        }

        // Enter key support for todo input
        const todoInput = document.getElementById('todo-input');
        if (todoInput) {
            todoInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTodo(this.value);
                }
            });
        }

        // Enter key support for post title (Shift+Enter for body)
        const postTitleInput = document.getElementById('post-title-input');
        if (postTitleInput) {
            postTitleInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    document.getElementById('post-body-input').focus();
                }
            });
        }
    };

    // ========================================
    // INITIALIZATION
    // ========================================

    /**
     * Initializes the application
     * Sets up event listeners and fetches initial data
     */
    const init = () => {
        console.log('Initializing Blog & Todo Platform...');
        setupEventListeners();
        fetchPosts();
        fetchTodos();
    };

    // ========================================
    // PUBLIC API (REVEALING MODULE PATTERN)
    // ========================================
    
    /**
     * Returns public methods that can be accessed from outside
     * This implements the Revealing Module Pattern
     */
    return {
        init: init,
        refreshPosts: fetchPosts,
        refreshTodos: fetchTodos,
        filterTodos: filterTodos,
        addTodo: addTodo,
        addPost: addPost
    };
})();

// ========================================
// APPLICATION STARTUP
// ========================================

/**
 * Initialize the application when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    BlogTodoApp.init();
    console.log('Blog & Todo Platform loaded successfully!');
});