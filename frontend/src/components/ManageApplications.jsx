import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

const ManageApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch applications when the component mounts
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get('/api/jobs/applications', { withCredentials: true }); // Updated endpoint for GET
                console.log(res.data); // Log the response to inspect the structure
                setApplications(res.data.applications || []); // Ensure applications is always an array
                setLoading(false);
            } catch (error) {
                toast.error('Error fetching applications.');
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    // Handle status change
    const handleStatusChange = async (applicationId, status) => {
        try {
            const res = await axios.put('/api/jobs/application/status', // Updated endpoint for PUT
                { applicationId, status },
                { withCredentials: true }
            );

            if (res.data.success) {
                toast.success('Application status updated.');
                // Update the status in the UI without reloading
                setApplications((prevApplications) =>
                    prevApplications.map((app) =>
                        app.application_id === applicationId ? { ...app, status } : app
                    )
                );
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating status.');
        }
    };

    return (
        <div className='container'>
            <h2>Manage Job Applications</h2>

            {loading ? (
                <p>Loading applications...</p>
            ) : applications && applications.length > 0 ? ( // Ensure applications exists and is not empty
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Job</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application) => (
                            <tr key={application.application_id}>
                                <td>{application.applicant_name}</td>
                                <td>{application.job_title}</td>
                                <td>
                                    <select
                                        value={application.status}
                                        onChange={(e) =>
                                            handleStatusChange(application.application_id, e.target.value)
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Accepted">Accepted</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="Waitlisted">Waitlisted</option>
                                    </select>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleStatusChange(application.application_id, application.status)}
                                        disabled={loading} // Disable while loading
                                    >
                                        {loading ? 'Updating...' : 'Submit'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No applications available.</p> // Show a message if no applications are found
            )}
        </div>
    );
};

export default ManageApplications;
