CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phoneNumber VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'recruiter') NOT NULL,
    profilePhoto VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    userId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    salary INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    jobType VARCHAR(50) NOT NULL,
    experience VARCHAR(50) NOT NULL,
    position VARCHAR(255) NOT NULL,
    companyId INT NOT NULL,
    created_by INT NOT NULL,
    FOREIGN KEY (companyId) REFERENCES companies(id),
    FOREIGN KEY (created_by) REFERENCES users(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    jobId INT NOT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (jobId) REFERENCES jobs(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE users MODIFY role VARCHAR(20);
SELECT*FROM users;
SELECT*FROM companies;
ALTER TABLE users MODIFY role ENUM('admin', 'recruiter', 'jobseeker') NOT NULL;
UPDATE users SET role = 'jobseeker' WHERE role = 'student';
SELECT * FROM users WHERE email = 'devikas@gmail.com';

INSERT INTO applications (id, userId, jobId, status, createdAt)
VALUES (
    id:intSHOW CREATE TABLE jobs;,
    userId:int,
    jobId:int,
    'status:enum',
    'createdAt:timestamp'
  );
ALTER TABLE jobs
MODIFY COLUMN createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
SHOW CREATE TABLE jobs
DESCRIBE jobs;

INSERT INTO job_applicants (
    applicant_id,
    username,
    password,
    full_name,
    birth_year,
    current_location,
    phone,
    email,
    preferred_position,
    industry_fields
  )
VALUES (
    applicant_id:int,
    'username:varchar',
    'password:varchar',
    'full_name:varchar',
    birth_year:int,
    'current_location:varchar',
    'phone:varchar',
    'email:varchar',
    'preferred_position:varchar',
    'industry_fields:varchar'
  );-- Create job_applicants table
CREATE TABLE IF NOT EXISTS job_applicants (
    applicant_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    birth_year INT NOT NULL,
    current_location VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    preferred_position VARCHAR(255),
    industry_fields VARCHAR(255)
);
 CREATE TABLE IF NOT EXISTS applicant_education (
        education_id INT AUTO_INCREMENT PRIMARY KEY,
        applicant_id INT NOT NULL,
        institution VARCHAR(255) NOT NULL,
        degree VARCHAR(255) NOT NULL,
        start_year INT NOT NULL,
        end_year INT,
        certificate_files TEXT, 
        FOREIGN KEY (applicant_id) REFERENCES job_applicants(applicant_id) ON DELETE CASCADE
    );
DESCRIBE applicant_education;
        
SELECT * FROM job_applicants;

SELECT * FROM applicant_education;
ALTER TABLE job_applicants ADD COLUMN experience INT;
SELECT * FROM job_applicants;
SELECT * FROM job_applicants WHERE applicant_id = 12;
ALTER TABLE job_applicants MODIFY COLUMN password VARCHAR(255) NULL;
SELECT applicant_id FROM job_applicants WHERE username = 12;
SHOW COLUMNS FROM jobs LIKE 'salary';
ALTER TABLE jobs MODIFY salary VARCHAR(20);
ALTER TABLE applicant_education 
ADD COLUMN cgpa DECIMAL(3,2) NOT NULL, 
ADD COLUMN college_location VARCHAR(255) NOT NULL;
SELECT * FROM applicant_education WHERE applicant_id = 2;
DELETE FROM applicant_education WHERE education_id =18;
SELECT * FROM applicant_education WHERE applicant_id = 2;
CREATE TABLE job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    applicant_id INT NOT NULL,
    recruiter_id INT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES job_applicants(applicant_id) ON DELETE CASCADE,
    FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
);
ALTER TABLE job_applicants ADD COLUMN status VARCHAR(20) NULL;
ALTER TABLE job_applicants MODIFY COLUMN status VARCHAR(20) NULL;
ALTER TABLE job_applicants DROP COLUMN status;
ALTER TABLE job_applications ADD COLUMN status VARCHAR(50) NULL;
ALTER TABLE job_applications
ADD COLUMN full_name VARCHAR(255) NOT NULL;

ALTER TABLE job_applications
ADD COLUMN email VARCHAR(255) NOT NULL;

ALTER TABLE job_applications
ADD COLUMN phone VARCHAR(20) NOT NULL;

ALTER TABLE job_applications
ADD COLUMN preferred_position VARCHAR(255);

ALTER TABLE job_applications
MODIFY COLUMN status ENUM('Pending', 'Accepted', 'Rejected', 'Waitlisted') DEFAULT NULL;

ALTER TABLE job_applications
ADD COLUMN full_name VARCHAR(255)