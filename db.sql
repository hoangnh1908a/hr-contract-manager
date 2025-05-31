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

INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (1, 'Phát triển phần mềm', 'Software Development', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');
INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (2, 'Cơ sở hạ tầng CNTT & Hỗ trợ', 'IT Infrastructure & Support', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');
INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (3, 'An ninh mạng', 'Cybersecurity', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');
INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (4, 'Khoa học dữ liệu & Phân tích', 'Data Science & Analytics', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');
INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (5, 'Điện toán đám mây & DevOps', 'Cloud Computing & DevOps', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');
INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (6, 'Quản lý sản phẩm', 'Product Management', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');
INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (7, 'Đảm bảo chất lượng (QA) & Kiểm tra', 'Quality Assurance (QA) & Testing', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');
INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (8, 'Hỗ trợ kỹ thuật & Dịch vụ khách hàng', 'Technical Support & Customer Service', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');
INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (9, 'Bán hàng & Tiếp thị', 'Sales & Marketing', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');
INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (10, 'Nguồn nhân lực (HR) & Quản trị', 'Human Resources (HR) & Administration', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');
INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (11, 'Tài chính & Kế toán', 'Finance & Accounting', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');
INSERT INTO departments (id, name, name_en, status, created_by, updated_by, created_at, updated_at) VALUES (12, 'Nghiên cứu & Phát triển (R&D)', 'Research & Development (R&D)', 1, null, null, '2025-05-20 16:40:50', '2025-05-20 16:40:50');



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
VALUES ('Kỹ sư phân tích dữ liệu', 'Data Analyst', 1, null, null, NOW(), NOW());

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


INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (1, 'Nguyễn Văn An', '123456789', '1990-05-15', 0, 'Vietnam', 'Hanoi', 'Hanoi', '6,000,000', '5,000,000', 'an.nguyen@gmail.com', '0912345678', 1, 3, '2024-01-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (2, 'Trần Thị Bình', '987654321', '1992-08-20', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', '6,000,000', '5,000,000', 'binh.tran@gmail.com', '0987654321', 1, 3, '2024-02-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (3, 'Lê Hoàng Cường', '234567890', '1988-03-10', 0, 'Vietnam', 'Da Nang', 'Da Nang', '6,000,000', '5,000,000', 'cuong.le@gmail.com', '0934567890', 1, 3, '2024-03-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (4, 'Phạm Thu Diễm', '876543210', '1995-11-05', 1, 'Vietnam', 'Can Tho', 'Can Tho', '6,000,000', '5,000,000', 'diem.pham@gmail.com', '0976543210', 1, 3, '2024-04-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (5, 'Hoàng Minh Đức', '345678901', '1991-06-22', 0, 'Vietnam', 'Hai Phong', 'Hai Phong', '6,000,000', '5,000,000', 'duc.hoang@gmail.com', '0923456789', 1, 3, '2024-05-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (6, 'Vũ Ngọc Hà', '765432109', '1993-09-18', 1, 'Vietnam', 'Hue', 'Hue', '6,000,000', '5,000,000', 'ha.vu@gmail.com', '0965432109', 1, 3, '2024-06-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (7, 'Đặng Văn Huy', '456789012', '1989-01-28', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', '6,000,000', '5,000,000', 'huy.dang@gmail.com', '0945678901', 1, 3, '2024-07-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (8, 'Bùi Thị Kim', '654321098', '1996-04-12', 1, 'Vietnam', 'Vung Tau', 'Vung Tau', '6,000,000', '5,000,000', 'kim.bui@gmail.com', '0954321098', 1, 3, '2024-08-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (9, 'Trương Công Liêm', '567890123', '1994-07-08', 0, 'Vietnam', 'Da Lat', 'Da Lat', '6,000,000', '5,000,000', 'liem.truong@gmail.com', '0905678901', 1, 3, '2024-09-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (10, 'Đỗ Thị Mai', '543210987', '1997-12-03', 1, 'Vietnam', 'Phu Quoc', 'Phu Quoc', '6,000,000', '5,000,000', 'mai.do@gmail.com', '0915432109', 1, 3, '2024-10-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (11, 'Phan Văn Nam', '678901234', '1987-02-14', 0, 'Vietnam', 'Can Tho', 'Can Tho', '6,000,000', '5,000,000', 'nam.phan@gmail.com', '0926789012', 1, 3, '2024-01-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (12, 'Lý Thị Oanh', '432109876', '1998-05-29', 1, 'Vietnam', 'Vung Tau', 'Vung Tau', '6,000,000', '7,000,000', 'oanh.ly@gmail.com', '0984321098', 1, 3, '2024-02-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (13, 'Ngô Sỹ Phúc', '789012345', '1993-10-24', 0, 'Vietnam', 'Da Nang', 'Da Nang', '6,000,000', '7,000,000', 'phuc.ngo@gmail.com', '0937890123', 1, 3, '2024-03-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (14, 'Tạ Thị Quỳnh', '321098765', '1992-08-01', 1, 'Vietnam', 'Hai Phong', 'Hai Phong', '6,000,000', '7,000,000', 'quynh.ta@gmail.com', '0973210987', 1, 3, '2024-04-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (15, 'Cao Xuân Sơn', '890123456', '1991-03-07', 0, 'Vietnam', 'Hanoi', 'Hanoi', '6,000,000', '7,000,000', 'son.cao@gmail.com', '0928901234', 1, 3, '2024-05-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (16, 'Võ Thị Thảo', '210987654', '1999-06-11', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', '6,000,000', '7,000,000', 'thao.vo@gmail.com', '0962109876', 1, 3, '2024-06-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (17, 'Đinh Tiến Tú', '901234567', '1990-01-19', 0, 'Vietnam', 'Hue', 'Hue', '6,000,000', '7,000,000', 'tu.dinh@gmail.com', '0949012345', 1, 3, '2024-07-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (18, 'Huỳnh Thị Uyên', '109876543', '1994-04-05', 1, 'Vietnam', 'Nha Trang', 'Nha Trang', '6,000,000', '7,000,000', 'uyen.huynh@gmail.com', '0951098765', 1, 3, '2024-08-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (19, 'Lưu Văn Việt', '012345678', '1986-09-27', 0, 'Vietnam', 'Da Lat', 'Da Lat', '6,000,000', '7,000,000', 'viet.luu@gmail.com', '0900123456', 1, 3, '2024-09-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (20, 'Mai Thị Xuân', '987654320', '1997-11-30', 1, 'Vietnam', 'Phu Quoc', 'Phu Quoc', '6,000,000', '7,000,000', 'xuan.mai@gmail.com', '0919876540', 1, 3, '2024-10-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (21, 'Phùng Văn Yên', '876543219', '1995-07-17', 0, 'Vietnam', 'Hanoi', 'Hanoi', '6,000,000', '7,000,000', 'yen.phung@gmail.com', '0928765439', 1, 3, '2024-11-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (22, 'Trịnh Thị Ánh', '765432108', '1998-10-12', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', '6,000,000', '7,000,000', 'anh.trinh@gmail.com', '0967654328', 1, 3, '2024-12-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (23, 'Bạch Công Bắc', '654321097', '1992-02-22', 0, 'Vietnam', 'Da Nang', 'Da Nang', '6,000,000', '7,000,000', 'bac.bach@gmail.com', '0956543217', 1, 3, '2024-01-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (24, 'Chu Thị Cẩm', '543210986', '1991-04-08', 1, 'Vietnam', 'Can Tho', 'Can Tho', '6,000,000', '7,000,000', 'cam.chu@gmail.com', '0905432106', 1, 3, '2024-02-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (25, 'Dương Văn Chiến', '432109875', '1996-09-03', 0, 'Vietnam', 'Hai Phong', 'Hai Phong', '6,000,000', '7,000,000', 'chien.duong@gmail.com', '0914321095', 1, 3, '2024-03-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (26, 'Giang Thị Dung', '321098764', '1993-12-28', 1, 'Vietnam', 'Hue', 'Hue', '6,000,000', '7,000,000', 'dung.giang@gmail.com', '0973210984', 1, 3, '2024-04-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (27, 'Hà Văn Giang', '210987653', '1990-03-17', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', '6,000,000', '7,000,000', 'giang.ha@gmail.com', '0922109873', 1, 3, '2024-05-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (28, 'Khúc Thị Hạnh', '109876542', '1997-08-10', 1, 'Vietnam', 'Vung Tau', 'Vung Tau', '6,000,000', '7,000,000', 'hanh.khuc@gmail.com', '0961098762', 1, 3, '2024-06-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (29, 'Lê Bá Hiếu', '098765431', '1989-01-05', 0, 'Vietnam', 'Da Lat', 'Da Lat', '6,000,000', '7,000,000', 'hieu.le@gmail.com', '0940987651', 1, 3, '2024-07-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (30, 'Mai Thị Hoa', '987654329', '1994-06-30', 1, 'Vietnam', 'Phu Quoc', 'Phu Quoc', '6,000,000', '7,000,000', 'hoa.mai@gmail.com', '0919876549', 1, 3, '2024-08-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (31, 'Nguyễn Sỹ Hoàng', '876543218', '1996-11-25', 0, 'Vietnam', 'Hanoi', 'Hanoi', '6,000,000', '7,000,000', 'hoang.nguyen@gmail.com', '0928765438', 1, 3, '2024-09-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (32, 'Phạm Thị Hương', '765432107', '1992-05-14', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', '6,000,000', '7,000,000', 'huong.pham@gmail.com', '0967654327', 1, 3, '2024-10-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (33, 'Trần Văn Khải', '654321096', '1991-07-09', 0, 'Vietnam', 'Da Nang', 'Da Nang', '6,000,000', '7,000,000', 'khai.tran@gmail.com', '0956543216', 1, 3, '2024-11-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (34, 'Lê Thị Lan', '543210985', '1998-12-04', 1, 'Vietnam', 'Can Tho', 'Can Tho', '6,000,000', '7,000,000', 'lan.le@gmail.com', '0905432105', 1, 3, '2024-12-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (35, 'Ngô Văn Long', '432109874', '1993-02-18', 0, 'Vietnam', 'Hai Phong', 'Hai Phong', '6,000,000', '7,000,000', 'long.ngo@gmail.com', '0914321094', 1, 3, '2025-01-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (36, 'Phan Thị Mến', '321098763', '1990-04-03', 1, 'Vietnam', 'Hue', 'Hue', '6,000,000', '7,000,000', 'men.phan@gmail.com', '0973210983', 1, 3, '2025-02-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (37, 'Hoàng Văn Nam', '210987652', '1997-09-29', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', '6,000,000', '7,000,000', 'nam.hoang@gmail.com', '0922109872', 1, 3, '2025-03-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (38, 'Vũ Thị Oanh', '109876541', '1989-01-24', 1, 'Vietnam', 'Vung Tau', 'Vung Tau', '6,000,000', '5,000,000', 'oanh.vu@gmail.com', '0961098761', 1, 3, '2025-04-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (39, 'Đặng Văn Phát', '098765430', '1995-06-16', 0, 'Vietnam', 'Da Lat', 'Da Lat', '6,000,000', '5,000,000', 'phat.dang@gmail.com', '0940987650', 1, 3, '2025-05-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (40, 'Bùi Thị Phương', '987654328', '1998-11-11', 1, 'Vietnam', 'Phu Quoc', 'Phu Quoc', '6,000,000', '5,000,000', 'phuong.bui@gmail.com', '0919876548', 1, 3, '2025-06-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (41, 'Trương Công Quốc', '876543217', '1992-05-08', 0, 'Vietnam', 'Hanoi', 'Hanoi', '6,000,000', '5,000,000', 'quoc.truong@gmail.com', '0928765437', 1, 3, '2025-07-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (42, 'Đỗ Thị Quỳnh', '765432106', '1991-07-03', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', '6,000,000', '5,000,000', 'quynh.do@gmail.com', '0967654326', 4, 7, '2025-08-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (43, 'Phan Văn Sơn', '654321095', '1996-12-29', 0, 'Vietnam', 'Da Nang', 'Da Nang', '6,000,000', '5,000,000', 'son.phan@gmail.com', '0956543215', 4, 7, '2025-09-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (44, 'Lý Thị Thủy', '543210984', '1993-02-13', 1, 'Vietnam', 'Can Tho', 'Can Tho', '6,000,000', '5,000,000', 'thuy.ly@gmail.com', '0905432104', 4, 7, '2025-10-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (45, 'Ngô Sỹ Toàn', '432109873', '1990-04-02', 0, 'Vietnam', 'Hai Phong', 'Hai Phong', '6,000,000', '5,000,000', 'toan.ngo@gmail.com', '0914321093', 4, 7, '2025-11-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (46, 'Tạ Thị Trúc', '321098762', '1997-09-28', 1, 'Vietnam', 'Hue', 'Hue', '6,000,000', '5,000,000', 'truc.ta@gmail.com', '0973210982', 4, 7, '2025-12-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (47, 'Cao Xuân Vinh', '210987651', '1989-01-23', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', '6,000,000', '5,000,000', 'vinh.cao@gmail.com', '0922109871', 4, 7, '2026-01-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (48, 'Võ Thị Xuân', '109876540', '1994-06-15', 1, 'Vietnam', 'Vung Tau', 'Vung Tau', '6,000,000', '6,000,000', 'xuan.vo@gmail.com', '0961098760', 4, 7, '2026-02-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (49, 'Đinh Khắc Yến', '098765429', '1996-11-10', 0, 'Vietnam', 'Da Lat', 'Da Lat', '6,000,000', '6,000,000', 'yen.dinh@gmail.com', '0940987649', 4, 7, '2026-03-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (50, 'Hồ Thị Ý', '987654319', '1992-05-07', 1, 'Vietnam', 'Phu Quoc', 'Phu Quoc', '6,000,000', '6,000,000', 'y.ho@gmail.com', '0919876539', 4, 7, '2026-04-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (51, 'Kha Văn Ẩn', '876543209', '1991-07-02', 0, 'Vietnam', 'Hanoi', 'Hanoi', '6,000,000', '6,000,000', 'an.kha@gmail.com', '0928765429', 4, 7, '2026-05-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (52, 'Lâm Bảo Ân', '765432198', '1998-12-27', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', '6,000,000', '6,000,000', 'an.lam@gmail.com', '0967654318', 4, 7, '2026-06-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (53, 'Mạc Thị Ái', '654321087', '1993-02-17', 1, 'Vietnam', 'Da Nang', 'Da Nang', '6,000,000', '6,000,000', 'ai.mac@gmail.com', '0956543207', 4, 7, '2026-07-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (54, 'Nhâm Mạnh Bảo', '543210976', '1990-04-02', 0, 'Vietnam', 'Can Tho', 'Can Tho', '6,000,000', '6,000,000', 'bao.nham@gmail.com', '0905432096', 4, 7, '2026-08-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (55, 'Ôn Thị Bạch', '432109865', '1997-09-27', 1, 'Vietnam', 'Hai Phong', 'Hai Phong', '6,000,000', '6,000,000', 'bach.on@gmail.com', '0914320985', 4, 7, '2026-09-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (56, 'Phan Thanh Bình', '321098754', '1989-01-22', 0, 'Vietnam', 'Hue', 'Hue', '6,000,000', '6,000,000', 'binh.phan@gmail.com', '0973209874', 4, 7, '2026-10-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (57, 'Quách Thị Bích', '210987643', '1995-06-14', 1, 'Vietnam', 'Nha Trang', 'Nha Trang', '6,000,000', '6,000,000', 'bich.quach@gmail.com', '0922098753', 4, 7, '2026-11-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (58, 'Ra Chánh Chính', '109876532', '1998-11-09', 0, 'Vietnam', 'Vung Tau', 'Vung Tau', '6,000,000', '6,000,000', 'chinh.ra@gmail.com', '0961098742', 4, 7, '2026-12-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (59, 'Sa Như Chung', '098765421', '1992-05-06', 1, 'Vietnam', 'Da Lat', 'Da Lat', '6,000,000', '6,000,000', 'chung.sa@gmail.com', '0940987631', 4, 7, '2027-01-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (60, 'Tạ Quang Chương', '987654310', '1994-07-01', 0, 'Vietnam', 'Phu Quoc', 'Phu Quoc', '6,000,000', '6,000,000', 'chuong.ta@gmail.com', '0919876530', 4, 7, '2027-02-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (61, 'Ung Văn Dũng', '876543200', '1996-12-26', 0, 'Vietnam', 'Hanoi', 'Hanoi', '6,000,000', '5,000,000', 'dung.ung@gmail.com', '0928765420', 4, 7, '2027-03-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (62, 'Vưu Thị Dương', '765432189', '1993-02-16', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', '6,000,000', '5,000,000', 'duong.vuu@gmail.com', '0967654309', 4, 7, '2027-04-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (63, 'Xa Thị Đoan', '654321078', '1990-04-01', 1, 'Vietnam', 'Da Nang', 'Da Nang', '6,000,000', '5,000,000', 'doan.xa@gmail.com', '0956543198', 4, 7, '2027-05-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (64, 'Trần Thị Bình', '987654321', '1992-08-20', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', '8,000,000', '7,000,000', 'binh.tran@yahoo.com', '0987654321', 4, 7, '2024-02-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (65, 'Lê Hoàng Cường', '456789123', '1988-12-10', 0, 'Vietnam', 'Da Nang', 'Da Nang', '8,000,000', '7,000,000', 'cuong.le@outlook.com', '0901234567', 4, 7, '2024-03-22', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (66, 'Phạm Thu Dung', '789123456', '1995-03-25', 1, 'Vietnam', 'Hai Phong', 'Hai Phong', '8,000,000', '7,000,000', 'dung.pham@gmail.com', '0934567890', 4, 7, '2024-04-05', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (67, 'Hoàng Minh Đức', '654321987', '1991-07-01', 0, 'Vietnam', 'Can Tho', 'Can Tho', '8,000,000', '7,000,000', 'duc.hoang@yahoo.com', '0967890123', 4, 7, '2024-05-18', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (68, 'Vũ Thị Ngọc', '321987654', '1993-11-30', 1, 'Vietnam', 'Hue', 'Hue', '8,000,000', '7,000,000', 'ngoc.vu@outlook.com', '0978901234', 4, 7, '2024-06-25', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (69, 'Đỗ Văn Hùng', '890123456', '1989-09-12', 0, 'Vietnam', 'Vung Tau', 'Vung Tau', '8,000,000', '7,000,000', 'hung.do@gmail.com', '0945678901', 4, 7, '2024-07-08', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (70, 'Nguyễn Thị Lan', '234567890', '1994-01-08', 1, 'Vietnam', 'Quang Ninh', 'Quang Ninh', '8,000,000', '7,000,000', 'lan.nguyen@yahoo.com', '0923456789', 4, 7, '2024-08-12', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (71, 'Trần Thanh Mạnh', '567890123', '1987-06-22', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', '8,000,000', '7,000,000', 'manh.tran@outlook.com', '0956789012', 4, 7, '2024-09-20', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (72, 'Lê Thị Oanh', '901234567', '1996-04-17', 1, 'Vietnam', 'Da Lat', 'Da Lat', '8,000,000', '7,000,000', 'oanh.le@gmail.com', '0990123456', 4, 7, '2024-10-02', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (73, 'Phạm Văn Phú', '678901234', '1992-02-03', 0, 'Vietnam', 'Binh Duong', 'Binh Duong', '8,000,000', '12,000,000', 'phu.pham@yahoo.com', '0960123456', 4, 7, '2024-11-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (74, 'Hoàng Thị Quỳnh', '345678901', '1993-10-28', 1, 'Vietnam', 'Bien Hoa', 'Bien Hoa', '8,000,000', '12,000,000', 'quynh.hoang@outlook.com', '0970123456', 4, 7, '2024-12-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (75, 'Vũ Đức Sơn', '012345678', '1990-08-05', 0, 'Vietnam', 'Thai Nguyen', 'Thai Nguyen', '8,000,000', '12,000,000', 'son.vu@gmail.com', '0980123456', 4, 7, '2024-01-05', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (76, 'Đỗ Thị Tuyết', '890123765', '1995-05-10', 1, 'Vietnam', 'Nam Dinh', 'Nam Dinh', '8,000,000', '12,000,000', 'tuyet.do@yahoo.com', '0940123456', 4, 7, '2024-02-18', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (77, 'Nguyễn Hoàng Việt', '567890432', '1991-12-15', 0, 'Vietnam', 'Bac Ninh', 'Bac Ninh', '8,000,000', '12,000,000', 'viet.nguyen@outlook.com', '0950123456', 4, 7, '2024-03-25', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (78, 'Trần Thị Xuân', '234567109', '1994-07-20', 1, 'Vietnam', 'Hai Duong', 'Hai Duong', '8,000,000', '12,000,000', 'xuan.tran@gmail.com', '0920123456', 4, 7, '2024-04-08', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (79, 'Lê Văn Yên', '901234876', '1988-03-01', 0, 'Vietnam', 'Hung Yen', 'Hung Yen', '8,000,000', '12,000,000', 'yen.le@yahoo.com', '0991235467', 4, 7, '2024-05-20', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (80, 'Phạm Thị Yến', '678901543', '1996-11-25', 1, 'Vietnam', 'Vinh Phuc', 'Vinh Phuc', '8,000,000', '12,000,000', 'yen.pham@outlook.com', '0961235478', 4, 7, '2024-06-02', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (81, 'Hoàng Văn An', '345678210', '1992-09-10', 0, 'Vietnam', 'Ha Nam', 'Ha Nam', '8,000,000', '12,000,000', 'an.hoang@gmail.com', '0971235489', 4, 7, '2024-07-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (82, 'Vũ Thị Bích', '012345987', '1993-06-08', 1, 'Vietnam', 'Thai Binh', 'Thai Binh', '8,000,000', '12,000,000', 'bich.vu@yahoo.com', '0981235490', 4, 7, '2024-08-28', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (83, 'Đỗ Hoàng Cường', '890123654', '1990-04-03', 0, 'Vietnam', 'Ninh Binh', 'Ninh Binh', '8,000,000', '12,000,000', 'cuong.do@outlook.com', '0941235401', 4, 7, '2024-09-10', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (84, 'Nguyễn Thị Diệu', '567890321', '1995-12-18', 1, 'Vietnam', 'Thanh Hoa', 'Thanh Hoa', '8,000,000', '12,000,000', 'dieu.nguyen@gmail.com', '0951235412', 4, 7, '2024-10-22', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (85, 'Trần Văn Đông', '234567098', '1991-08-12', 0, 'Vietnam', 'Nghe An', 'Nghe An', '8,000,000', '12,000,000', 'dong.tran@yahoo.com', '0921235423', 4, 7, '2024-11-05', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (86, 'Lê Thị Giang', '901234765', '1994-01-28', 1, 'Vietnam', 'Ha Tinh', 'Ha Tinh', '8,000,000', '12,000,000', 'giang.le@outlook.com', '0992346578', 4, 7, '2024-12-18', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (87, 'Phan Thành Công', '112233445', '1997-02-10', 0, 'Vietnam', 'Quang Nam', 'Quang Nam', '8,000,000', '12,000,000', 'cong.phan@gmail.com', '0933445566', 4, 7, '2025-01-10', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (88, 'Phạm Thu Dung', '789123456', '1995-03-25', 1, 'Vietnam', 'Hai Phong', 'Hai Phong', '10,000,000', '12,000,000', 'dung.pham1@gmail.com', '0934567890', 4, 7, '2024-04-05', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (89, 'Hoàng Minh Đức', '654321987', '1991-07-01', 0, 'Vietnam', 'Can Tho', 'Can Tho', '10,000,000', '12,000,000', 'duc.hoang1@yahoo.com', '0967890123', 4, 7, '2024-05-18', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (90, 'Vũ Thị Ngọc', '321987654', '1993-11-30', 1, 'Vietnam', 'Hue', 'Hue', '10,000,000', '12,000,000', 'ngoc.vu1@outlook.com', '0978901234', 4, 7, '2024-06-25', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (91, 'Đỗ Văn Hùng', '890123456', '1989-09-12', 0, 'Vietnam', 'Vung Tau', 'Vung Tau', '10,000,000', '12,000,000', 'hung.do1@gmail.com', '0945678901', 4, 7, '2024-07-08', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (92, 'Nguyễn Thị Lan', '234567890', '1994-01-08', 1, 'Vietnam', 'Quang Ninh', 'Quang Ninh', '10,000,000', '12,000,000', 'lan.nguyen1@yahoo.com', '0923456789', 4, 7, '2024-08-12', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (93, 'Trần Thanh Mạnh', '567890123', '1987-06-22', 0, 'Vietnam', 'Nha Trang', 'Nha Trang', '10,000,000', '12,000,000', 'manh.tran1@outlook.com', '0956789012', 4, 7, '2024-09-20', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (94, 'Lê Thị Oanh', '901234567', '1996-04-17', 1, 'Vietnam', 'Da Lat', 'Da Lat', '10,000,000', '12,000,000', 'oanh.le1@gmail.com', '0990123456', 4, 7, '2024-10-02', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (95, 'Phạm Văn Phú', '678901234', '1992-02-03', 0, 'Vietnam', 'Binh Duong', 'Binh Duong', '10,000,000', '6,000,000', 'phu.pham1@yahoo.com', '0960123456', 4, 7, '2024-11-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (96, 'Hoàng Thị Quỳnh', '345678901', '1993-10-28', 1, 'Vietnam', 'Bien Hoa', 'Bien Hoa', '10,000,000', '6,000,000', 'quynh.hoang1@outlook.com', '0970123456', 4, 7, '2024-12-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (97, 'Vũ Đức Sơn', '012345678', '1990-08-05', 0, 'Vietnam', 'Thai Nguyen', 'Thai Nguyen', '10,000,000', '6,000,000', 'son.vu1@gmail.com', '0980123456', 4, 7, '2024-01-05', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (98, 'Đỗ Thị Tuyết', '890123765', '1995-05-10', 1, 'Vietnam', 'Nam Dinh', 'Nam Dinh', '10,000,000', '6,000,000', 'tuyet.do1@yahoo.com', '0940123456', 4, 7, '2024-02-18', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (99, 'Nguyễn Hoàng Việt', '567890432', '1991-12-15', 0, 'Vietnam', 'Bac Ninh', 'Bac Ninh', '10,000,000', '6,000,000', 'viet.nguyen1@outlook.com', '0950123456', 4, 7, '2024-03-25', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (100, 'Trần Thị Xuân', '234567109', '1994-07-20', 1, 'Vietnam', 'Hai Duong', 'Hai Duong', '10,000,000', '6,000,000', 'xuan.tran1@gmail.com', '0920123456', 4, 7, '2024-04-08', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (101, 'Lê Văn Yên', '901234876', '1988-03-01', 0, 'Vietnam', 'Hung Yen', 'Hung Yen', '10,000,000', '6,000,000', 'yen.le1@yahoo.com', '0991235467', 4, 7, '2024-05-20', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (102, 'Phạm Thị Yến', '678901543', '1996-11-25', 1, 'Vietnam', 'Vinh Phuc', 'Vinh Phuc', '10,000,000', '6,000,000', 'yen.pham1@outlook.com', '0961235478', 9, 6, '2024-06-02', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (103, 'Hoàng Văn An', '345678210', '1992-09-10', 0, 'Vietnam', 'Ha Nam', 'Ha Nam', '10,000,000', '6,000,000', 'an.hoang1@gmail.com', '0971235489', 9, 6, '2024-07-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (104, 'Vũ Thị Bích', '012345987', '1993-06-08', 1, 'Vietnam', 'Thai Binh', 'Thai Binh', '10,000,000', '6,000,000', 'bich.vu1@yahoo.com', '0981235490', 9, 6, '2024-08-28', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (105, 'Đỗ Hoàng Cường', '890123654', '1990-04-03', 0, 'Vietnam', 'Ninh Binh', 'Ninh Binh', '10,000,000', '6,000,000', 'cuong.do1@outlook.com', '0941235401', 9, 6, '2024-09-10', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (106, 'Nguyễn Thị Diệu', '567890321', '1995-12-18', 1, 'Vietnam', 'Thanh Hoa', 'Thanh Hoa', '10,000,000', '6,000,000', 'dieu.nguyen1@gmail.com', '0951235412', 9, 6, '2024-10-22', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (107, 'Trần Văn Đông', '234567098', '1991-08-12', 0, 'Vietnam', 'Nghe An', 'Nghe An', '10,000,000', '6,000,000', 'dong.tran1@yahoo.com', '0921235423', 9, 6, '2024-11-05', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (108, 'Lê Thị Giang', '901234765', '1994-01-28', 1, 'Vietnam', 'Ha Tinh', 'Ha Tinh', '10,000,000', '6,000,000', 'giang.le1@outlook.com', '0992346578', 9, 6, '2024-12-18', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (109, 'Phan Thành Công', '112233445', '1997-02-10', 0, 'Vietnam', 'Quang Nam', 'Quang Nam', '10,000,000', '8,000,000', 'cong.phan1@gmail.com', '0933445566', 9, 6, '2025-01-10', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (110, 'Bùi Văn Nam', '223344556', '1998-03-12', 0, 'Vietnam', 'Binh Thuan', 'Binh Thuan', '10,000,000', '8,000,000', 'nam.bui1@gmail.com', '0944556677', 9, 6, '2025-02-12', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (111, 'Trần Thị Thảo', '334455667', '1999-04-15', 1, 'Vietnam', 'Long An', 'Long An', '10,000,000', '8,000,000', 'thao.tran1@yahoo.com', '0955667788', 9, 6, '2025-03-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (112, 'Nguyễn Tiến Dũng', '445566778', '2000-05-18', 0, 'Vietnam', 'Tien Giang', 'Tien Giang', '10,000,000', '8,000,000', 'dung.nguyen1@outlook.com', '0966778899', 9, 6, '2025-04-18', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (113, 'Lê Thị Phương Anh', '556677889', '2001-06-20', 1, 'Vietnam', 'Dong Thap', 'Dong Thap', '10,000,000', '8,000,000', 'anh.le1@gmail.com', '0977889900', 9, 6, '2025-05-20', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (114, 'Phạm Hoàng Hải', '667788990', '1997-07-22', 0, 'Vietnam', 'An Giang', 'An Giang', '10,000,000', '8,000,000', 'hai.pham1@yahoo.com', '0988990011', 9, 6, '2025-06-22', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (115, 'Vũ Thị Hồng Nhung', '778899001', '1998-08-25', 1, 'Vietnam', 'Kien Giang', 'Kien Giang', '10,000,000', '8,000,000', 'nhung.vu1@outlook.com', '0999001122', 9, 6, '2025-07-25', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (116, 'Đỗ Đức Mạnh', '889900112', '1999-09-28', 0, 'Vietnam', 'Bac Lieu', 'Bac Lieu', '10,000,000', '8,000,000', 'manh.do1@gmail.com', '0900112233', 9, 6, '2025-08-28', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (117, 'Nguyễn Thị Quỳnh Anh', '990011223', '2000-10-31', 1, 'Vietnam', 'Ca Mau', 'Ca Mau', '10,000,000', '8,000,000', 'anh.nguyen1@yahoo.com', '0911223344', 9, 6, '2025-09-30', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (118, 'Trần Văn Bình An', '001122334', '2001-12-03', 0, 'Vietnam', 'Tra Vinh', 'Tra Vinh', '10,000,000', '8,000,000', 'an.tran1@outlook.com', '0922334455', 9, 6, '2025-11-03', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (119, 'Lê Thị Cẩm Tú', '112233440', '1997-01-05', 1, 'Vietnam', 'Soc Trang', 'Soc Trang', '10,000,000', '8,000,000', 'tu.le1@gmail.com', '0933445577', 9, 6, '2025-12-05', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (120, 'Lê Thị Cẩm Tú', '112233440', '1997-01-05', 1, 'Vietnam', 'Soc Trang', 'Soc Trang', '15,000,000', '17,000,000', 'tu.le@gmail.com', '0933445577', 9, 6, '2025-12-05', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (121, 'Nguyễn Thị Hà', '123456791', '1998-02-10', 1, 'Vietnam', 'Hanoi', 'Hanoi', '15,000,000', '17,000,000', 'ha.nguyen@gmail.com', '0912345680', 9, 6, '2024-01-15', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (122, 'Trần Thị Mai', '987654323', '1999-03-12', 1, 'Vietnam', 'Ho Chi Minh City', 'Ho Chi Minh City', '15,000,000', '17,000,000', 'mai.tran@yahoo.com', '0987654323', 9, 6, '2024-02-20', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (123, 'Lê Thị Hương', '456789125', '2000-04-18', 1, 'Vietnam', 'Da Nang', 'Da Nang', '15,000,000', '17,000,000', 'huong.le@outlook.com', '0901234569', 9, 6, '2024-03-28', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');
INSERT INTO employees (id, full_name, number_id, date_of_birth, sex, nationality, place_of_origin, place_of_residence, salary, salary_allowance, email, phone, department_id, position_id, hire_date, status, created_by, updated_by, created_at, updated_at) VALUES (124, 'Phạm Thị Thúy', '789123458', '2001-05-22', 1, 'Vietnam', 'Hai Phong', 'Hai Phong', '15,000,000', '17,000,000', 'thuy.pham@gmail.com', '0934567892', 9, 6, '2024-04-01', 1, null, null, '2025-05-27 14:01:43', '2025-05-27 14:01:43');



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
INSERT INTO configs (type, code, name, name_en, description)
VALUES ('company','companyPosition','Giám đốc', 'Director', '');

