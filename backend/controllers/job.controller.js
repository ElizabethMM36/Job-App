import db from "../utils/db.js";
import { getJobs } from '../models/job.model.js';

export const postJob = async (req, res) => {
    try {
        if (req.user.role !== 'recruiter') return res.status(403).json({message:"Only recruiters can post jobs", success: false});
        if(req.user.status !== 'verified') return res.status(403).json({message:"Your account is not approved to post jobs", success: false});
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.user.id; // Use req.user.id instead of req.id for the authenticated admin's ID

        // Validate required fields
        if (!title || !description || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({ message: "Missing fields", success: false });
        }

        // Insert the job into the database
        await db.execute(
            "INSERT INTO jobs (title, description, requirements, salary, location, jobType, experience, position, companyId, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [title, description, requirements, salary, location, jobType, experience, position, companyId, userId] // Use userId for created_by
        );

        return res.status(201).json({ message: "Job posted successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
export const applyForJob = async (req, res) => {
    try {
        console.log("📥 Incoming applyForJob request...");

        const { job_id } = req.body;
        console.log("🪵 Request Body:", req.body);

        const user = req.user;
        console.log("🪪 Authenticated User:", user);

        const applicant_id = user?.applicant_id;
        console.log("🔍 Applicant ID:", applicant_id);

        if (!job_id || !applicant_id) {
            return res.status(400).json({ message: "Missing job_id or applicant_id", success: false });
        }

        // ✅ Check if the job exists
        const [jobRows] = await db.execute("SELECT created_by FROM jobs WHERE id = ?", [job_id]);
        console.log("📄 Job Fetch Result:", jobRows);

        if (!jobRows.length) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        const recruiter_id = jobRows[0].created_by;
        console.log("👨‍💼 Recruiter ID:", recruiter_id);

        // ✅ Check for existing application
        const [existingApplications] = await db.execute(
            "SELECT * FROM job_applications WHERE job_id = ? AND applicant_id = ?",
            [job_id, applicant_id]
        );
        console.log("🔁 Existing Application Check:", existingApplications);

        if (existingApplications.length > 0) {
            return res.status(400).json({ message: "You have already applied for this job", success: false });
        }

        // ✅ Fetch applicant details
        const [applicantData] = await db.execute(
            "SELECT full_name, email, phone, preferred_position, experience FROM job_applicants WHERE applicant_id = ?",
            [applicant_id]
        );
        console.log("🧾 Applicant Details:", applicantData);

        if (applicantData.length === 0) {
            return res.status(404).json({ message: "Applicant details not found", success: false });
        }

        const { full_name, email, phone, preferred_position, experience } = applicantData[0];

        // ✅ Fetch highest education
        const [educationData] = await db.execute(
            `SELECT institution, degree, end_year, cgpa 
             FROM applicant_education 
             WHERE applicant_id = ? 
             ORDER BY end_year DESC 
             LIMIT 1`,
            [applicant_id]
        );
        console.log("🎓 Highest Education:", educationData);

        let highestEducation = null;
        if (educationData.length > 0) {
            const { institution, degree, end_year, cgpa } = educationData[0];
            highestEducation = `${degree} from ${institution} (Year: ${end_year}, CGPA: ${cgpa})`;
        }

        // ✅ Insert the application
        const values = [
            job_id,
            applicant_id,
            recruiter_id,
            full_name,
            email,
            phone,
            preferred_position,
            experience,
            highestEducation,
            "Pending"
        ];

        console.log("📤 Inserting into job_applications with values:", values);

        await db.execute(
            `INSERT INTO job_applications 
                (job_id, applicant_id, recruiter_id, full_name, email, phone, preferred_position, experience, highest_education, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            values
        );

        return res.status(200).json({ message: "Application submitted successfully", success: true });

    } catch (error) {
        console.error("🔥 Error applying for job:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};


export const getAllJobs = async (req, res) => {
    try {
        console.log("📩 Received Request: GET /api/jobs/get");

        const jobs = await getJobs();  // ✅ Now uses the corrected function

        console.log("🟢 Jobs Fetched:", jobs);
        res.status(200).json({
            success: true,
            jobs,
        });
    } catch (error) {
        console.error("❌ Server error while fetching jobs:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
export const updateApplicationStatus = async (req, res) => {
    try {
        const { application_id, new_status } = req.body;

        const validStatuses = ['Pending', 'Accepted', 'Rejected', 'Waitlisted'];
        if (!validStatuses.includes(new_status)) {
            return res.status(400).json({ success: false, message: "Invalid status value" });
        }

        // Use application_id instead of id
        await db.execute(
            `UPDATE job_applications SET status = ? WHERE id = ?`,
            [new_status, application_id]
        );

        res.status(200).json({ success: true, message: "Status updated successfully" });
    } catch (error) {
        console.error("❌ Error updating application status:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



export const getJobById = async (req, res) => {
    try {
        const { id } = req.params;
        const [jobs] = await db.execute("SELECT * FROM jobs WHERE id = ?", [id]);
        if (jobs.length === 0) {
            return res.status(404).json({ message: "Job not found", success: false });
        }
        return res.status(200).json({ job: jobs[0], success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getAdminJobs = async (req, res) => {
    try {
        console.log("🔍 Incoming request to getAdminJobs");

        const adminId = req.user?.id;
        if (!adminId) {
            console.error("❌ Admin ID not found in request.");
            return res.status(401).json({ message: "Unauthorized", success: false });
        }

        console.log(`✅ Fetching jobs for admin ID: ${adminId}`);

        // Ensure the correct join: jobs.companyId = companies.id
        const [jobs] = await db.execute(
            `SELECT jobs.*, companies.name AS companyName
             FROM jobs 
             JOIN companies ON jobs.companyId = companies.id 
             WHERE jobs.created_by = ? 
             ORDER BY jobs.createdAt DESC`, 
            [adminId]
        );

        console.log(`✅ Found ${jobs.length} jobs.`);
        console.log("Jobs Data:", jobs); // Debugging log

        return res.status(200).json({ jobs, success: true });

    } catch (error) {
        console.error("❌ Error fetching admin jobs:", error);
        return res.status(500).json({
            message: "Server error",
            error: error.message,
            success: false
        });
    }
};
export const getJobApplications = async (req, res) => {
    try {
        const recruiterId = req.user?.id;

        const [applications] = await db.execute(
            `SELECT 
                ja.id AS application_id,        -- use 'id' as primary key
                ja.status,
                ja.job_id,
                ja.full_name,
                ja.email,
                ja.phone,
                ja.preferred_position,
                ja.experience,
                ja.highest_education,
                j.title AS job_title
             FROM job_applications ja
             JOIN jobs j ON ja.job_id = j.id
             WHERE ja.recruiter_id = ?`,
            [recruiterId]
        );

        res.status(200).json({ success: true, applications });
    } catch (error) {
        console.error("❌ Error fetching job applications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const updateJob = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, requirements, salary, location, jobType, experience, position } = req.body;

        // Validate required fields
        if (!title || !description || !salary || !location || !jobType || !experience || !position) {
            return res.status(400).json({ message: "Missing fields", success: false });
        }

        // Update the job in the database
        await db.execute(
            "UPDATE jobs SET title = ?, description = ?, requirements = ?, salary = ?, location = ?, jobType = ?, experienceLevel = ?, position = ? WHERE id = ?",
            [title, description, requirements, salary, location, jobType, experience, position, id]
        );

        return res.status(200).json({ message: "Job updated successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const [applications] = await db.execute(
      `SELECT 
          j.title AS job_title, 
          ja.status AS application_status,
          ja.applied_at
       FROM job_applications ja
       JOIN jobs j ON ja.job_id = j.id
       WHERE ja.applicant_id = ?
       ORDER BY ja.applied_at DESC`,
      [userId]
    );

    return res.status(200).json({ appliedJobs: applications, success: true });
  } catch (error) {
    console.error("SQL Error:", error.sqlMessage || error.message);
    console.error("SQL Query:", error.sql);
    res.status(500).json({ message: "Server error", success: false });
  }
};
