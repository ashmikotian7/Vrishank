# TimeCapsule Django Backend

## Setup Instructions

1. **Activate Virtual Environment**
   ```bash
   cd backend
   venv\Scripts\activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run Migrations**
   ```bash
   python manage.py migrate
   ```

4. **Create Superuser (Optional)**
   ```bash
   python manage.py createsuperuser
   ```

5. **Start Development Server**
   ```bash
   python manage.py runserver
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup/` - User Registration
- `POST /api/auth/login/` - User Login
- `POST /api/auth/logout/` - User Logout
- `POST /api/auth/refresh/` - Refresh Access Token
- `GET /api/auth/profile/` - Get User Profile

### API Usage

#### Signup
```json
POST /api/auth/signup/
{
    "email": "john@example.com",
    "full_name": "John Doe",
    "password": "securepassword123",
    "password_confirm": "securepassword123"
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "email": "john@example.com",
        "full_name": "John Doe",
        "created_at": "2023-01-01T00:00:00Z"
    },
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "message": "User created successfully"
}
```

#### Login
```json
POST /api/auth/login/
{
    "email": "john@example.com",
    "password": "securepassword123"
}
```

**Response:**
```json
{
    "user": {
        "id": 1,
        "email": "john@example.com",
        "full_name": "John Doe",
        "created_at": "2023-01-01T00:00:00Z"
    },
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "message": "Login successful"
}
```

#### Refresh Token
```json
POST /api/auth/refresh/
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Logout
```json
POST /api/auth/logout/
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

#### Profile (Requires Authentication)
```json
GET /api/auth/profile/
Headers: {
    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Token Information

- **Access Token**: Valid for 60 minutes
- **Refresh Token**: Valid for 7 days
- **Token Type**: JWT (JSON Web Tokens)
- **Authentication**: Bearer token in Authorization header

## Database Schema

The database schema is defined in `../db.sql` and includes:
- `accounts_user` - Custom user model with email, full_name fields
- `token_blacklist_outstandingtoken` - JWT outstanding tokens
- `token_blacklist_blacklistedtoken` - Blacklisted JWT tokens

## Features
- Custom User Model with email authentication
- JWT authentication with access and refresh tokens
- Token blacklisting for secure logout
- Password validation
- CORS enabled for frontend integration
- Automatic token rotation
