CREATE TABLE `users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `full_name` VARCHAR(100) UNIQUE NOT NULL,
  `email` VARCHAR(150) UNIQUE NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `status` TINYINT NOT NULL DEFAULT 1,
  `role_id` INT NOT NULL,
  `created_by` INT,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `roles` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `status` TINYINT NOT NULL DEFAULT 1,
  `created_by` INT,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
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
  `position_id` INT NOT NULL,
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
  `status` TINYINT NOT NULL DEFAULT 1,
  `created_by` INT,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `positions` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `status` TINYINT NOT NULL DEFAULT 1,
  `created_by` INT,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `contract_templates` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) UNIQUE NOT NULL,
  `file_name` VARCHAR(255) NOT NULL,
  `status` TINYINT NOT NULL DEFAULT 1,
  `description` VARCHAR(2000) NOT NULL,
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
  `file_name` VARCHAR(255) NOT NULL,
  `description` VARCHAR(2000) NOT NULL,
  `created_by` INT NOT NULL,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `contract_statuses` (
  `id` TINYINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(50) UNIQUE NOT NULL,
  `description` VARCHAR(2000) NOT NULL
);

CREATE TABLE `contract_approvals` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `contract_id` INT NOT NULL,
  `approved_by` INT NOT NULL,
  `approval_status` TINYINT NOT NULL DEFAULT 1,
  `approval_date` TIMESTAMP,
  `comments` VARCHAR(2000),
  `created_by` INT NOT NULL,
  `updated_by` INT,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `audit_logs` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `action` VARCHAR(255) NOT NULL,
  `table_name` VARCHAR(255),
  `record_id` INT,
  `old_value` VARCHAR(2000),
  `new_value` VARCHAR(2000),
  `timestamp` TIMESTAMP
);

CREATE TABLE `cities` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

CREATE TABLE `districts` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) UNIQUE NOT NULL,
  `city_id` INT NOT NULL,
  `created_at` TIMESTAMP,
  `updated_at` TIMESTAMP
);

# pass = 12345678

ALTER TABLE `users` ADD FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ;

ALTER TABLE `users` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `users` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `roles` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `roles` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `employees` ADD FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);

ALTER TABLE `employees` ADD FOREIGN KEY (`position_id`) REFERENCES `positions` (`id`);

ALTER TABLE `employees` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `employees` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `departments` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `departments` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `contract_templates` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `contract_templates` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `contracts` ADD FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ;

ALTER TABLE `contracts` ADD FOREIGN KEY (`template_id`) REFERENCES `contract_templates` (`id`) ;

ALTER TABLE `contracts` ADD FOREIGN KEY (`contract_status_id`) REFERENCES `contract_statuses` (`id`) ;

ALTER TABLE `contracts` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `contracts` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `contract_approvals` ADD FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`id`) ;

ALTER TABLE `contract_approvals` ADD FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ;

ALTER TABLE `contract_approvals` ADD FOREIGN KEY (`approval_status`) REFERENCES `contract_statuses` (`id`) ;

ALTER TABLE `contract_approvals` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

ALTER TABLE `contract_approvals` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

ALTER TABLE `audit_logs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);


INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Software Development', NULL, NULL, NOW(), NOW());
INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('IT Infrastructure & Support', NULL, NULL, NOW(), NOW());
INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Cybersecurity', NULL, NULL, NOW(), NOW());
INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Data Science & Analytics', NULL, NULL, NOW(), NOW());
INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Cloud Computing & DevOps', NULL, NULL, NOW(), NOW());
INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Product Management', NULL, NULL, NOW(), NOW());
INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Quality Assurance (QA) & Testing', NULL, NULL, NOW(), NOW());
INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Technical Support & Customer Service', NULL, NULL, NOW(), NOW());
INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Sales & Marketing', NULL, NULL, NOW(), NOW());
INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Human Resources (HR) & Administration', NULL, NULL, NOW(), NOW());
INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Finance & Accounting', NULL, NULL, NOW(), NOW());
INSERT INTO `departments` (`name`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Research & Development (R&D)', NULL, NULL, NOW(), NOW());


INSERT INTO `roles` (id, name, created_by, updated_by, created_at, updated_at) VALUES (1, 'admin', null, null, NOW(), NOW());
INSERT INTO `users` (id, full_name, email, password, role_id, created_by, updated_by, created_at, updated_at) VALUES (1, 'admin', 'admin@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 1, null, null, NOW(), NOW());