-- TimeCapsule Database Schema
-- Generated from Django models
-- Database: timecapsule (MySQL)

-- Create and select database
CREATE DATABASE IF NOT EXISTS timecapsule;
USE timecapsule;

-- Drop existing tables if they exist (for fresh install)
DROP TABLE IF EXISTS token_blacklist_blacklistedtoken;
DROP TABLE IF EXISTS token_blacklist_outstandingtoken;
DROP TABLE IF EXISTS sessions_session;
DROP TABLE IF EXISTS admin_logentry;
DROP TABLE IF EXISTS auth_permission;
DROP TABLE IF EXISTS auth_group_permissions;
DROP TABLE IF EXISTS auth_group;
DROP TABLE IF EXISTS django_admin_log;
DROP TABLE IF EXISTS django_content_type;
DROP TABLE IF EXISTS auth_user_user_permissions;
DROP TABLE IF EXISTS auth_user_groups;
DROP TABLE IF EXISTS auth_user;
DROP TABLE IF EXISTS django_session;
DROP TABLE IF EXISTS accounts_user_user_permissions;
DROP TABLE IF EXISTS accounts_user_groups;
DROP TABLE IF EXISTS accounts_user;
DROP TABLE IF EXISTS capsules_capsuleattachment;
DROP TABLE IF EXISTS capsules_capsulerecipient;
DROP TABLE IF EXISTS capsules_capsule;

-- Django Content Types
CREATE TABLE `django_content_type` (
    `id` int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(100) NOT NULL,
    `app_label` varchar(100) NOT NULL,
    `model` varchar(100) NOT NULL,
    UNIQUE `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`, `model`)
);

-- Auth Permissions
CREATE TABLE `auth_permission` (
    `id` int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(50) NOT NULL,
    `content_type_id` int NOT NULL,
    `codename` varchar(100) NOT NULL,
    UNIQUE `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`, `codename`),
    CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_content_type` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
);

-- Auth Groups
CREATE TABLE `auth_group` (
    `id` int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `name` varchar(150) NOT NULL UNIQUE
);

-- Auth Group Permissions
CREATE TABLE `auth_group_permissions` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `group_id` int NOT NULL,
    `permission_id` int NOT NULL,
    UNIQUE `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`, `permission_id`),
    CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
    CONSTRAINT `auth_group_permissions_permission_id_84c5c01e_fk_auth_permission` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
);

-- Custom User Model (accounts.User)
CREATE TABLE `accounts_user` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `password` varchar(128) NOT NULL,
    `last_login` datetime(6) NULL,
    `is_superuser` bool NOT NULL,
    `username` varchar(150) NOT NULL UNIQUE,
    `first_name` varchar(150) NOT NULL,
    `last_name` varchar(150) NOT NULL,
    `is_staff` bool NOT NULL,
    `is_active` bool NOT NULL,
    `date_joined` datetime(6) NOT NULL,
    `email` varchar(254) NOT NULL UNIQUE,
    `full_name` varchar(100) NOT NULL,
    `created_at` datetime(6) NOT NULL,
    `updated_at` datetime(6) NOT NULL
);

-- User Groups
CREATE TABLE `accounts_user_groups` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` bigint NOT NULL,
    `group_id` int NOT NULL,
    UNIQUE `accounts_user_groups_user_id_group_id_59c0b32f_uniq` (`user_id`, `group_id`),
    CONSTRAINT `accounts_user_groups_user_id_52b62117_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`),
    CONSTRAINT `accounts_user_groups_group_id_bd11a704_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
);

-- User Permissions
CREATE TABLE `accounts_user_user_permissions` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `user_id` bigint NOT NULL,
    `permission_id` int NOT NULL,
    UNIQUE `accounts_user_user_permi_user_id_permission_id_2ab516c2_uniq` (`user_id`, `permission_id`),
    CONSTRAINT `accounts_user_user_p_user_id_e4f0a161_fk_accounts_` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`),
    CONSTRAINT `accounts_user_user_p_permission_id_113bb443_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`)
);

-- Capsule Model
CREATE TABLE `capsules_capsule` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `title` varchar(200) NOT NULL,
    `description` longtext NOT NULL,
    `message` longtext NOT NULL,
    `is_private` bool NOT NULL,
    `pin_lock` varchar(4) NOT NULL,
    `unlock_date` datetime(6) NOT NULL,
    `timezone` varchar(50) NOT NULL,
    `is_sealed` bool NOT NULL,
    `created_at` datetime(6) NOT NULL,
    `updated_at` datetime(6) NOT NULL,
    `creator_id` bigint NOT NULL,
    CONSTRAINT `capsules_capsule_creator_id_9986bbba_fk_accounts_user_id` FOREIGN KEY (`creator_id`) REFERENCES `accounts_user` (`id`)
);

-- Capsule Attachments
CREATE TABLE `capsules_capsuleattachment` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `file_name` varchar(255) NOT NULL,
    `file_path` varchar(100) NOT NULL,
    `file_size` int NOT NULL,
    `file_type` varchar(100) NOT NULL,
    `uploaded_at` datetime(6) NOT NULL,
    `capsule_id` bigint NOT NULL,
    CONSTRAINT `capsules_capsuleatta_capsule_id_8018ff3c_fk_capsules_` FOREIGN KEY (`capsule_id`) REFERENCES `capsules_capsule` (`id`)
);

