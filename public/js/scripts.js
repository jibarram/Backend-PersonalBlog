document.addEventListener('DOMContentLoaded', async () => {
    const bodyClass = document.body.className;
    const titleContainer = document.querySelector('.title-container');
    if (titleContainer) {
        const authFrame = document.createElement('div');
        authFrame.id = 'auth-frame';
        titleContainer.appendChild(authFrame);

        try {
            const response = await fetch('/auth.html');
            if (!response.ok) throw new Error('Failed to load auth frame.');

            const authHTML = await response.text();
            authFrame.innerHTML = authHTML;

            const sessionResponse = await fetch('/api/session');
            const session = await sessionResponse.json();

            const authContainer = authFrame.querySelector('.auth-container');
            if (!authContainer) {
                throw new Error('Auth container not found in auth.html.');
            }

            if (session.isAuthenticated) {
                authContainer.innerHTML = `
                    <span>Welcome, ${session.username}</span>
                    <button id="logout-button">Logout</button>
                `;
                authContainer.querySelector('#logout-button').addEventListener('click', async () => {
                    await fetch('/logout');
                    window.location.href = '/';
                });

                if (session.isAdmin && bodyClass.includes('home-page')) {
                    window.location.href = '/admin.html';
                }
            } else {
                authContainer.innerHTML = `
                    <button id="login-button">Login</button>
                `;
                authContainer.querySelector('#login-button').addEventListener('click', () => {
                    window.location.href = '/login.html';
                });
            }
        } catch (err) {
            console.error('Error loading auth frame:', err);
            authFrame.innerHTML = '<p>Error loading authentication frame.</p>';
        }
    }

    if (bodyClass.includes('home-page')) {
        const articlesContainer = document.querySelector('.articles');
        try {
            const response = await fetch('/api/articles');
            if (!response.ok) throw new Error('Failed to fetch articles');

            const articles = await response.json();
            articles.forEach(article => {
                const articleElement = document.createElement('a');
                articleElement.href = `/article.html?id=${article.id}`;
                articleElement.textContent = `${article.title} (${article.date})`;
                articleElement.className = 'article-link';
                articlesContainer.appendChild(articleElement);
            });
        } catch (err) {
            console.error('Error loading articles:', err);
            articlesContainer.textContent = 'Failed to load articles.';
        }
    }

    if (document.body.classList.contains('article-page')) {
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('id');

        if (!articleId) {
            alert('Article not found!');
            window.location.href = '/';
            return;
        }

        try {
            const response = await fetch(`/api/article/${articleId}`);
            if (!response.ok) throw new Error('Failed to fetch article.');

            const article = await response.json();
            document.getElementById('article-title').textContent = article.title;
            document.getElementById('article-date').textContent = article.date;
            document.getElementById('article-content').textContent = article.content;
        } catch (err) {
            console.error('Error loading article:', err);
            alert('Error loading article.');
        }
    }

    if (bodyClass.includes('edit-page')) {
        const params = new URLSearchParams(window.location.search);
        const articleId = params.get('id');

        if (!articleId) {
            console.error('No article ID found in the URL.');
            document.querySelector('.form-container').textContent = 'Article not found.';
            return;
        }

        try {
            const response = await fetch(`/api/article/${articleId}`);
            if (!response.ok) throw new Error('Failed to fetch article.');

            const article = await response.json();
            document.querySelector('input[name="title"]').value = article.title;
            document.querySelector('input[name="date"]').value = article.date;
            document.querySelector('textarea[name="content"]').value = article.content;
        } catch (err) {
            console.error('Error loading article:', err);
            document.querySelector('.form-container').textContent = 'Failed to load the article.';
        }
    }

    if (bodyClass.includes('admin-page')) {
        async function fetchArticles() {
            const response = await fetch('/api/articles');
            if (!response.ok) {
                console.error('Failed to fetch articles.');
                return;
            }

            const articles = await response.json();
            const tableBody = document.querySelector('.admin-table tbody');

            articles.forEach(article => {
                const row = document.createElement('tr');

                const titleCell = document.createElement('td');
                titleCell.textContent = article.title;

                const actionsCell = document.createElement('td');
                actionsCell.innerHTML = `
                    <div class="admin-controls">
                        <button class="edit-button" onclick="window.location.href='/edit.html?id=${article.id}'">Edit</button>
                        <button class="delete-button" data-id="${article.id}">Delete</button>
                    </div>
                `;

                row.appendChild(titleCell);
                row.appendChild(actionsCell);
                tableBody.appendChild(row);
            });

            document.querySelectorAll('.delete-button').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = button.getAttribute('data-id');
                    if (confirm('Are you sure you want to delete this article?')) {
                        const response = await fetch(`/delete/${id}`, { method: 'POST' });
                        if (response.ok) {
                            window.location.reload();
                        } else {
                            alert('Failed to delete the article.');
                        }
                    }
                });
            });
        }

        fetchArticles();
    }

    const adminAddButton = document.querySelector('#admin-add-button');
    if (adminAddButton) {
        adminAddButton.addEventListener('click', () => {
            window.location.href = '/new';
        });
    }

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            e.preventDefault();
            const articleId = button.getAttribute('data-id');

            if (confirm('Are you sure you want to delete this article?')) {
                try {
                    const response = await fetch(`/delete/${articleId}`, { method: 'POST' });
                    if (response.ok) {
                        window.location.reload();
                    } else {
                        alert('Failed to delete the article.');
                    }
                } catch (err) {
                    console.error('Error deleting article:', err);
                }
            }
        });
    });
});
