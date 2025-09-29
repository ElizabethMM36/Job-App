import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setAllAppliedJobs } from '@/redux/jobSlice';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { allAppliedJobs } = useSelector((store) => store.job);

    // ✅ Fetch applied jobs on component mount
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/getmyapplications`, { withCredentials: true });

                console.log("🟢 Applied Jobs API Response:", res.data);

                if (res.data.success) {
                    dispatch(setAllAppliedJobs(res.data.applications));
                }
            } catch (error) {
                console.error("❌ Error fetching applied jobs:", error);
            }
        };

        fetchApplications();
    }, [dispatch]);

    console.log("📌 Applied Jobs in Redux:", allAppliedJobs); // Debugging

    return (
        <div>
            <h1>My Applied Jobs</h1>
            <AppliedJobTable appliedJobs={allAppliedJobs} />
        </div>
    );
};

// ✅ Applied Job Table Component
const AppliedJobTable = ({ appliedJobs }) => {
    console.log("📌 Applied Jobs Inside Table Component:", appliedJobs); // Debugging

    return (
        <div>
            <Table>
                <TableCaption>A list of your applied jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {appliedJobs.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan="4" className="text-center">
                                You haven't applied to any jobs yet.
                            </TableCell>
                        </TableRow>
                    ) : (
                        appliedJobs.map((appliedJob) => (
                            <TableRow key={appliedJob._id}>
                                <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell>{appliedJob.job?.title}</TableCell>
                                <TableCell>{appliedJob.job?.company?.name}</TableCell>
                                <TableCell className="text-right">
                                    <Badge className={`${appliedJob?.status === "rejected" ? 'bg-red-400' : appliedJob.status === 'pending' ? 'bg-gray-400' : 'bg-green-400'}`}>
                                        {appliedJob.status.toUpperCase()}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};


export default Dashboard;