-- Capsule Recipients
CREATE TABLE `capsules_capsulerecipient` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `email` varchar(254) NOT NULL,
    `is_notified` bool NOT NULL,
    `created_at` datetime(6) NOT NULL,
    `capsule_id` bigint NOT NULL,
    UNIQUE `capsules_capsulerecipient_capsule_id_email_953d1ea0_uniq` (`capsule_id`, `email`),
    CONSTRAINT `capsules_capsulereci_capsule_id_3f950692_fk_capsules_` FOREIGN KEY (`capsule_id`) REFERENCES `capsules_capsule` (`id`)
);

-- Django Admin Log
CREATE TABLE `django_admin_log` (
    `id` int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `action_time` datetime(6) NOT NULL,
    `object_id` longtext,
    `object_repr` varchar(200) NOT NULL,
    `action_flag` smallint NOT NULL,
    `change_message` longtext NOT NULL,
    `content_type_id` int NULL,
    `user_id` bigint NOT NULL,
    CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_content_type` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
    CONSTRAINT `django_admin_log_user_id_c564eba0_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`)
);

-- Django Sessions
CREATE TABLE `django_session` (
    `session_key` varchar(40) NOT NULL PRIMARY KEY,
    `session_data` longtext NOT NULL,
    `expire_date` datetime(6) NOT NULL
);

-- JWT Token Blacklist - Outstanding Tokens
CREATE TABLE `token_blacklist_outstandingtoken` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `jti` varchar(255) NOT NULL UNIQUE,
    `token` longtext NOT NULL,
    `created_at` datetime(6) NOT NULL,
    `expires_at` datetime(6) NOT NULL,
    `user_id` bigint NOT NULL,
    CONSTRAINT `token_blacklist_out_user_id_997874e6_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`)
);

-- JWT Token Blacklist - Blacklisted Tokens
CREATE TABLE `token_blacklist_blacklistedtoken` (
    `id` bigint AUTO_INCREMENT NOT NULL PRIMARY KEY,
    `token` longtext NOT NULL,
    `blacklisted_at` datetime(6) NOT NULL,
    `user_id` bigint NOT NULL,
    `outstandingtoken_id` bigint NOT NULL UNIQUE,
    CONSTRAINT `token_blacklist_b_user_id_5c70d5d8_fk_accounts_user_id` FOREIGN KEY (`user_id`) REFERENCES `accounts_user` (`id`),
    CONSTRAINT `token_blacklist_b_outstandingtoken_id_6bdf2e2b_fk_token_black` FOREIGN KEY (`outstandingtoken_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
);

-- Create Indexes for better performance
CREATE INDEX `accounts_user_email_idx` ON `accounts_user` (`email`);
CREATE INDEX `accounts_user_username_idx` ON `accounts_user` (`username`);
CREATE INDEX `capsules_capsule_creator_id_idx` ON `capsules_capsule` (`creator_id`);
CREATE INDEX `capsules_capsule_unlock_date_idx` ON `capsules_capsule` (`unlock_date`);
CREATE INDEX `capsules_capsule_is_private_idx` ON `capsules_capsule` (`is_private`);
CREATE INDEX `capsules_capsulerecipient_email_idx` ON `capsules_capsulerecipient` (`email`);
CREATE INDEX `capsules_capsulerecipient_capsule_id_idx` ON `capsules_capsulerecipient` (`capsule_id`);
CREATE INDEX `capsules_capsuleattachment_capsule_id_idx` ON `capsules_capsuleattachment` (`capsule_id`);
CREATE INDEX `token_blacklist_outstandingtoken_jti_idx` ON `token_blacklist_outstandingtoken` (`jti`);
CREATE INDEX `token_blacklist_outstandingtoken_user_id_idx` ON `token_blacklist_outstandingtoken` (`user_id`);
CREATE INDEX `token_blacklist_blacklistedtoken_user_id_idx` ON `token_blacklist_blacklistedtoken` (`user_id`);
CREATE INDEX `django_session_session_key_idx` ON `django_session` (`session_key`);
CREATE INDEX `django_session_expire_date_idx` ON `django_session` (`expire_date`);

-- Insert default content types (simplified)
INSERT INTO `django_content_type` (`name`, `app_label`, `model`) VALUES
('permission', 'auth', 'permission'),
('group', 'auth', 'group'),
('user', 'auth', 'user'),
('content type', 'contenttypes', 'contenttype'),
('session', 'sessions', 'session'),
('log entry', 'admin', 'logentry'),
('user', 'accounts', 'user'),
('capsule', 'capsules', 'capsule'),
('capsule attachment', 'capsules', 'capsuleattachment'),
('capsule recipient', 'capsules', 'capsulerecipient'),
('outstanding token', 'token_blacklist', 'outstandingtoken'),
('blacklisted token', 'token_blacklist', 'blacklistedtoken');

-- Database creation complete
SELECT 'TimeCapsule database schema created successfully!' as status;
