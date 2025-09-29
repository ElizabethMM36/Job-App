ALTER TABLE users
ADD COLUMN status ENUM('pending','verified','rejected') DEFAULT 'pending';

ALTER TABLE applicant_education
ADD COLUMN status ENUM('pending','verified','rejected') DEFAULT 'pending';

CREATE TABLE recruiters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    comapany_name VARCHAR(255) NOT NULL,
    company_address VARCHAR(255) NOT NULL,
    company_email VARCHAR(255) NOT NULL,
    company_phone VARCHAR(255) NOT NULL,
    locations VARCHAR(255) NOT NULL,
    services VARCHAR(255) NOT NULL,
    
    hiring_preferences VARCHAR(255) NOT NULL,
    status ENUM('pending','verified','rejected') DEFAULT 'pending',
    
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE 
);
ALTER TABLE users
RENAME COLUMN id TO user_id;

SHOW CREATE TABLE recruiters;
ALTER TABLE recruiters DROP COLUMN username;
ALTER TABLE recruiters ADD COLUMN recruiter_id INT AUTO_INCREMENT PRIMARY KEY FIRST;

ALTER TABLE recruiters 
DROP FOREIGN KEY recruiters_ibfk_1;

ALTER TABLE recruiters 
ADD CONSTRAINT fk_recruiter_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;
DROP TABLE certificates ;
CREATE TABLE IF NOT EXISTS certificates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  applicant_id INT NOT NULL,
  file_url VARCHAR(1024) NOT NULL,
  name VARCHAR(255),
  status ENUM('pending','verified','rejected') DEFAULT 'pending',
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_by INT NULL,
  verified_at TIMESTAMP NULL,
  FOREIGN KEY (applicant_id) REFERENCES job_applicants(applicant_id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES users(user_id) ON DELETE SET NULL
);

ALTER TABLE job_applicants
MODIFY COLUMN current_location VARCHAR(255);