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
import { updateProfile } from "../api"; // ✅ Import API function

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
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Move updateProfile call inside handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Now `formData` is properly defined here
      const response = await updateProfile(formData);
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

          <Button type="submit" variant="contained" color="primary">
            Save Profile
          </Button>

          <Button variant="outlined" color="secondary" onClick={() => navigate("/applicant-education")}>
            Add Education Details
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
