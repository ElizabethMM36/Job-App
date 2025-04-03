import axios from "axios";
import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    birth_year: "",
    current_location: "",
    phone: "",
    email: "",
    preferred_position: "",
    industry_fields: "",
    experience: "",
    resume: null, // Stores uploaded file
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle resume upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setFormData((prev) => ({ ...prev, resume: file }));
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
  
    try {
        const response = await axios.post("http://localhost:5000/api/v1/profile/update", formDataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
         });
         
  
      console.log("Profile Saved:", response.data);
      alert("Profile saved successfully!");
      setOpen(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      {/* Modal Title with Close Button */}
      <DialogTitle>
        Update Profile
        <IconButton
          aria-label="close"
          onClick={() => setOpen(false)}
          style={{ position: "absolute", right: 15, top: 15 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Modal Content */}
      <DialogContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField label="Full Name" name="full_name" value={formData.full_name} onChange={handleChange} required />
          <TextField label="Birth Year" name="birth_year" type="number" value={formData.birth_year} onChange={handleChange} required />
          <TextField label="Current Location" name="current_location" value={formData.current_location} onChange={handleChange} required />
          <TextField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
          <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <TextField label="Preferred Position" name="preferred_position" value={formData.preferred_position} onChange={handleChange} required />
          <TextField label="Industry Fields" name="industry_fields" value={formData.industry_fields} onChange={handleChange} required />
          <TextField label="Experience (Years)" name="experience" type="number" value={formData.experience} onChange={handleChange} required />

          {/* Resume Upload (PDF) */}
          <input type="file" accept="application/pdf" onChange={handleFileChange} required />

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary">
            Save Profile
          </Button>

          {/* Navigate to Education Form */}
          <Button variant="outlined" color="secondary" onClick={() => navigate("/applicant-education")}>
            Add Education Details
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
