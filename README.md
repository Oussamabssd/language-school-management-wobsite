# Language School Management System

A comprehensive school management application built with **Laravel (Backend)** and **React + Vite (Frontend)**. This system manages students, teachers, courses, academic groups, financial records (salaries/tuition), and more.

## 🚀 Key Features
- **Role-Based Access Control**: Admin, Director, Accountant, Secretary, Teacher, Student, and Parent.
- **Academic Management**: Languages, CEFR levels, Groups, and Timetables.
- **Teaching Tools**: Homework assignments, Grade management, and Course resources.
- **Financial Module**: Track student tuition fees and employee salary payments.
- **Communication**: School-wide announcements and internal notifications.
- **Registration**: Public registration form for new students.

---

## 🛠 Prerequisites
Before you begin, ensure you have the following installed:
- [PHP](https://www.php.net/downloads) (>= 8.2)
- [Composer](https://getcomposer.org/)
- [Node.js & npm](https://nodejs.org/)
- [MySQL](https://www.mysql.com/) or any other supported database.

---

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ecole_app.git
cd ecole_app
```

### 2. Backend Setup (Laravel)
```bash
cd backend

# Install dependencies
composer install

# Create environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env
# DB_DATABASE=ecole_app
# DB_USERNAME=root
# DB_PASSWORD=

# Run migrations and seed essential data
php artisan migrate:fresh --seed

# Start the backend server
php artisan serve
```

### 3. Frontend Setup (React)
```bash
cd ../frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🔑 Default Accounts
After running the seeders, you can use the following accounts (all passwords are `password`):

| Role | Email |
| :--- | :--- |
| **Admin** | `admin@ecole.com` |
| **Director** | `director@ecole.com` |
| **Accountant** | `accountant@ecole.com` |
| **Secretary** | `secretary@ecole.com` |

---

## 📄 License
This project is open-source. Feel free to contribute or modify it as needed.
