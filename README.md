# Personal Blog Project

## Overview
Sample solution for the [Personal Blog challenge](https://roadmap.sh/projects/personal-blog) from [roadmap.sh](https://roadmap.sh).

### Key Features:
- **Guest View:**
  - List of articles with titles and publication dates.
  - Detailed article view with a clean and readable layout.
  - "Back to Home" button for easy navigation.

- **Admin View:**
  - Dashboard to list, edit, and delete articles.
  - Form to add new articles with fields for title, content, and publication date.
  - Authentication system for admin access.

### Technologies Used:
- Node.js with Express for the backend.
- HTML and CSS for the frontend design.
- JavaScript (ES6+) for interactivity and dynamic content loading.
- JSON files for article storage.

---

## File Structure

```plaintext
project/
├── public/
│   ├── css/
│   │   └── styles.css   # Main stylesheet
│   ├── js/
│   │   └── scripts.js   # Main JavaScript file
│   ├── article.html     # Article view page
│   ├── admin.html       # Admin dashboard page
│   ├── edit.html        # Edit article page
│   ├── login.html       # Login page
│   └── index.html       # Home page
├── data/
│   └── articles/        # Folder for JSON files storing articles
│       └── example.json # Example article
├── app.js               # Main Node.js server file
├── package.json         # Project dependencies
└── README.md            # Documentation
```

---

## Setup and Installation

### Prerequisites:
- [Node.js](https://nodejs.org/) installed.

### Steps:
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node app.js
   ```

4. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## Usage

### Guest Section
1. Navigate to the homepage to view the list of articles.
2. Click on an article title to view its details.

### Admin Section
1. Go to `/login.html` to log in as an admin.
2. After logging in:
   - View the admin dashboard.
   - Add, edit, or delete articles.

---

## API Endpoints

### Articles
- **GET** `/api/articles` - Fetch all articles.
- **GET** `/api/article/:id` - Fetch a specific article by ID.
- **POST** `/api/article` - Add a new article.
- **POST** `/api/article/:id` - Update an existing article.
- **POST** `/delete/:id` - Delete an article by ID.

### Authentication
- **POST** `/login` - Authenticate admin users.
- **POST** `/logout` - Log out the current user.
- **GET** `/api/session` - Get the current session status.

---

## Example Article Data

```json
{
  "id": "example-article",
  "title": "The Wonders of Nature",
  "date": "August 7, 2024",
  "content": "Nature offers peace and beauty, from serene forests to majestic mountains. It inspires us to care for the Earth and cherish its wonders, reminding us of life's simplicity and harmony."
}
```

