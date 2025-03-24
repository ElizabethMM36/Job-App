import db from "../utils/db.js";

export const registerCompany = async (req, res) => {
    try {
        const { name, description, location, industry } = req.body;
        const userId = req.id;

        if (!name || !description || !location || !industry) {
            return res.status(400).json({ message: "Missing fields", success: false });
        }

        await db.execute(
            "INSERT INTO companies (name, description, location, industry, created_by) VALUES (?, ?, ?, ?, ?)",
            [name, description, location, industry, userId]
        );

        return res.status(201).json({ message: "Company registered successfully", success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const [companies] = await db.execute("SELECT * FROM companies WHERE id = ?", [id]);
        if (companies.length === 0) {
            return res.status(404).json({ message: "Company not found", success: false });
        }
        return res.status(200).json({ company: companies[0], success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
 // MySQL connection

export const getCompany = async (req, res) => {
    try {
        const userId = req.id; // Logged-in user ID from authentication middleware

        // Fetch companies where userId is the owner
        const [companies] = await db.execute(
            `SELECT * FROM companies WHERE user_id = ?`,
            [userId]
        );

        if (companies.length === 0) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }

        return res.status(200).json({
            companies,
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


export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        const companyId = req.params.id; // Get company ID from request params

        let logoUrl = null;

        // Upload new logo to Cloudinary if a file is provided
        if (req.file) {
            const fileUri = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            logoUrl = cloudResponse.secure_url;
        }

        // Prepare update query
        const updateFields = [];
        const values = [];

        if (name) {
            updateFields.push("name = ?");
            values.push(name);
        }
        if (description) {
            updateFields.push("description = ?");
            values.push(description);
        }
        if (website) {
            updateFields.push("website = ?");
            values.push(website);
        }
        if (location) {
            updateFields.push("location = ?");
            values.push(location);
        }
        if (logoUrl) {
            updateFields.push("logo = ?");
            values.push(logoUrl);
        }

        // If no fields are being updated, return an error
        if (updateFields.length === 0) {
            return res.status(400).json({
                message: "No fields provided for update.",
                success: false
            });
        }

        values.push(companyId); // Add company ID at the end for the WHERE clause

        // Execute MySQL Update Query
        const [result] = await db.execute(
            `UPDATE companies SET ${updateFields.join(", ")} WHERE id = ?`,
            values
        );

        // Check if any row was updated
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
};