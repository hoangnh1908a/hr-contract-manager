CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(100) UNIQUE NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role_id` INT NOT NULL,
  `created_by` INT,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `roles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `created_by` INT,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `permissions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `code` VARCHAR(100) UNIQUE NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `created_by` INT,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `role_permissions` (
  `role_id` INT NOT NULL,
  `permission_code` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`role_id`, `permission_code`)
);

CREATE TABLE `employees` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `full_name` VARCHAR(100) NOT NULL,
  `number_id` VARCHAR(20) NOT NULL,
  `date_of_birth` VARCHAR(100) NOT NULL,
  `sex` TINYINT NOT NULL,
  `nationality` VARCHAR(100) NOT NULL,
  `place_of_origin` VARCHAR(100) NOT NULL,
  `place_of_residence` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) UNIQUE,
  `phone` VARCHAR(20),
  `department_id` INT NOT NULL,
  `position_id` VARCHAR(100),
  `hire_date` DATE NOT NULL,
  `status` TINYINT NOT NULL DEFAULT 1,
  `created_by` INT,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `departments` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `created_by` INT,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `positions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `created_by` INT,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `contract_templates` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) UNIQUE NOT NULL,
  `content` TEXT NOT NULL,
  `created_by` INT,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `contracts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `template_id` INT NOT NULL,
  `contract_status_id` TINYINT NOT NULL DEFAULT 1,
  `filled_content` TEXT NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `contract_statuses` (
  `id` TINYINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE `contract_approvals` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `contract_id` INT NOT NULL,
  `approved_by` INT NOT NULL,
  `approval_status` TINYINT NOT NULL DEFAULT 1,
  `approval_date` TIMESTAMP,
  `comments` TEXT,
  `created_by` INT NOT NULL,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `documents` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `contract_id` INT NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `created_by` INT NOT NULL,
  `uploaded_at` TIMESTAMP
);

CREATE TABLE `audit_logs` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `action` VARCHAR(255) NOT NULL,
  `table_name` VARCHAR(255),
  `record_id` INT,
  `old_value` VARCHAR(255),
  `new_value` VARCHAR(255),
  `timestamp` TIMESTAMP
);

ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

ALTER TABLE `users` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `users` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `roles` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `roles` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `permissions` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `permissions` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `role_permissions` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE;

ALTER TABLE `role_permissions` ADD FOREIGN KEY (`permission_code`) REFERENCES `permissions` (`code`) ON DELETE CASCADE;

ALTER TABLE `employees` ADD FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL;

ALTER TABLE `employees` ADD FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`) ON DELETE SET NULL;

ALTER TABLE `employees` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `employees` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `departments` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `departments` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `contract_templates` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `contract_templates` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `contracts` ADD FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

ALTER TABLE `contracts` ADD FOREIGN KEY (`template_id`) REFERENCES `contract_templates` (`id`) ON DELETE CASCADE;

ALTER TABLE `contracts` ADD FOREIGN KEY (`contract_status_id`) REFERENCES `contract_statuses` (`id`) ON DELETE CASCADE;

ALTER TABLE `contracts` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `contracts` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `contract_approvals` ADD FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE;

ALTER TABLE `contract_approvals` ADD FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

ALTER TABLE `contract_approvals` ADD FOREIGN KEY (`approval_status`) REFERENCES `contract_statuses` (`id`) ON DELETE CASCADE;

ALTER TABLE `contract_approvals` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `contract_approvals` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `documents` ADD FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ON DELETE CASCADE;

ALTER TABLE `documents` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

ALTER TABLE `audit_logs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;
