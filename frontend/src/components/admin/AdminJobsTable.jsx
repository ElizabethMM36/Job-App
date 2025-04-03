import { useEffect, useState } from "react";
import axios from "axios";

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/jobs/getadminjobs", {
                    withCredentials: true, // Ensure authentication cookies are sent
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

    if (loading) return <p>Loading jobs...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!jobs.length) return <p>No jobs found.</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "90%", margin: "auto" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Job Listings</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                    <tr style={{ background: "#f4f4f4", borderBottom: "2px solid #ccc" }}>
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
                        <tr key={job.id} style={{ background: index % 2 === 0 ? "#fff" : "#f9f9f9", borderBottom: "1px solid #ddd" }}>
                            <td style={tdStyle}>{job.companyName || "Not Available"}</td>
                            <td style={tdStyle}>{job.title}</td>
                            <td style={tdStyle}>${job.salary}</td>
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
const thStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    fontWeight: "bold",
    textAlign: "center",
};

const tdStyle = {
    padding: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
};

export default AdminJobs;
