# TimeCapsule 🕰️

A modern web application for creating and sharing digital time capsules that can be unlocked at specified future dates.

## 🚀 Features

- **Create Time Capsules**: Store messages, photos, and memories for future retrieval
- **Scheduled Unlock**: Set specific dates when capsules become accessible
- **Secure Access**: PIN-protected capsules with privacy controls
- **File Attachments**: Support for multiple file types and sizes
- **Email Notifications**: Automatic notifications when capsules are ready to open
- **User Management**: Secure authentication and authorization
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **TailwindCSS** for styling
- **Lucide React** for icons
- **Axios** for API communication

### Backend
- **Django** (Python framework)
- **Django REST Framework** for API
- **JWT Authentication** with `djangorestframework-simplejwt`
- **MySQL** database
- **Token Blacklist** for security

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Vrishank
```

### 2. Database Setup

#### Option A: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Run the schema file
source timecapsule_complete_schema.sql
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. File → Open Script → Select `timecapsule_complete_schema.sql`
4. Execute the script (⚡️ lightning bolt icon)

### 3. Backend Setup (Django)

```bash
# Navigate to backend directory (if exists)
# cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (if not exists)
cp .env.example .env

# Configure environment variables in .env:
# DEBUG=True
# SECRET_KEY=your-secret-key-here
# DATABASE_URL=mysql://username:password@localhost:3306/timecapsule
# ALLOWED_HOSTS=localhost,127.0.0.1

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start Django server
python manage.py runserver
```

### 4. Frontend Setup (React)

```bash
# Navigate to frontend directory (if exists)
# cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

## 📁 Project Structure

```
Vrishank/
├── src/                          # Frontend React application
│   ├── App.tsx                   # Main React component
│   ├── components/               # Reusable React components
│   ├── pages/                    # Page components
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   └── styles/                   # CSS/SCSS files
├── backend/                      # Django backend (if separated)
│   ├── manage.py                 # Django management script
│   ├── requirements.txt          # Python dependencies
│   ├── timecapsule/              # Django project settings
│   ├── accounts/                 # User management app
│   ├── capsules/                 # Time capsule app
│   └── .env                      # Environment variables
├── timecapsule_complete_schema.sql # Complete database schema
└── README.md                     # This file
```

## 🔧 Configuration

### Database Configuration

The database schema is already defined in `timecapsule_complete_schema.sql`. This file includes:

- **13 tables** with proper relationships
- **25 indexes** for optimal performance
- **52 permissions** for Django's auth system
- **Foreign key constraints** with cascade deletes
- **Proper character set** (utf8mb4) for full Unicode support

### Environment Variables

Create a `.env` file in your backend directory with the following:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-very-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=mysql://username:password@localhost:3306/timecapsule
DB_NAME=timecapsule
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440

# Email Settings (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

## 🐛 Common Issues & Solutions

### Database Connection Issues

**Error**: `Access denied for user 'root'@'localhost'`
**Solution**: Check your MySQL credentials and ensure the user has privileges

**Error**: `Unknown database 'timecapsule'`
**Solution**: Run the schema file first to create the database

### Backend Issues

**Error**: `ModuleNotFoundError: No module named 'django'`
**Solution**: Activate your virtual environment and install requirements

**Error**: `django.db.utils.OperationalError`
**Solution**: Ensure MySQL server is running and database exists

### Frontend Issues

**Error**: `npm ERR! code ERESOLVE`
**Solution**: Clear npm cache: `npm cache clean --force`

**Error**: `API requests failing`
**Solution**: Check if Django server is running on port 8000

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/refresh/` - Refresh JWT token
- `POST /api/auth/register/` - User registration

### Capsule Endpoints

- `GET /api/capsules/` - List user capsules
- `POST /api/capsules/` - Create new capsule
- `GET /api/capsules/{id}/` - Get capsule details
- `PUT /api/capsules/{id}/` - **Update/Edit capsule**
- `PATCH /api/capsules/{id}/` - **Partial update capsule**
- `DELETE /api/capsules/{id}/` - **Delete capsule permanently**
- `POST /api/capsules/{id}/unlock/` - Unlock capsule
- `POST /api/capsules/{id}/seal/` - Seal capsule (make it immutable)
- `POST /api/capsules/{id}/attachments/` - Add file attachments

### Capsule Edit Operations

**Update Capsule (PUT):**
```bash
PUT /api/capsules/{id}/
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "title": "Updated Title",
  "description": "Updated description",
  "message": "Updated message content",
  "unlock_date": "2026-12-31T23:59:59Z",
  "is_private": false,
  "pin_lock": "1234"
}
```

**Partial Update (PATCH):**
```bash
PATCH /api/capsules/{id}/
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "title": "Just update the title"
}
```

### Capsule Delete Operations

**Delete Capsule:**
```bash
DELETE /api/capsules/{id}/
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "message": "Capsule deleted successfully",
  "id": 123
}
```

### Attachment Endpoints

- `GET /api/capsules/{id}/attachments/` - List capsule attachments
- `POST /api/capsules/{id}/attachments/` - Upload new attachment
- `DELETE /api/attachments/{id}/` - Delete specific attachment
- `GET /api/attachments/{id}/download/` - Download attachment file



## 🚀 Deployment

### Production Database Setup

1. Create production database
2. Run the schema file in production environment
3. Update environment variables with production credentials

### Backend Deployment

```bash
# Install production dependencies
pip install gunicorn

# Collect static files
python manage.py collectstatic

# Run with gunicorn
gunicorn your_project.wsgi:application --bind 0.0.0.0:8000
```

### Frontend Deployment

```bash
# Build for production
npm run build

# The build folder contains the optimized production files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Common Issues](#-common-issues--solutions) section above
2. Search existing GitHub issues
3. Create a new issue with detailed information:
   - Operating system
   - Python/Node.js versions
   - Error messages
   - Steps to reproduce

## 📊 Database Schema Summary

The `timecapsule_complete_schema.sql` file includes:

- **13 tables**: Complete Django framework setup
- **25 indexes**: Optimized for performance
- **52 permissions**: Full Django auth system
- **Foreign keys**: Proper relationships with cascade deletes
- **Comments**: Comprehensive documentation

### Key Tables:
- `accounts_user` - Custom user model
- `capsules_capsule` - Time capsules
- `capsules_capsuleattachment` - File attachments
- `capsules_capsulerecipient` - Email recipients
- `token_blacklist_*` - JWT token management

---

**Happy Coding! 🎉**
