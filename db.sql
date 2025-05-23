    CREATE TABLE `users` (
      `id` INT PRIMARY KEY AUTO_INCREMENT,
      `full_name` VARCHAR(100) NOT NULL,
      `email` VARCHAR(150) UNIQUE NOT NULL,
      `password` VARCHAR(255) NOT NULL,
      `password_fail_count` INT NOT NULL DEFAULT 0,
      `force_password_change_on_login` INT NOT NULL DEFAULT 0,
      `password_expiry_date` TIMESTAMP,
      `lockout_time` TIMESTAMP,
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
      `name_en` VARCHAR(100) UNIQUE NOT NULL,
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
      `salary` VARCHAR(100) NOT NULL,
      `salary_allowance` VARCHAR(100) NOT NULL,
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
      `name_en` VARCHAR(100) UNIQUE NOT NULL,
      `status` TINYINT NOT NULL DEFAULT 1,
      `created_by` INT,
      `updated_by` INT,
      `created_at` TIMESTAMP,
      `updated_at` TIMESTAMP
    );

    CREATE TABLE `positions` (
      `id` INT PRIMARY KEY AUTO_INCREMENT,
      `name` VARCHAR(100) UNIQUE NOT NULL,
      `name_en` VARCHAR(100) UNIQUE NOT NULL,
      `status` TINYINT NOT NULL DEFAULT 1,
      `created_by` INT,
      `updated_by` INT,
      `created_at` TIMESTAMP,
      `updated_at` TIMESTAMP
    );

    CREATE TABLE `contract_templates` (
      `id` INT PRIMARY KEY AUTO_INCREMENT,
      `file_name` VARCHAR(255) UNIQUE NOT NULL,
      `file_name_en` VARCHAR(100) UNIQUE NOT NULL,
      `file_path` VARCHAR(500) NOT NULL,
      `params` VARCHAR(2000) NOT NULL,
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
      `contract_template_id` INT NOT NULL,
      `contract_status_id` TINYINT NOT NULL DEFAULT 1,
      `contract_type` VARCHAR(255) NOT NULL DEFAULT '12',
      `file_name` VARCHAR(255) NOT NULL,
      `file_name_en` VARCHAR(100) UNIQUE NOT NULL,
      `file_path` VARCHAR(255) NOT NULL,
      `description` VARCHAR(2000),
      `created_by` INT NOT NULL,
      `updated_by` INT,
      `created_at` TIMESTAMP,
      `updated_at` TIMESTAMP
    );

    CREATE TABLE `configs` (
      `id` TINYINT PRIMARY KEY AUTO_INCREMENT,
      `type` VARCHAR(50) NOT NULL,
      `code` VARCHAR(50) NOT NULL,
      `name` VARCHAR(255) NOT NULL,
      `name_en` VARCHAR(255) NOT NULL,
      `description` VARCHAR(2000) NOT NULL,
      `status` TINYINT NOT NULL DEFAULT 1,
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

    ALTER TABLE `contracts` ADD FOREIGN KEY (`contract_template_id`) REFERENCES `contract_templates` (`id`) ;

    ALTER TABLE `contracts` ADD FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

    ALTER TABLE `contracts` ADD FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`);

    ALTER TABLE `audit_logs` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

    CREATE INDEX idx_email ON users (email);


    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Software Development','Software Development', NULL, NULL, NOW(), NOW());
    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('IT Infrastructure & Support', 'IT Infrastructure & Support', NULL, NULL, NOW(), NOW());
    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Cybersecurity','Cybersecurity', NULL, NULL, NOW(), NOW());
    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Data Science & Analytics','Data Science & Analytics', NULL, NULL, NOW(), NOW());
    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Cloud Computing & DevOps','Cloud Computing & DevOps', NULL, NULL, NOW(), NOW());
    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Product Management','Product Management', NULL, NULL, NOW(), NOW());
    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Quality Assurance (QA) & Testing','Quality Assurance (QA) & Testing', NULL, NULL, NOW(), NOW());
    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Technical Support & Customer Service','Technical Support & Customer Service', NULL, NULL, NOW(), NOW());
    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Sales & Marketing','Sales & Marketing', NULL, NULL, NOW(), NOW());
    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Human Resources (HR) & Administration', 'Human Resources (HR) & Administration', NULL, NULL, NOW(), NOW());
    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Finance & Accounting','Finance & Accounting', NULL, NULL, NOW(), NOW());
    INSERT INTO `departments` (`name`,`name_en`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES ('Research & Development (R&D)','Research & Development (R&D)', NULL, NULL, NOW(), NOW());


    INSERT INTO `roles` (id, name, name_en, created_by, updated_by, created_at, updated_at) VALUES (1, 'Quản lý','ADMIN', null, null, NOW(), NOW());
INSERT INTO `roles` (id, name, name_en, created_by, updated_by, created_at, updated_at)
VALUES (2,'HR','HR', null, null, NOW(), NOW());
INSERT INTO `roles` (id,name, name_en, created_by, updated_by, created_at, updated_at)
VALUES (3,'Trưởng phòng','MANAGER', null, null, NOW(), NOW());
# pass 12345678
INSERT INTO `users` (id, full_name, email, password, password_fail_count, force_password_change_on_login, password_expiry_date, lockout_time, role_id, created_by, updated_by, created_at, updated_at)
VALUES (1, 'Admin', 'admin@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 1, null, null, NOW(), NOW());


INSERT INTO positions (name, name_en, status, created_by, updated_by, created_at, updated_at)
VALUES ('Giám đốc marketing', 'Chief Marketing Officer', 1, null, null, NOW(), NOW());

INSERT INTO positions (name, name_en, status, created_by, updated_by, created_at, updated_at)
VALUES ('Trưởng phòng kỹ thuật', 'Head of Engineering', 1, null, null, NOW(), NOW());

INSERT INTO positions (name, name_en, status, created_by, updated_by, created_at, updated_at)
VALUES ('Quản lý dự án', 'Project Manager', 1, null, null, NOW(), NOW());

INSERT INTO positions (name, name_en, status, created_by, updated_by, created_at, updated_at)
VALUES ('Chuyên viên tài chính', 'Finance Specialist', 1, null, null, NOW(), NOW());

INSERT INTO positions (name, name_en, status, created_by, updated_by, created_at, updated_at)
VALUES ('Nhân viên bán hàng', 'Sales Representative', 1, null, null, NOW(), NOW());

INSERT INTO positions (name, name_en, status, created_by, updated_by, created_at, updated_at)
VALUES ('Chuyên viên hỗ trợ khách hàng', 'Customer Support Specialist', 1, null, null, NOW(), NOW());

INSERT INTO positions (name, name_en, status, created_by, updated_by, created_at, updated_at)
VALUES ('Nhà phân tích dữ liệu', 'Data Analyst', 1, null, null, NOW(), NOW());

INSERT INTO positions (name, name_en, status, created_by, updated_by, created_at, updated_at)
VALUES ('Chuyên viên thiết kế UX/UI', 'UX/UI Designer', 1, null, null, NOW(), NOW());

INSERT INTO positions (name, name_en, status, created_by, updated_by, created_at, updated_at)
VALUES ('Trợ lý hành chính', 'Administrative Assistant', 1, null, null, NOW(), NOW());

INSERT INTO positions (name, name_en, status, created_by, updated_by, created_at, updated_at)
VALUES ('Quản lý kho', 'Warehouse Manager', 1, null, null, NOW(), NOW());


# import database
INSERT INTO `users` (full_name, email, password, password_fail_count, force_password_change_on_login, password_expiry_date, lockout_time, role_id, created_by, updated_by, created_at, updated_at) VALUES
('Trần Thị Bình', 'binh.tran@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lê Hoàng Cường', 'cuong.le@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phạm Thu Diễm', 'diem.pham@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Hoàng Minh Đức', 'duc.hoang@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Vũ Ngọc Hà', 'ha.vu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Đặng Văn Huy', 'huy.dang@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Bùi Thị Kim', 'kim.bui@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Trương Công Liêm', 'liem.truong@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Đỗ Thị Mai', 'mai.do@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phan Văn Nam', 'nam.phan@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lý Thị Oanh', 'oanh.ly@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ngô Sỹ Phúc', 'phuc.ngo@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Tạ Thị Quỳnh', 'quynh.ta@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Cao Xuân Sơn', 'son.cao@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Võ Thị Thảo', 'thao.vo@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Đinh Tiến Tú', 'tu.dinh@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Huỳnh Thị Uyên', 'uyen.huynh@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lưu Văn Việt', 'viet.luu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Mai Thị Xuân', 'xuan.mai@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phùng Văn Yên', 'yen.phung@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Trịnh Thị Ánh', 'anh.trinh@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Bạch Công Bắc', 'bac.bach@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Chu Thị Cẩm', 'cam.chu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Dương Văn Chiến', 'chien.duong@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Giang Thị Dung', 'dung.giang@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Hà Văn Giang', 'giang.ha@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Khúc Thị Hạnh', 'hanh.khuc@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lê Bá Hiếu', 'hieu.le@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Mai Thị Hoa', 'hoa.mai@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Nguyễn Sỹ Hoàng', 'hoang.nguyen@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phạm Thị Hương', 'huong.pham@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Trần Văn Khải', 'khai.tran@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lê Thị Lan', 'lan.le@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ngô Văn Long', 'long.ngo@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phan Thị Mến', 'men.phan@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Hoàng Văn Nam', 'nam.hoang@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Vũ Thị Oanh', 'oanh.vu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Đặng Văn Phát', 'phat.dang@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Bùi Thị Phương', 'phuong.bui@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Trương Công Quốc', 'quoc.truong@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Đỗ Thị Quỳnh', 'quynh.do@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phan Văn Sơn', 'son.phan@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lý Thị Thủy', 'thuy.ly@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ngô Sỹ Toàn', 'toan.ngo@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Tạ Thị Trúc', 'truc.ta@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Cao Xuân Vinh', 'vinh.cao@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Võ Thị Xuân', 'xuan.vo@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Đinh Khắc Yến', 'yen.dinh@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Hồ Thị Ý', 'y.ho@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Kha Văn Ẩn', 'an.kha@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lâm Bảo Ân', 'an.lam@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Mạc Thị Ái', 'ai.mac@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Nhâm Mạnh Bảo', 'bao.nham@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ôn Thị Bạch', 'bach.on@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phan Thanh Bình', 'binh.phan@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Quách Thị Bích', 'bich.quach@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ra Chánh Chính', 'chinh.ra@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Sa Như Chung', 'chung.sa@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Tạ Quang Chương', 'chuong.ta@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ung Văn Dũng', 'dung.ung@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Vưu Thị Dương', 'duong.vuu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Xa Thị Đoan', 'doan.xa@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ỷ Lan Gia', 'gia.y@company.com','$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Điêu Chính Giảng', 'giang.dieu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Hà Thị Gấm', 'gam.ha@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Kiều Thanh Hà', 'ha.kieu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lò Văn Hạnh', 'hanh.lo@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Mộng Hoài Hương', 'huong.mong@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Nghiêm Xuân Huy', 'huy.nghiem@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phi Thị Huyền', 'huyen.phi@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Quách Tuấn Khải', 'khai.quach@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lương Thị Kiều', 'kieu.luong@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ma Văn Lâm', 'lam.ma@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Nguyễn Cao Liên', 'lien.nguyen@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ôn Bích Liễu', 'lieu.on@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phan Cảnh Lộc', 'loc.phan@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Quách Thị Lụa', 'lua.quach@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ra Chánh Lượng', 'luong.ra@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Sa Như Lý', 'ly.sa@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Tạ Quang Mẫn', 'man.ta@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ung Văn Mạnh', 'manh.ung@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Vưu Thị Mận', 'man.vuu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Xa Thị Miên', 'mien.xa@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ỷ Lan Mỹ', 'my.y@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Điêu Chính Mỵ', 'my.dieu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Hà Thị Nga', 'nga.ha@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Kiều Thanh Ngân', 'ngan.kieu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lò Văn Ngọc', 'ngoc.lo@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Mộng Hoài Nguyên', 'nguyen.mong@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Nghiêm Xuân Nhi', 'nhi.nghiem@company.com','$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phi Thị Nhung', 'nhung.phi@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Quách Tuấn Oanh', 'oanh.quach@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lương Thị Phương', 'phuong.luong@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ma Văn Quang', 'quang.ma@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Nguyễn Cao Quỳnh', 'quynh.nguyen@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ôn Bích Quyên', 'quyen.on@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phan Cảnh San', 'san.phan@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Quách Thị Sương', 'suong.quach@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ra Chánh Tài', 'tai.ra@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Sa Như Thảo', 'thao.sa@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Tạ Quang Thiện', 'thien.ta@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ung Văn Thông', 'thong.ung@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Vưu Thị Thương', 'thuong.vuu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Xa Thị Thắm', 'tham.xa@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ỷ Lan Trâm', 'tram.y@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Điêu Chính Trà', 'tra.dieu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Hà Thị Trúc', 'truc.ha@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Kiều Thanh Tú', 'tu.kieu@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lò Văn Tùng', 'tung.lo@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Mộng Hoài Uyên', 'uyen.mong@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Nghiêm Xuân Vân', 'van.nghiem@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phi Thị Vy', 'vy.phi@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Quách Tuấn Vỹ', 'vy.quach@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lương Thị Xuyến', 'xuyen.luong@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ma Văn Yên', 'yen.ma@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Nguyễn Cao Ý', 'y.nguyen@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ôn Bích Ái', 'ai.on@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Phan Cảnh Ân', 'an.phan@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Quách Thị Ẩm', 'am.quach@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Ra Chánh Ập', 'ap.ra@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Sa Như Ất', 'at.sa@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Tạ Quang Ạch', 'ach.ta@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW());


INSERT INTO users (full_name, email, password, password_fail_count, force_password_change_on_login, password_expiry_date, lockout_time, role_id, created_by, updated_by, created_at, updated_at) VALUES
('Tạ Quang Ạch', 'ach.ta1@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 1, null, null, NOW(), NOW()),
('Trần Thị Bình', 'binh.tran1@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Lê Hoàng Cường', 'cuong.le1@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 2, null, null, NOW(), NOW()),
('Trương Công Liêm', 'liem.truong1@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 3, null, null, NOW(), NOW()),
('Đỗ Thị Mai', 'mai.do1@company.com', '$2a$10$3OCVxm2GfbqcyWTOu3GxQe2dZKNeA/ZegR0r/XSCYy1u2vBIbBiRK', 0, 0, null, null, 3, null, null, NOW(), NOW());


INSERT INTO employees (full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, email, phone, department_id, position_id, hire_date, salary, salary_allowance, created_by, updated_by, created_at, updated_at) VALUES
('Nguyễn Văn An', '123456789', '1990-05-15', 0, 'Vietnam', 'Hanoi', 'Hanoi', 'an.nguyen@gmail.com', '0912345678', 1, 3, '2023-01-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Trần Thị Bình', '987654321', '1992-08-20', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', 'binh.tran@gmail.com', '0987654321', 2, 3, '2023-02-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Lê Hoàng Cường', '234567890', '1988-03-10', 0, 'Vietnam', 'Da Nang', 'Da Nang', 'cuong.le@gmail.com', '0934567890', 3, 3, '2023-03-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Phạm Thu Diễm', '876543210', '1995-11-05', 1, 'Vietnam', 'Can Tho', 'Can Tho', 'diem.pham@gmail.com', '0976543210', 4, 3, '2023-04-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Hoàng Minh Đức', '345678901', '1991-06-22', 0, 'Vietnam', 'Hai Phong', 'Hai Phong', 'duc.hoang@gmail.com', '0923456789', 5, 3, '2023-05-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Vũ Ngọc Hà', '765432109', '1993-09-18', 1, 'Vietnam', 'Hue', 'Hue', 'ha.vu@gmail.com', '0965432109', 6, 3, '2023-06-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Đặng Văn Huy', '456789012', '1989-01-28', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', 'huy.dang@gmail.com', '0945678901', 7, 3, '2023-07-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Bùi Thị Kim', '654321098', '1996-04-12', 1, 'Vietnam', 'Vung Tau', 'Vung Tau', 'kim.bui@gmail.com', '0954321098', 8, 3, '2023-08-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Trương Công Liêm', '567890123', '1994-07-08', 0, 'Vietnam', 'Da Lat', 'Da Lat', 'liem.truong@gmail.com', '0905678901', 9, 3, '2023-09-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Đỗ Thị Mai', '543210987', '1997-12-03', 1, 'Vietnam', 'Phu Quoc', 'Phu Quoc', 'mai.do@gmail.com', '0915432109', 10, 3, '2023-10-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Phan Văn Nam', '678901234', '1987-02-14', 0, 'Vietnam', 'Can Tho', 'Can Tho', 'nam.phan@gmail.com', '0926789012', 1, 3, '2023-01-15','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Lý Thị Oanh', '432109876', '1998-05-29', 1, 'Vietnam', 'Vung Tau', 'Vung Tau', 'oanh.ly@gmail.com', '0984321098', 2, 3, '2023-02-15','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Ngô Sỹ Phúc', '789012345', '1993-10-24', 0, 'Vietnam', 'Da Nang', 'Da Nang', 'phuc.ngo@gmail.com', '0937890123', 3, 3, '2023-03-15','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Tạ Thị Quỳnh', '321098765', '1992-08-01', 1, 'Vietnam', 'Hai Phong', 'Hai Phong', 'quynh.ta@gmail.com', '0973210987', 4, 3, '2023-04-15','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Cao Xuân Sơn', '890123456', '1991-03-07', 0, 'Vietnam', 'Hanoi', 'Hanoi', 'son.cao@gmail.com', '0928901234', 5, 3, '2023-05-15','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Võ Thị Thảo', '210987654', '1999-06-11', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', 'thao.vo@gmail.com', '0962109876', 6, 3, '2023-06-15','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Đinh Tiến Tú', '901234567', '1990-01-19', 0, 'Vietnam', 'Hue', 'Hue', 'tu.dinh@gmail.com', '0949012345', 7, 3, '2023-07-15','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Huỳnh Thị Uyên', '109876543', '1994-04-05', 1, 'Vietnam', 'Nha Trang', 'Nha Trang', 'uyen.huynh@gmail.com', '0951098765', 8, 3, '2023-08-15','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Lưu Văn Việt', '012345678', '1986-09-27', 0, 'Vietnam', 'Da Lat', 'Da Lat', 'viet.luu@gmail.com', '0900123456', 9, 3, '2023-09-15','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Mai Thị Xuân', '987654320', '1997-11-30', 1, 'Vietnam', 'Phu Quoc', 'Phu Quoc', 'xuan.mai@gmail.com', '0919876540', 10, 3, '2023-10-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Phùng Văn Yên', '876543219', '1995-07-17', 0, 'Vietnam', 'Hanoi', 'Hanoi', 'yen.phung@gmail.com', '0928765439', 1, 3, '2023-11-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Trịnh Thị Ánh', '765432108', '1998-10-12', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', 'anh.trinh@gmail.com', '0967654328', 2, 3, '2023-12-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Bạch Công Bắc', '654321097', '1992-02-22', 0, 'Vietnam', 'Da Nang', 'Da Nang', 'bac.bach@gmail.com', '0956543217', 3, 3, '2024-01-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Chu Thị Cẩm', '543210986', '1991-04-08', 1, 'Vietnam', 'Can Tho', 'Can Tho', 'cam.chu@gmail.com', '0905432106', 4, 3, '2024-02-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Dương Văn Chiến', '432109875', '1996-09-03', 0, 'Vietnam', 'Hai Phong', 'Hai Phong', 'chien.duong@gmail.com', '0914321095', 5, 3, '2024-03-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Giang Thị Dung', '321098764', '1993-12-28', 1, 'Vietnam', 'Hue', 'Hue', 'dung.giang@gmail.com', '0973210984', 6, 3, '2024-04-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Hà Văn Giang', '210987653', '1990-03-17', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', 'giang.ha@gmail.com', '0922109873', 7, 3, '2024-05-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Khúc Thị Hạnh', '109876542', '1997-08-10', 1, 'Vietnam', 'Vung Tau', 'Vung Tau', 'hanh.khuc@gmail.com', '0961098762', 8, 3, '2024-06-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Lê Bá Hiếu', '098765431', '1989-01-05', 0, 'Vietnam', 'Da Lat', 'Da Lat', 'hieu.le@gmail.com', '0940987651', 9, 3, '2024-07-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Mai Thị Hoa', '987654329', '1994-06-30', 1, 'Vietnam', 'Phu Quoc', 'Phu Quoc', 'hoa.mai@gmail.com', '0919876549', 10, 3, '2024-08-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Nguyễn Sỹ Hoàng', '876543218', '1996-11-25', 0, 'Vietnam', 'Hanoi', 'Hanoi', 'hoang.nguyen@gmail.com', '0928765438', 1, 3, '2024-09-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Phạm Thị Hương', '765432107', '1992-05-14', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', 'huong.pham@gmail.com', '0967654327', 2, 3, '2024-10-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Trần Văn Khải', '654321096', '1991-07-09', 0, 'Vietnam', 'Da Nang', 'Da Nang', 'khai.tran@gmail.com', '0956543216', 3, 3, '2024-11-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Lê Thị Lan', '543210985', '1998-12-04', 1, 'Vietnam', 'Can Tho', 'Can Tho', 'lan.le@gmail.com', '0905432105', 4, 3, '2024-12-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Ngô Văn Long', '432109874', '1993-02-18', 0, 'Vietnam', 'Hai Phong', 'Hai Phong', 'long.ngo@gmail.com', '0914321094', 5, 3, '2025-01-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Phan Thị Mến', '321098763', '1990-04-03', 1, 'Vietnam', 'Hue', 'Hue', 'men.phan@gmail.com', '0973210983', 6, 3, '2025-02-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Hoàng Văn Nam', '210987652', '1997-09-29', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', 'nam.hoang@gmail.com', '0922109872', 7, 3, '2025-03-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Vũ Thị Oanh', '109876541', '1989-01-24', 1, 'Vietnam', 'Vung Tau', 'Vung Tau', 'oanh.vu@gmail.com', '0961098761', 8, 3, '2025-04-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Đặng Văn Phát', '098765430', '1995-06-16', 0, 'Vietnam', 'Da Lat', 'Da Lat', 'phat.dang@gmail.com', '0940987650', 9, 3, '2025-05-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Bùi Thị Phương', '987654328', '1998-11-11', 1, 'Vietnam', 'Phu Quoc', 'Phu Quoc', 'phuong.bui@gmail.com', '0919876548', 10, 3, '2025-06-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Trương Công Quốc', '876543217', '1992-05-08', 0, 'Vietnam', 'Hanoi', 'Hanoi', 'quoc.truong@gmail.com', '0928765437', 1, 3, '2025-07-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Đỗ Thị Quỳnh', '765432106', '1991-07-03', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', 'quynh.do@gmail.com', '0967654326', 2, 3, '2025-08-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Phan Văn Sơn', '654321095', '1996-12-29', 0, 'Vietnam', 'Da Nang', 'Da Nang', 'son.phan@gmail.com', '0956543215', 3, 3, '2025-09-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Lý Thị Thủy', '543210984', '1993-02-13', 1, 'Vietnam', 'Can Tho', 'Can Tho', 'thuy.ly@gmail.com', '0905432104', 4, 3, '2025-10-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Ngô Sỹ Toàn', '432109873', '1990-04-02', 0, 'Vietnam', 'Hai Phong', 'Hai Phong', 'toan.ngo@gmail.com', '0914321093', 5, 3, '2025-11-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Tạ Thị Trúc', '321098762', '1997-09-28', 1, 'Vietnam', 'Hue', 'Hue', 'truc.ta@gmail.com', '0973210982', 6, 3, '2025-12-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Cao Xuân Vinh', '210987651', '1989-01-23', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', 'vinh.cao@gmail.com', '0922109871', 7, 3, '2026-01-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Võ Thị Xuân', '109876540', '1994-06-15', 1, 'Vietnam', 'Vung Tau', 'Vung Tau', 'xuan.vo@gmail.com', '0961098760', 8, 3, '2026-02-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Đinh Khắc Yến', '098765429', '1996-11-10', 0, 'Vietnam', 'Da Lat', 'Da Lat', 'yen.dinh@gmail.com', '0940987649', 9, 3, '2026-03-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Hồ Thị Ý', '987654319', '1992-05-07', 1, 'Vietnam', 'Phu Quoc', 'Phu Quoc', 'y.ho@gmail.com', '0919876539', 10, 3, '2026-04-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Kha Văn Ẩn', '876543209', '1991-07-02', 0, 'Vietnam', 'Hanoi', 'Hanoi', 'an.kha@gmail.com', '0928765429', 1, 3, '2026-05-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Lâm Bảo Ân', '765432198', '1998-12-27', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', 'an.lam@gmail.com', '0967654318', 2, 3, '2026-06-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Mạc Thị Ái', '654321087', '1993-02-17', 1, 'Vietnam', 'Da Nang', 'Da Nang', 'ai.mac@gmail.com', '0956543207', 3, 3, '2026-07-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Nhâm Mạnh Bảo', '543210976', '1990-04-02', 0, 'Vietnam', 'Can Tho', 'Can Tho', 'bao.nham@gmail.com', '0905432096', 4, 3, '2026-08-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Ôn Thị Bạch', '432109865', '1997-09-27', 1, 'Vietnam', 'Hai Phong', 'Hai Phong', 'bach.on@gmail.com', '0914320985', 5, 3, '2026-09-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Phan Thanh Bình', '321098754', '1989-01-22', 0, 'Vietnam', 'Hue', 'Hue', 'binh.phan@gmail.com', '0973209874', 6, 3, '2026-10-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Quách Thị Bích', '210987643', '1995-06-14', 1, 'Vietnam', 'Nha Trang', 'Nha Trang', 'bich.quach@gmail.com', '0922098753', 7, 3, '2026-11-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Ra Chánh Chính', '109876532', '1998-11-09', 0, 'Vietnam', 'Vung Tau', 'Vung Tau', 'chinh.ra@gmail.com', '0961098742', 8, 3, '2026-12-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Sa Như Chung', '098765421', '1992-05-06', 1, 'Vietnam', 'Da Lat', 'Da Lat', 'chung.sa@gmail.com', '0940987631', 9, 3, '2027-01-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Tạ Quang Chương', '987654310', '1994-07-01', 0, 'Vietnam', 'Phu Quoc', 'Phu Quoc', 'chuong.ta@gmail.com', '0919876530', 10, 3, '2027-02-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Ung Văn Dũng', '876543200', '1996-12-26', 0, 'Vietnam', 'Hanoi', 'Hanoi', 'dung.ung@gmail.com', '0928765420', 1, 3, '2027-03-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Vưu Thị Dương', '765432189', '1993-02-16', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', 'duong.vuu@gmail.com', '0967654309', 2, 3, '2027-04-01','6,000,000','5,000,000', null, null, NOW(), NOW()),
('Xa Thị Đoan', '654321078', '1990-04-01', 1, 'Vietnam', 'Da Nang', 'Da Nang', 'doan.xa@gmail.com', '0956543198', 3, 3, '2027-05-01','6,000,000','5,000,000', null, null, NOW(), NOW());


INSERT INTO employees (full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, email, phone, department_id, position_id, hire_date, salary, salary_allowance, created_by, updated_by, created_at, updated_at) VALUES
('Trần Thị Bình', '987654321', '1992-08-20', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', 'binh.tran@yahoo.com', '0987654321', 2, 4, '2023-02-15','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Lê Hoàng Cường', '456789123', '1988-12-10', 0, 'Vietnam', 'Da Nang', 'Da Nang', 'cuong.le@outlook.com', '0901234567', 3, 4, '2023-03-22','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Phạm Thu Dung', '789123456', '1995-03-25', 1, 'Vietnam', 'Hai Phong', 'Hai Phong', 'dung.pham@gmail.com', '0934567890', 1, 4, '2023-04-05','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Hoàng Minh Đức', '654321987', '1991-07-01', 0, 'Vietnam', 'Can Tho', 'Can Tho', 'duc.hoang@yahoo.com', '0967890123', 2, 4, '2023-05-18','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Vũ Thị Ngọc', '321987654', '1993-11-30', 1, 'Vietnam', 'Hue', 'Hue', 'ngoc.vu@outlook.com', '0978901234', 3, 4, '2023-06-25','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Đỗ Văn Hùng', '890123456', '1989-09-12', 0, 'Vietnam', 'Vung Tau', 'Vung Tau', 'hung.do@gmail.com', '0945678901', 1, 4, '2023-07-08','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Nguyễn Thị Lan', '234567890', '1994-01-08', 1, 'Vietnam', 'Quang Ninh', 'Quang Ninh', 'lan.nguyen@yahoo.com', '0923456789', 2, 4, '2023-08-12','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Trần Thanh Mạnh', '567890123', '1987-06-22', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', 'manh.tran@outlook.com', '0956789012', 3, 4, '2023-09-20','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Lê Thị Oanh', '901234567', '1996-04-17', 1, 'Vietnam', 'Da Lat', 'Da Lat', 'oanh.le@gmail.com', '0990123456', 1, 4, '2023-10-02','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Phạm Văn Phú', '678901234', '1992-02-03', 0, 'Vietnam', 'Binh Duong', 'Binh Duong', 'phu.pham@yahoo.com', '0960123456', 2, 4, '2023-11-15','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Hoàng Thị Quỳnh', '345678901', '1993-10-28', 1, 'Vietnam', 'Bien Hoa', 'Bien Hoa', 'quynh.hoang@outlook.com', '0970123456', 3, 4, '2023-12-01','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Vũ Đức Sơn', '012345678', '1990-08-05', 0, 'Vietnam', 'Thai Nguyen', 'Thai Nguyen', 'son.vu@gmail.com', '0980123456', 1, 4, '2024-01-05','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Đỗ Thị Tuyết', '890123765', '1995-05-10', 1, 'Vietnam', 'Nam Dinh', 'Nam Dinh', 'tuyet.do@yahoo.com', '0940123456', 2, 4, '2024-02-18','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Nguyễn Hoàng Việt', '567890432', '1991-12-15', 0, 'Vietnam', 'Bac Ninh', 'Bac Ninh', 'viet.nguyen@outlook.com', '0950123456', 3, 4, '2024-03-25','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Trần Thị Xuân', '234567109', '1994-07-20', 1, 'Vietnam', 'Hai Duong', 'Hai Duong', 'xuan.tran@gmail.com', '0920123456', 1, 4, '2024-04-08','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Lê Văn Yên', '901234876', '1988-03-01', 0, 'Vietnam', 'Hung Yen', 'Hung Yen', 'yen.le@yahoo.com', '0991235467', 2, 4, '2024-05-20','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Phạm Thị Yến', '678901543', '1996-11-25', 1, 'Vietnam', 'Vinh Phuc', 'Vinh Phuc', 'yen.pham@outlook.com', '0961235478', 3, 4, '2024-06-02','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Hoàng Văn An', '345678210', '1992-09-10', 0, 'Vietnam', 'Ha Nam', 'Ha Nam', 'an.hoang@gmail.com', '0971235489', 1, 4, '2024-07-15','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Vũ Thị Bích', '012345987', '1993-06-08', 1, 'Vietnam', 'Thai Binh', 'Thai Binh', 'bich.vu@yahoo.com', '0981235490', 2, 4, '2024-08-28','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Đỗ Hoàng Cường', '890123654', '1990-04-03', 0, 'Vietnam', 'Ninh Binh', 'Ninh Binh', 'cuong.do@outlook.com', '0941235401', 3, 4, '2024-09-10','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Nguyễn Thị Diệu', '567890321', '1995-12-18', 1, 'Vietnam', 'Thanh Hoa', 'Thanh Hoa', 'dieu.nguyen@gmail.com', '0951235412', 1, 4, '2024-10-22','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Trần Văn Đông', '234567098', '1991-08-12', 0, 'Vietnam', 'Nghe An', 'Nghe An', 'dong.tran@yahoo.com', '0921235423', 2, 4, '2024-11-05','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Lê Thị Giang', '901234765', '1994-01-28', 1, 'Vietnam', 'Ha Tinh', 'Ha Tinh', 'giang.le@outlook.com', '0992346578', 3, 4, '2024-12-18','8,000,000','7,000,000', null, null, NOW(), NOW()),
('Phan Thành Công', '112233445', '1997-02-10', 0, 'Vietnam', 'Quang Nam', 'Quang Nam', 'cong.phan@gmail.com', '0933445566', 1, 4, '2025-01-10','8,000,000','7,000,000', NULL, NULL, NOW(), NOW());


INSERT INTO employees (full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, email, phone, department_id, position_id, hire_date, salary, salary_allowance, created_by, updated_by, created_at, updated_at) VALUES
('Phạm Thu Dung', '789123456', '1995-03-25', 1, 'Vietnam', 'Hai Phong', 'Hai Phong', 'dung.pham1@gmail.com', '0934567890', 1, 4, '2023-04-05','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Hoàng Minh Đức', '654321987', '1991-07-01', 0, 'Vietnam', 'Can Tho', 'Can Tho', 'duc.hoang1@yahoo.com', '0967890123', 2, 4, '2023-05-18','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Vũ Thị Ngọc', '321987654', '1993-11-30', 1, 'Vietnam', 'Hue', 'Hue', 'ngoc.vu1@outlook.com', '0978901234', 3, 4, '2023-06-25','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Đỗ Văn Hùng', '890123456', '1989-09-12', 0, 'Vietnam', 'Vung Tau', 'Vung Tau', 'hung.do1@gmail.com', '0945678901', 1, 4, '2023-07-08','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Nguyễn Thị Lan', '234567890', '1994-01-08', 1, 'Vietnam', 'Quang Ninh', 'Quang Ninh', 'lan.nguyen1@yahoo.com', '0923456789', 2, 4, '2023-08-12','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Trần Thanh Mạnh', '567890123', '1987-06-22', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', 'manh.tran1@outlook.com', '0956789012', 3, 4, '2023-09-20','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Lê Thị Oanh', '901234567', '1996-04-17', 1, 'Vietnam', 'Da Lat', 'Da Lat', 'oanh.le1@gmail.com', '0990123456', 1, 4, '2023-10-02','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Phạm Văn Phú', '678901234', '1992-02-03', 0, 'Vietnam', 'Binh Duong', 'Binh Duong', 'phu.pham1@yahoo.com', '0960123456', 2, 4, '2023-11-15','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Hoàng Thị Quỳnh', '345678901', '1993-10-28', 1, 'Vietnam', 'Bien Hoa', 'Bien Hoa', 'quynh.hoang1@outlook.com', '0970123456', 3, 4, '2023-12-01','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Vũ Đức Sơn', '012345678', '1990-08-05', 0, 'Vietnam', 'Thai Nguyen', 'Thai Nguyen', 'son.vu1@gmail.com', '0980123456', 1, 4, '2024-01-05','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Đỗ Thị Tuyết', '890123765', '1995-05-10', 1, 'Vietnam', 'Nam Dinh', 'Nam Dinh', 'tuyet.do1@yahoo.com', '0940123456', 2, 4, '2024-02-18','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Nguyễn Hoàng Việt', '567890432', '1991-12-15', 0, 'Vietnam', 'Bac Ninh', 'Bac Ninh', 'viet.nguyen1@outlook.com', '0950123456', 3, 4, '2024-03-25','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Trần Thị Xuân', '234567109', '1994-07-20', 1, 'Vietnam', 'Hai Duong', 'Hai Duong', 'xuan.tran1@gmail.com', '0920123456', 1, 4, '2024-04-08','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Lê Văn Yên', '901234876', '1988-03-01', 0, 'Vietnam', 'Hung Yen', 'Hung Yen', 'yen.le1@yahoo.com', '0991235467', 2, 4, '2024-05-20','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Phạm Thị Yến', '678901543', '1996-11-25', 1, 'Vietnam', 'Vinh Phuc', 'Vinh Phuc', 'yen.pham1@outlook.com', '0961235478', 3, 4, '2024-06-02','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Hoàng Văn An', '345678210', '1992-09-10', 0, 'Vietnam', 'Ha Nam', 'Ha Nam', 'an.hoang1@gmail.com', '0971235489', 1, 4, '2024-07-15','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Vũ Thị Bích', '012345987', '1993-06-08', 1, 'Vietnam', 'Thai Binh', 'Thai Binh', 'bich.vu1@yahoo.com', '0981235490', 2, 4, '2024-08-28','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Đỗ Hoàng Cường', '890123654', '1990-04-03', 0, 'Vietnam', 'Ninh Binh', 'Ninh Binh', 'cuong.do1@outlook.com', '0941235401', 3, 4, '2024-09-10','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Nguyễn Thị Diệu', '567890321', '1995-12-18', 1, 'Vietnam', 'Thanh Hoa', 'Thanh Hoa', 'dieu.nguyen1@gmail.com', '0951235412', 1, 4, '2024-10-22','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Trần Văn Đông', '234567098', '1991-08-12', 0, 'Vietnam', 'Nghe An', 'Nghe An', 'dong.tran1@yahoo.com', '0921235423', 2, 4, '2024-11-05','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Lê Thị Giang', '901234765', '1994-01-28', 1, 'Vietnam', 'Ha Tinh', 'Ha Tinh', 'giang.le1@outlook.com', '0992346578', 3, 4, '2024-12-18','10,000,000','7,000,000', null, null, NOW(), NOW()),
('Phan Thành Công', '112233445', '1997-02-10', 0, 'Vietnam', 'Quang Nam', 'Quang Nam', 'cong.phan1@gmail.com', '0933445566', 1, 4, '2025-01-10','10,000,000','7,000,000', NULL, NULL, NOW(), NOW()),
('Bùi Văn Nam', '223344556', '1998-03-12', 0, 'Vietnam', 'Binh Thuan', 'Binh Thuan', 'nam.bui1@gmail.com', '0944556677', 1, 1, '2025-02-12','10,000,000','7,000,000', NULL, NULL, NOW(), NOW()),
('Trần Thị Thảo', '334455667', '1999-04-15', 1, 'Vietnam', 'Long An', 'Long An', 'thao.tran1@yahoo.com', '0955667788', 2, 1, '2025-03-15','10,000,000','7,000,000', NULL, NULL, NOW(), NOW()),
('Nguyễn Tiến Dũng', '445566778', '2000-05-18', 0, 'Vietnam', 'Tien Giang', 'Tien Giang', 'dung.nguyen1@outlook.com', '0966778899', 3, 1, '2025-04-18','10,000,000','7,000,000', NULL, NULL, NOW(), NOW()),
('Lê Thị Phương Anh', '556677889', '2001-06-20', 1, 'Vietnam', 'Dong Thap', 'Dong Thap', 'anh.le1@gmail.com', '0977889900', 1, 1, '2025-05-20','10,000,000','7,000,000', NULL, NULL, NOW(), NOW()),
('Phạm Hoàng Hải', '667788990', '1997-07-22', 0, 'Vietnam', 'An Giang', 'An Giang', 'hai.pham1@yahoo.com', '0988990011', 2, 1, '2025-06-22','10,000,000','7,000,000', NULL, NULL, NOW(), NOW()),
('Vũ Thị Hồng Nhung', '778899001', '1998-08-25', 1, 'Vietnam', 'Kien Giang', 'Kien Giang', 'nhung.vu1@outlook.com', '0999001122', 3, 1, '2025-07-25','10,000,000','7,000,000', NULL, NULL, NOW(), NOW()),
('Đỗ Đức Mạnh', '889900112', '1999-09-28', 0, 'Vietnam', 'Bac Lieu', 'Bac Lieu', 'manh.do1@gmail.com', '0900112233', 1, 1, '2025-08-28','10,000,000','7,000,000', NULL, NULL, NOW(), NOW()),
('Nguyễn Thị Quỳnh Anh', '990011223', '2000-10-31', 1, 'Vietnam', 'Ca Mau', 'Ca Mau', 'anh.nguyen1@yahoo.com', '0911223344', 2, 1, '2025-09-30','10,000,000','7,000,000', NULL, NULL, NOW(), NOW()),
('Trần Văn Bình An', '001122334', '2001-12-03', 0, 'Vietnam', 'Tra Vinh', 'Tra Vinh', 'an.tran1@outlook.com', '0922334455', 3, 1, '2025-11-03','10,000,000','7,000,000', NULL, NULL, NOW(), NOW()),
('Lê Thị Cẩm Tú', '112233440', '1997-01-05', 1, 'Vietnam', 'Soc Trang', 'Soc Trang', 'tu.le1@gmail.com', '0933445577', 1, 1, '2025-12-05','10,000,000','7,000,000', NULL, NULL, NOW(), NOW());

INSERT INTO employees (full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, email, phone, department_id, position_id, hire_date, salary, salary_allowance, created_by, updated_by, created_at, updated_at) VALUES
('Lê Thị Cẩm Tú', '112233440', '1997-01-05', 1, 'Vietnam', 'Soc Trang', 'Soc Trang', 'tu.le@gmail.com', '0933445577', 1, 1, '2025-12-05','15,000,000','17,000,000', NULL, NULL, NOW(), NOW()),
('Nguyễn Thị Hà', '123456791', '1998-02-10', 1, 'Vietnam', 'Hanoi', 'Hanoi', 'ha.nguyen@gmail.com', '0912345680', 1, 2, '2024-01-15','15,000,000','17,000,000', null, null, NOW(), NOW()),
('Trần Thị Mai', '987654323', '1999-03-12', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', 'mai.tran@yahoo.com', '0987654323', 2, 2, '2024-02-20','15,000,000','17,000,000', null, null, NOW(), NOW()),
('Lê Thị Hương', '456789125', '2000-04-18', 1, 'Vietnam', 'Da Nang', 'Da Nang', 'huong.le@outlook.com', '0901234569', 3, 2, '2024-03-28','15,000,000','17,000,000', null, null, NOW(), NOW()),
('Phạm Thị Thúy', '789123458', '2001-05-22', 1, 'Vietnam', 'Hai Phong', 'Hai Phong', 'thuy.pham@gmail.com', '0934567892', 1, 2, '2024-04-01','15,000,000','17,000,000', null, null, NOW(), NOW());


INSERT INTO configs (type, code, name, name_en, description)
VALUES ('contract_status','0','Bản nháp', 'Draft', 'The contract is currently being drafted.');
INSERT INTO configs (type, code, name, name_en, description)
VALUES ('contract_status','1','Đã phê duyệt', 'Approved', 'The contract has been approved by all relevant parties.');
INSERT INTO configs (type, code, name, name_en, description)
VALUES ('contract_status','2','Chờ ký', 'Pending Signature', 'The contract is awaiting signatures from the involved parties.');
INSERT INTO configs (type, code, name, name_en, description)
VALUES ('contract_status','3','Mới tạo', 'New', 'The contract has just been created.');
INSERT INTO configs (type, code, name, name_en, description)
VALUES ('contract_status','4','Từ chối', 'Reject', 'The contract has reject.');


-- setting company in config
INSERT INTO configs (type, code, name, name_en, description)
VALUES ('company','companyNumberContract','11233', '11233', 'Number contract');
INSERT INTO configs (type, code, name, name_en, description)
VALUES ('company','companyAddress','Số 1 Lạc Long Quân', 'Số 1 Lạc Long Quân', 'Company Address');
INSERT INTO configs (type, code, name, name_en, description)
VALUES ('company','companyName','Công ty Song Long', 'Công ty Song Long', 'Company Name');
INSERT INTO configs (type, code, name, name_en, description)
VALUES ('company','companyEmployer','Trần Tuấn Anh', 'Trần Tuấn Anh', '');
INSERT INTO configs (type, code, name, name_en, description)
VALUES ('company','companyTaxCode','88888', '88888', '');
INSERT INTO configs (type, code, name, name_en, description)
VALUES ('company','companyTimeWorking','8h', '8h', '');


