-- TimeCapsule Database Schema
-- Create and select database
CREATE DATABASE IF NOT EXISTS timecapsule_db;
USE timecapsule_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS token_blacklist_blacklistedtoken;
DROP TABLE IF EXISTS token_blacklist_outstandingtoken;
DROP TABLE IF EXISTS accounts_user;

-- User Authentication Table

CREATE TABLE accounts_user (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(128) NOT NULL,
    last_login DATETIME,
    is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
    username VARCHAR(150) NOT NULL UNIQUE,
    first_name VARCHAR(150),
    last_name VARCHAR(150),
    email VARCHAR(254) NOT NULL UNIQUE,
    is_staff BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    date_joined DATETIME NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- JWT Token Blacklist Tables
CREATE TABLE token_blacklist_outstandingtoken (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(500) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    jti VARCHAR(255) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE
);

CREATE TABLE token_blacklist_blacklistedtoken (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(500) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER,
    jti VARCHAR(255) NOT NULL UNIQUE,
    outstandingtoken_id INTEGER UNIQUE,
    FOREIGN KEY (user_id) REFERENCES accounts_user(id) ON DELETE CASCADE,
    FOREIGN KEY (outstandingtoken_id) REFERENCES token_blacklist_outstandingtoken(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX idx_accounts_user_email ON accounts_user(email);
CREATE INDEX idx_accounts_user_username ON accounts_user(username);
CREATE INDEX idx_outstandingtoken_user_id ON token_blacklist_outstandingtoken(user_id);
CREATE INDEX idx_blacklistedtoken_user_id ON token_blacklist_blacklistedtoken(user_id);
CREATE INDEX idx_outstandingtoken_jti ON token_blacklist_outstandingtoken(jti);
CREATE INDEX idx_outstandingtoken_expires_at ON token_blacklist_outstandingtoken(expires_at);

-- Sample Data (for testing)
INSERT INTO accounts_user (username, email, full_name, password, is_active, date_joined, created_at, updated_at) 
VALUES ('johndoe', 'john@example.com', 'John Doe', 'hashed_password_here', TRUE, NOW(), NOW(), NOW());

INSERT INTO accounts_user (username, email, full_name, password, is_active, date_joined, created_at, updated_at) 
VALUES ('janedoe', 'jane@example.com', 'Jane Doe', 'hashed_password_here', TRUE, NOW(), NOW(), NOW());

-- Capsule Tables
CREATE TABLE capsule (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    message TEXT NOT NULL,
    creator_id INTEGER NOT NULL,
    is_private BOOLEAN NOT NULL DEFAULT TRUE,
    pin_lock VARCHAR(4), -- 4-digit PIN
    unlock_date DATETIME NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_sealed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES accounts_user(id) ON DELETE CASCADE
);

CREATE TABLE capsule_recipient (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    capsule_id INTEGER NOT NULL,
    email VARCHAR(254) NOT NULL,
    is_notified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (capsule_id) REFERENCES capsule(id) ON DELETE CASCADE
);

CREATE TABLE capsule_attachment (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    capsule_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    uploaded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (capsule_id) REFERENCES capsule(id) ON DELETE CASCADE
);

-- Indexes for capsule tables
CREATE INDEX idx_capsule_creator_id ON capsule(creator_id);
CREATE INDEX idx_capsule_unlock_date ON capsule(unlock_date);
CREATE INDEX idx_capsule_is_sealed ON capsule(is_sealed);
CREATE INDEX idx_capsule_recipient_capsule_id ON capsule_recipient(capsule_id);
CREATE INDEX idx_capsule_recipient_email ON capsule_recipient(email);
CREATE INDEX idx_capsule_attachment_capsule_id ON capsule_attachment(capsule_id);
