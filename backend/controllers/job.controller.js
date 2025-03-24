import db from "../utils/db.js";

export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id; // Authenticated admin ID

        if (!title || !description || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({ message: "Missing fields", success: false });
        }

        await db.execute(
            "INSERT INTO jobs (title, description, requirements, salary, location, jobType, experienceLevel, position, companyId, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [title, description, requirements, salary, location, jobType, experience, position, companyId, userId]
        );

        return res.status(201).json({ message: "Job posted successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const [jobs] = await db.execute(
            "SELECT * FROM jobs WHERE title LIKE ? OR description LIKE ? ORDER BY createdAt DESC",
            [`%${keyword}%`, `%${keyword}%`]
        );
        return res.status(200).json({ jobs, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
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
        const adminId = req.id; // Extracted from middleware authentication

        // Fetch jobs created by the admin, along with company details
        const [jobs] = await db.execute(
            `SELECT jobs.*, companies.name AS companyName 
             FROM jobs 
             JOIN companies ON jobs.company_id = companies.id 
             WHERE jobs.created_by = ? 
             ORDER BY jobs.createdAt DESC`, 
            [adminId]
        );

        if (jobs.length === 0) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};
