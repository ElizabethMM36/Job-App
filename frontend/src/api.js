import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Adjust if needed
  withCredentials: true, // If your backend requires authentication cookies
});

// ✅ **Function to update applicant profile**
export const updateProfile = async (formData) => {
  try {
    const token = localStorage.getItem("token"); // Get token from storage
    const response = await API.put("/profile/update", formData, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send token
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// ✅ **Function to add education details**
export const addEducation = async (educationData) => {
  try {
    const token = localStorage.getItem("token"); // Get token from storage
    const response = await API.post("/education/add", educationData, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send token
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding education details:", error);
    throw error;
  }
};

// ✅ **Function to update education details**
export const updateEducation = async (educationId, educationData) => {
  try {
    const token = localStorage.getItem("token"); // Get token from storage
    const response = await API.put(`/education/update/${educationId}`, educationData, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send token
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating education details:", error);
    throw error;
  }
};

// ✅ **Function to upload certificate file**
export const uploadCertificate = async (file, applicant_id) => {
  try {
    const token = localStorage.getItem("token"); // Get token from storage
    const formData = new FormData();
    formData.append("certificate", file);
    formData.append("applicant_id", applicant_id);

    const response = await API.post("/education/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send token
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading certificate:", error);
    throw error;
  }
};

// ✅ **Function to fetch all education details of a user**
export const getEducation = async () => {
  try {
    const token = localStorage.getItem("token"); // Get token from storage
    const response = await API.get("/education", {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching education details:", error);
    throw error;
  }
};

// ✅ **Function to delete an education entry**
export const deleteEducation = async (educationId) => {
  try {
    const token = localStorage.getItem("token"); // Get token from storage
    const response = await API.delete(`/education/delete/${educationId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting education:", error);
    throw error;
  }
};

export default API;
