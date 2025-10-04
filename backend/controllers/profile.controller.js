import db from "../utils/db.js";

// GET PROFILE (jobseeker or recruiter)
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user info
    const [userRows] = await db.execute("SELECT * FROM users WHERE user_id = ?", [userId]);
    if (!userRows.length) return res.status(404).json({ message: "User not found", success: false });

    const user = userRows[0];

    let profile = {};
    if (user.role === "jobseeker") {
      const [jobseekerRows] = await db.execute("SELECT * FROM job_applicants WHERE applicant_id = ?", [userId]);
      profile = jobseekerRows[0] || {};
    } else if (user.role === "recruiter") {
      const [recruiterRows] = await db.execute("SELECT * FROM recruiters WHERE user_id = ?", [userId]);
      profile = recruiterRows[0] || {};
    }

    res.json({ success: true, profile: { ...user, ...profile } });
  } catch (error) {
    console.error("❌ Get Profile Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname, phoneNumber, email, birth_year, current_location, preferred_position, industry_fields, experience,
      contact_name, position, company_name, company_address, company_email, company_phone, locations, services, hiring_preferences } = req.body;

    // Update companies table
    await db.execute(
     `INSERT INTO companies (name, userId,status) VALUES (?, ?,?)`,
            [company_name, userId,'pending']
    );

    const userRole = req.user.role;

    if (userRole === "jobseeker") {
      // Update job_applicants
      await db.execute(
        `UPDATE job_applicants SET full_name=?, email=?, phone=?, birth_year=?, current_location=?, preferred_position=?, industry_fields=?, experience=?
         WHERE applicant_id=?`,
        [fullname, email, phoneNumber, birth_year, current_location, preferred_position, industry_fields ? JSON.stringify(industry_fields) : null, experience, userId]
      );
    } else if (userRole === "recruiter") {
      // Update recruiters
      await db.execute(
        `UPDATE recruiters SET  position=?,  company_name=?, company_address=?, company_email=?, company_phone=?, locations=?, services=?, hiring_preferences=?, status=?
         WHERE user_id=?`,
        [
          position,
          company_name,
          company_address,
          company_email,
          company_phone,
          locations ? JSON.stringify(locations) : null,
          services,
          hiring_preferences ? JSON.stringify(hiring_preferences) : null,
          "pending", // reset recruiter status to pending after profile update
          userId
        ]
      );
    }

    res.status(200).json({ message: "Profile updated successfully (awaiting admin approval if recruiter)", success: true });
  } catch (error) {
    console.error("❌ Update Profile Error:", error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
