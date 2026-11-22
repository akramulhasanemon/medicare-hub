-- ========================================================
-- MediCare Hub Full Extended Database Schema
-- Database: medicare_db
-- ========================================================

CREATE DATABASE IF NOT EXISTS medicare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE medicare_db;

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'HeartPulse',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users Table (Patients, Doctors, Lab Employees, Accountants, Admins)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(20) UNIQUE NULL, -- Auto-increment code e.g. P01, D101, L101, A101
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'lab_staff', 'accountant', 'admin') DEFAULT 'patient',
    phone VARCHAR(20),
    gender ENUM('Male', 'Female', 'Other') DEFAULT 'Male',
    age INT,
    blood_group VARCHAR(10),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    doctor_code VARCHAR(20) UNIQUE NULL, -- e.g. D101, D102
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    department_id INT,
    qualification VARCHAR(150) NOT NULL,
    experience_years INT DEFAULT 5,
    consultation_fee DECIMAL(10,2) DEFAULT 500.00,
    available_days VARCHAR(100) DEFAULT 'Sat, Sun, Mon, Tue, Wed',
    available_time VARCHAR(100) DEFAULT '05:00 PM - 09:00 PM',
    rating DECIMAL(2,1) DEFAULT 4.8,
    bio TEXT,
    image_url TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 4. Lab Employees Table
CREATE TABLE IF NOT EXISTS lab_employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    employee_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. L101, L102
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    specialization VARCHAR(150),
    department VARCHAR(100) DEFAULT 'Pathology & Diagnostic Lab',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 5. Accounts Staff Table
CREATE TABLE IF NOT EXISTS accounts_staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    account_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. A101, A102
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    designation VARCHAR(150) DEFAULT 'Accounts Officer',
    section VARCHAR(100) DEFAULT 'Billing & Cash Counter',
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 6. Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NULL,
    patient_code VARCHAR(20) NULL,
    doctor_id INT NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    patient_email VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    symptoms TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- 7. Pharmacy Medicines Table
CREATE TABLE IF NOT EXISTS medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL,
    form VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    manufacturer VARCHAR(150),
    description TEXT,
    image_url TEXT,
    stock INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Pharmacy Orders Table
CREATE TABLE IF NOT EXISTS pharmacy_orders (
    id VARCHAR(50) PRIMARY KEY,
    patient_id INT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    delivery_address TEXT NOT NULL,
    items JSON NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Cash on Delivery',
    status ENUM('Processing', 'Dispatched', 'Delivered', 'Cancelled') DEFAULT 'Processing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. Diagnostic & Lab Bookings Table
CREATE TABLE IF NOT EXISTS lab_bookings (
    id VARCHAR(50) PRIMARY KEY,
    patient_id INT NULL,
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    package_name VARCHAR(150) NOT NULL,
    booking_date DATE NOT NULL,
    collection_type VARCHAR(100) DEFAULT 'Home Sample Collection',
    price DECIMAL(10,2) NOT NULL,
    status ENUM('Pending', 'Confirmed', 'Completed', 'Cancelled') DEFAULT 'Pending',
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 10. Emergency Ambulance Requests Table
CREATE TABLE IF NOT EXISTS ambulance_requests (
    id VARCHAR(50) PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    pickup_address TEXT NOT NULL,
    ambulance_type VARCHAR(150) NOT NULL,
    status ENUM('Dispatched', 'En Route', 'Arrived', 'Completed', 'Cancelled') DEFAULT 'Dispatched',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- Initial Seed Data
-- ========================================================

-- Demo Users (Admin, Doctor D101, Lab L101, Accounts A101, Patient P01)
INSERT INTO users (patient_id, name, email, password, role, phone, blood_group) VALUES
('ADMIN', 'MediCare Admin', 'admin@medicare.com', '$2y$10$wT8K0GfN7v54u2L4Jc8tse9.7sH7q2fO6mZq7e6V8yWk2a5M0eO6e', 'admin', '01700000000', 'O+'),
('D101', 'Prof. Dr. Mahfuzur Rahman', 'doctor@medicare.com', '$2y$10$wT8K0GfN7v54u2L4Jc8tse9.7sH7q2fO6mZq7e6V8yWk2a5M0eO6e', 'doctor', '01711000000', 'A+'),
('L101', 'Md. Rafiqul Islam', 'lab@medicare.com', '$2y$10$wT8K0GfN7v54u2L4Jc8tse9.7sH7q2fO6mZq7e6V8yWk2a5M0eO6e', 'lab_staff', '01711223344', 'O+'),
('A101', 'Kamal Hossain', 'accounts@medicare.com', '$2y$10$wT8K0GfN7v54u2L4Jc8tse9.7sH7q2fO6mZq7e6V8yWk2a5M0eO6e', 'accountant', '01733445566', 'B+'),
('P01', 'John Doe', 'patient@medicare.com', '$2y$10$wT8K0GfN7v54u2L4Jc8tse9.7sH7q2fO6mZq7e6V8yWk2a5M0eO6e', 'patient', '01811112233', 'B+')
ON DUPLICATE KEY UPDATE name=VALUES(name);
