import db from "../utils/db.js";

/**
 * ✅ Register a new company
 * - Extracts userId from `req.user`
 * - Inserts company into the database
 * - Returns the newly created company
 */
export const registerCompany = async (req, res) => {
    console.log("🔍 Received User ID:", req.user?.id);
    console.log("📝 Received Body:", req.body);

    const { name } = req.body;
    const userId = req.user?.id; // ✅ Extract from authenticated request

    // 🚨 Ensure user is authenticated
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User ID missing", success: false });
    }

    // 🚨 Validate input
    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Company name is required", success: false });
    }

    try {
        // ✅ Insert into DB
        const [result] = await db.execute(
            "INSERT INTO companies (name, userId) VALUES (?, ?)", 
            [name, userId]
        );

        const insertedId = result.insertId;

        // ✅ Fetch newly inserted company
        const [company] = await db.execute("SELECT * FROM companies WHERE id = ?", [insertedId]);

        return res.status(201).json({ 
            message: "Company registered successfully", 
            success: true,
            company: company[0], // ✅ Return new company
        });
    } catch (error) {
        console.error("❌ Error inserting company:", error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

/**
 * ✅ Get company by ID
 */
export const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Fetch company
        const [companies] = await db.execute("SELECT * FROM companies WHERE id = ?", [id]);

        if (companies.length === 0) {
            return res.status(404).json({ message: "Company not found", success: false });
        }

        return res.status(200).json({ company: companies[0], success: true });
    } catch (error) {
        console.error("❌ Error fetching company by ID:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

/**
 * ✅ Get all companies
 * - Returns 404 if no companies exist
 */
export const getCompany = async (req, res) => {
    try {
        // ✅ Fetch all companies
        const [companies] = await db.execute("SELECT * FROM companies");

        if (!companies.length) {
            return res.status(404).json({
                message: "No companies found.",
                success: false
            });
        }

        return res.status(200).json({
            companies,
            success: true
        });

    } catch (error) {
        console.error("❌ Error fetching companies:", error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

/**
 * ✅ Update company details
 */
export const updateCompany = async (req, res) => {
    try {
        const { name } = req.body;
        const companyId = req.params.id;

        const updateFields = [];
        const values = [];

        if (name) {
            updateFields.push("name = ?");
            values.push(name);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                message: "No fields provided for update.",
                success: false
            });
        }

        values.push(companyId);

        const [result] = await db.execute(
            `UPDATE companies SET ${updateFields.join(", ")} WHERE id = ?`,
            values
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        // ✅ Return updated company
        const [updatedCompany] = await db.execute("SELECT * FROM companies WHERE id = ?", [companyId]);

        return res.status(200).json({
            message: "Company information updated successfully.",
            success: true,
            company: updatedCompany[0], // ✅ Return updated company
        });

    } catch (error) {
        console.error("❌ Error updating company:", error);
        return res.status(500).json({
            message: "Server error.",
            success: false
        });
    }
};
