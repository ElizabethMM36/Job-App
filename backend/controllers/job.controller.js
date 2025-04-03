import db from "../utils/db.js";

export const postJob = async (req, res) => {
    try {
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
