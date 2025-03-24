import db from "../utils/db.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id; // Authenticated user ID
        const { id: jobId } = req.params;
        const { resume, coverLetter } = req.body;

        if (!resume || !coverLetter) {
            return res.status(400).json({ message: "Resume and cover letter are required", success: false });
        }

        // Check if the job exists
        const [job] = await db.execute("SELECT * FROM jobs WHERE id = ?", [jobId]);
        if (job.length === 0) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        // Check if user has already applied
        const [existingApplication] = await db.execute(
            "SELECT * FROM applications WHERE userId = ? AND jobId = ?", 
            [userId, jobId]
        );
        if (existingApplication.length > 0) {
            return res.status(400).json({ message: "You have already applied for this job", success: false });
        }

        // Insert application into the database
        await db.execute(
            "INSERT INTO applications (userId, jobId, resume, coverLetter, status) VALUES (?, ?, ?, ?, ?)", 
            [userId, jobId, resume, coverLetter, "Pending"]
        );

        return res.status(201).json({ message: "Job application submitted successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id; // Authenticated user ID

        // Fetch jobs the user has applied for
        const [applications] = await db.execute(
            `SELECT jobs.*, applications.status 
            FROM applications 
            JOIN jobs ON applications.jobId = jobs.id 
            WHERE applications.userId = ? 
            ORDER BY applications.createdAt DESC`, 
            [userId]
        );

        return res.status(200).json({ appliedJobs: applications, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getApplicants = async (req, res) => {
    try {
        const { id: jobId } = req.params;

        // Check if the job exists
        const [job] = await db.execute("SELECT * FROM jobs WHERE id = ?", [jobId]);
        if (job.length === 0) {
            return res.status(404).json({ message: "Job not found", success: false });
        }

        // Fetch applicants for the job
        const [applicants] = await db.execute(
            `SELECT users.id, users.fullname, users.email, users.phoneNumber, applications.resume, applications.coverLetter, applications.status 
            FROM applications 
            JOIN users ON applications.userId = users.id 
            WHERE applications.jobId = ? 
            ORDER BY applications.createdAt DESC`, 
            [jobId]
        );

        return res.status(200).json({ applicants, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { id: applicationId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required", success: false });
        }

        // Check if the application exists
        const [application] = await db.execute("SELECT * FROM applications WHERE id = ?", [applicationId]);
        if (application.length === 0) {
            return res.status(404).json({ message: "Application not found", success: false });
        }

        // Update the application status
        await db.execute("UPDATE applications SET status = ? WHERE id = ?", [status, applicationId]);

        return res.status(200).json({ message: "Application status updated successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
