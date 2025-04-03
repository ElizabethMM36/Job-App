import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Container } from "@mui/material";

const ApplicantEducation = () => {
  const navigate = useNavigate();

  const [education, setEducation] = useState({
    institution: "",
    degree: "",
    start_year: "",
    end_year: "",
    certificate_file: null,
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

  // Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Education Data Submitted:", education);
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

        {/* Certificate Upload (PDF Only) */}
        <input type="file" accept="application/pdf" onChange={handleFileChange} required />

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
