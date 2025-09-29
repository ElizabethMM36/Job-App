import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container } from "@mui/material";
import API from "../api"; // ✅ Import API file
import { addEducation } from "../api"; // Import API functions

const ApplicantEducation = () => {
  const navigate = useNavigate();
  const [education, setEducation] = useState({
    institution: "",
    degree: "",
    start_year: "",
    end_year: "",
    cgpa: "",
    college_location: "",
    certificate_file: null, // File object
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEducation((prev) => ({ ...prev, [name]: value }));
  };

  // Handle certificate upload (only PDFs allowed)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setEducation((prev) => ({ ...prev, certificate_file: file }));
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  // Submit Form (Save Education Data)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
        // ✅ Save education details first
        const response = await addEducation({
            institution: education.institution,
            degree: education.degree,
            start_year: education.start_year,
            end_year: education.end_year || null,
            cgpa: education.cgpa,
            college_location: education.college_location,
        });

        console.log("✅ Education saved:", response);
        const { education_id } = response; // ✅ Get education_id from API response

        // ✅ Upload certificate (if present)
        if (education.certificate_file) {
            const formData = new FormData();
            formData.append("certificate", education.certificate_file);
            formData.append("education_id", education_id); // ✅ Use correct key

            console.log("📤 Uploading certificate:", education.certificate_file);

            const uploadResponse = await API.post("/education/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("✅ Certificate uploaded:", uploadResponse.data);
        }

        alert("Education details saved successfully!");
        navigate("/profile");
    } catch (error) {
        console.error("❌ Error saving education details:", error.response?.data || error.message);
        alert("Failed to save education details.");
    }
};

  return (
    <Container maxWidth="sm" style={{ marginTop: "30px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Add Education Details
      </Typography>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField label="Institution Name" name="institution" value={education.institution} onChange={handleChange} required fullWidth />
        <TextField label="Degree" name="degree" value={education.degree} onChange={handleChange} required fullWidth />
        <TextField label="Start Year" name="start_year" type="number" value={education.start_year} onChange={handleChange} required fullWidth />
        <TextField label="End Year (if applicable)" name="end_year" type="number" value={education.end_year} onChange={handleChange} fullWidth />
        <TextField label="CGPA" name="cgpa" type="number" step="0.01" value={education.cgpa} onChange={handleChange} required fullWidth />
        <TextField label="College Location" name="college_location" value={education.college_location} onChange={handleChange} required fullWidth />

        {/* Certificate Upload (PDF Only) */}
        <input type="file" accept="application/pdf" onChange={handleFileChange} />

        {/* Submit and Back Buttons */}
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: "10px" }}>
          Save Education Details
        </Button>

        <Button variant="outlined" color="secondary" onClick={() => navigate(-1)} style={{ marginTop: "10px" }}>
          Back to Profile
        </Button>
      </form>
    </Container>
  );
};

export default ApplicantEducation;
