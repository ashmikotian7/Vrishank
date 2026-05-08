-- Time Capsule Database Schema
-- Generated for documentation purposes

-- Capsules table - Main capsule storage
CREATE TABLE capsules_capsule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    message TEXT NOT NULL,
    creator_id BIGINT NOT NULL,
    is_private BOOLEAN DEFAULT TRUE,
    pin_lock VARCHAR(4) CHECK (pin_lock REGEXP '^[0-9]{4}$'),
    unlock_date DATETIME NOT NULL,
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_sealed BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES auth_user(id) ON DELETE CASCADE,
    INDEX ix_capsules_capsule_created_at (created_at DESC),
    INDEX ix_capsules_capsule_creator (creator_id),
    INDEX ix_capsules_capsule_unlock_date (unlock_date)
);

-- Capsule recipients table - Email recipients for capsules
CREATE TABLE capsules_capsulerecipient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    capsule_id BIGINT NOT NULL,
    email VARCHAR(254) NOT NULL,
    is_notified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (capsule_id) REFERENCES capsules_capsule(id) ON DELETE CASCADE,
    UNIQUE KEY unique_capsule_email (capsule_id, email),
    INDEX ix_capsules_capsulerecipient_capsule (capsule_id),
    INDEX ix_capsules_capsulerecipient_email (email)
);

-- Capsule attachments table - File attachments for capsules
CREATE TABLE capsules_capsuleattachment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    capsule_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(100) NOT NULL,
    file_size INTEGER NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (capsule_id) REFERENCES capsules_capsule(id) ON DELETE CASCADE,
    INDEX ix_capsules_capsuleattachment_capsule (capsule_id),
    INDEX ix_capsules_capsuleattachment_uploaded_at (uploaded_at)
);

-- Additional indexes for performance
CREATE INDEX ix_capsules_capsule_is_private ON capsules_capsule(is_private);
CREATE INDEX ix_capsules_capsule_is_sealed ON capsules_capsule(is_sealed);
CREATE INDEX ix_capsules_capsulerecipient_is_notified ON capsules_capsulerecipient(is_notified);
