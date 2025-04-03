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

-- Create job_applicants table
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
DESCRIBE applicant_education;
        
SELECT * FROM job_applicants;

SELECT * FROM applicant_education;
