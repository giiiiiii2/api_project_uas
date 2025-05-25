-- Pastikan kolom role pada tabel users mendukung multi-role
ALTER TABLE users MODIFY COLUMN role ENUM('patient', 'doctor', 'admin') NOT NULL DEFAULT 'patient';

-- Tambahkan kolom untuk profil dokter
ALTER TABLE users ADD COLUMN specialization VARCHAR(100) NULL AFTER gender;
ALTER TABLE users ADD COLUMN practice_years INT NULL AFTER specialization;
ALTER TABLE users ADD COLUMN doctor_license VARCHAR(50) NULL AFTER practice_years;
ALTER TABLE users ADD COLUMN doctor_bio TEXT NULL AFTER doctor_license;
ALTER TABLE users ADD COLUMN consultation_fee DECIMAL(10,2) NULL AFTER doctor_bio;
ALTER TABLE users ADD COLUMN available_days VARCHAR(100) NULL AFTER consultation_fee;
ALTER TABLE users ADD COLUMN available_hours VARCHAR(100) NULL AFTER available_days;
ALTER TABLE users ADD COLUMN category VARCHAR(50) NULL AFTER available_hours;

