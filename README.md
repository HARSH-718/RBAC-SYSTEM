# RBAC Permission Management System

A full-stack Role-Based Access Control (RBAC) system built with React.js, Node.js, Express.js, and MongoDB.

The system provides secure authentication and authorization with role-based and permission-based access control.

---

## 🚀 Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Password Hashing using bcrypt
- Protected API Routes
- Axios Interceptor for JWT Token
- Logout functionality

### User Management
- View Users
- Create User
- Edit User
- Delete User
- Search Users
- Assign Roles to Users
- Activate / Deactivate Users

### Role Management
- View Roles
- Create Roles
- Edit Roles
- Delete Roles
- Assign Permissions to Roles

### Permission Management
- View Permissions
- Create Permissions
- Edit Permissions
- Delete Permissions
- Permission-based authorization

### Dashboard
- Total Users
- Total Roles
- Total Permissions
- Active Users
- Recent Activity
- Latest Users
- Quick Actions

### Authorization
The application supports three main roles:

- `super_admin`
- `admin`
- `user`

Access to pages, buttons, and actions is controlled using permissions.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- JavaScript
- React Router
- Axios
- React Icons
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

---

## 📁 Project Structure

```text
RBAC-System/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── utils/
│       ├── app/
│       └── main.jsx
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   └── server.js
│
└── README.md