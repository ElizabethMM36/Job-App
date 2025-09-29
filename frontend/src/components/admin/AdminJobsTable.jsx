import { useEffect, useState } from "react";
import axios from "axios";

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem("token"); // Retrieve token from storage
                if (!token) {
                    throw new Error("Unauthorized: No authentication token found. Please log in.");
                }

                const response = await axios.get("http://localhost:5000/api/jobs/getadminjobs", {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach token in header
                        "Content-Type": "application/json",
                    },
                    withCredentials: true, // Ensure credentials (cookies) are sent
                });

                console.log("✅ Jobs Fetched:", response.data.jobs); // Debugging API response
                setJobs(response.data.jobs || []); // Ensure jobs is always an array
            } catch (error) {
                console.error("❌ Error fetching jobs:", error.response?.data || error.message);
                setError(error.response?.data?.message || "Failed to fetch jobs");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) return <p style={loadingStyle}>Loading jobs...</p>;
    if (error) return <p style={errorStyle}>{error}</p>;
    if (!jobs.length) return <p style={noJobsStyle}>No jobs found.</p>;

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>Admin Job Listings</h2>
            <table style={tableStyle}>
                <thead>
                    <tr style={theadStyle}>
                        <th style={thStyle}>Company Name</th>
                        <th style={thStyle}>Role</th>
                        <th style={thStyle}>Salary</th>
                        <th style={thStyle}>Location</th>
                        <th style={thStyle}>Job Type</th>
                        <th style={thStyle}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job, index) => (
                        <tr key={job.id} style={{ ...trStyle, background: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                            <td style={tdStyle}>{job.companyName || "Not Available"}</td>
                            <td style={tdStyle}>{job.title}</td>
                            <td style={tdStyle}>${job.salary.toLocaleString()}</td>
                            <td style={tdStyle}>{job.location}</td>
                            <td style={tdStyle}>{job.jobType}</td>
                            <td style={tdStyle}>{job.createdAt ? job.createdAt.split("T")[0] : "N/A"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Styling objects
const containerStyle = {
    padding: "20px",
    maxWidth: "90%",
    margin: "auto",
};

const titleStyle = {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
};

const theadStyle = {
    background: "#007BFF",
    color: "#fff",
    borderBottom: "2px solid #0056b3",
};

const thStyle = {
    padding: "12px",
    border: "1px solid #ddd",
    fontWeight: "bold",
    textAlign: "center",
};

const tdStyle = {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "center",
    color: "#333",
};

const trStyle = {
    borderBottom: "1px solid #ddd",
};

const errorStyle = {
    color: "red",
    textAlign: "center",
    fontSize: "16px",
    marginTop: "20px",
};

const loadingStyle = {
    textAlign: "center",
    fontSize: "18px",
    color: "#555",
};

const noJobsStyle = {
    textAlign: "center",
    fontSize: "18px",
    color: "#777",
};

export default AdminJobs;
