const express = require('express');
const path = require('path');
const fs = require('fs/promises');
const session = require('express-session');

const app = express();
const PORT = 3000;
const ARTICLES_DIR = path.join(__dirname, 'articles');
const USERS_FILE = path.join(__dirname, 'users.json');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'personal_blog_secret',
  resave: false,
  saveUninitialized: true,
}));

async function getArticles() {
  const files = await fs.readdir(ARTICLES_DIR);
  const articles = [];

  for (const file of files) {
    const content = await fs.readFile(path.join(ARTICLES_DIR, file), 'utf-8');
    const article = JSON.parse(content);
    articles.push({ id: file.replace('.json', ''), ...article });
  }

  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
};

async function saveArticle(id, data) {
  const filePath = path.join(ARTICLES_DIR, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

async function deleteArticle(id) {
  const filePath = path.join(ARTICLES_DIR, `${id}.json`);
  await fs.unlink(filePath);
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

  app.get('/api/session', (req, res) => {
    res.json({
        isAuthenticated: !!req.session.isAuthenticated,
        username: req.session.username || null,
        isAdmin: req.session.isAdmin || false,
    });
});


  app.get('/api/articles', async (req, res) => {
    try {
      const articles = await getArticles();
      res.json(articles);
    } catch (err) {
      console.error('Error fetching articles:', err);
      res.status(500).send('Error fetching articles.');
    }
  });

  app.get('/api/article/:id', async (req, res) => {
    try {
        const filePath = path.join(ARTICLES_DIR, `${req.params.id}.json`);
        const article = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        res.json(article);
    } catch (err) {
        console.error('Error fetching article:', err);
        res.status(500).send('Error fetching article.');
    }
});
  

  app.get('/article/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'article.html'));
  });

app.get('/admin', (req, res) => {
    if (!req.session.isAdmin) return res.redirect('/login');
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  });

app.get('/new', (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/login');
    res.sendFile(path.join(__dirname, 'public', 'add.html'));
});

app.post('/new', async (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/login');
  const id = Date.now().toString();
  await saveArticle(id, req.body);
  res.redirect('/admin');
});

app.get('/edit/:id', async (req, res) => {
    if (!req.session.isAdmin) return res.redirect('/login');
    res.sendFile(path.join(__dirname, 'public', 'edit.html'));
  });
  
  app.post('/edit/:id', async (req, res) => {
    if (!req.session.isAdmin) return res.redirect('/login');
    try {
      const id = req.params.id;
      await saveArticle(id, req.body);
      res.redirect('/admin');
    } catch (err) {
      console.error('Error saving article:', err);
      res.status(500).send('Error saving article.');
    }
  });

app.post('/delete/:id', async (req, res) => {
  if (!req.session.isAdmin) return res.redirect('/login');
  await deleteArticle(req.params.id);
  res.sendStatus(200);
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await fs.readFile(USERS_FILE, 'utf-8');
        const users = JSON.parse(data).users;

        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            req.session.isAuthenticated = true;
            req.session.username = user.username;
            req.session.isAdmin = user.role === 'admin';
            res.redirect('/');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error('Error reading users file:', err);
        res.status(500).send('Server error');
    }
});


app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    }
    res.redirect('/');
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
