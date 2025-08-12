# Swapi – University Bulletin Board

**Swapi** is a web application designed for university communities to post and find ads for buying, selling, renting, and offering services.
Built with **Node.js**, **Apollo Server**, **GraphQL**, **MySQL**, and **React**, Swapi provides a secure, responsive, and user-friendly experience.

---

## Features

* User authentication with JWT
* Email verification via PIN code
* CRUD for ads (create, read, update, delete)
* Categorized ads for easy navigation
* Responsive design for mobile and desktop
* Secure backend with Apollo GraphQL and MySQL

---

## Tech Stack

**Frontend:**

* React
* Tailwind CSS
* Apollo Client

**Backend:**

* Node.js
* Apollo Server (GraphQL)
* Knex.js
* MySQL

**Other Tools:**

* JWT Authentication
* Nodemailer for email verification

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/tuusuario/swapi.git
cd swapi
```

### 2. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 3. Set up environment variables

Create a `.env` file in both `backend` and `frontend` with the following (adjust as needed):

Backend `.env`:

```
PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=swapi
JWT_SECRET=yourjwtsecret
EMAIL_USER=youremail@example.com
EMAIL_PASS=yourpassword
```

Frontend `.env`:

```
REACT_APP_GRAPHQL_URI=http://localhost:4000/graphql
```

### 4. Run the project

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm start
```

---
