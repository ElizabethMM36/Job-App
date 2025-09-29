import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    const [isApplied, setIsApplied] = useState(false);
    const params = useParams();
    const jobId = params.id; // ✅ MySQL style ID
    const dispatch = useDispatch();

    const applyJobHandler = async () => {
        console.log("📨 Apply button clicked");

        if (isApplied) {
            toast.info("You have already applied.");
            return;
        }

        if (!user || !user.applicant_id) {
            toast.error("User info missing. Please login again.");
            console.error("❌ Missing user or applicant_id:", user);
            return;
        }

        try {
            const payload = {
                job_id: jobId // ✅ Using job_id instead of job._id
            };

            console.log("📦 Payload for application:", payload);

            const res = await axios.post(`${JOB_API_END_POINT}/apply`, payload, {
                withCredentials: true
            });

            if (res.data.success) {
                setIsApplied(true);
                const updatedSingleJob = {
                    ...singleJob,
                    applications: [...(singleJob.applications || []), { applicant: user?.applicant_id }] // ✅ MySQL uses applicant_id
                };
                dispatch(setSingleJob(updatedSingleJob));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("❌ Application Error:", error?.response?.data || error.message);
            toast.error(error?.response?.data?.message || "Application failed");
        }
    };

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                console.log(`🔍 Fetching job with ID: ${jobId}`);
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true
                });

                console.log("🟢 API Response:", res.data);

                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    const alreadyApplied = res.data.job.applications?.some(application => application.applicant === user?.applicant_id); // ✅ use applicant_id
                    setIsApplied(alreadyApplied);
                }
            } catch (error) {
                console.error("❌ Error fetching job:", error);
            }
        };

        fetchSingleJob();
    }, [jobId, dispatch, user?.applicant_id]);

    return (
        <div className='max-w-7xl mx-auto my-10'>
            <div className='flex items-center justify-between'>
                <div>
                    <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                    <div className='flex items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">
                            {singleJob?.position} Positions
                        </Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">
                            {singleJob?.jobType}
                        </Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">
                            {singleJob?.salary} LPA
                        </Badge>
                    </div>
                </div>
                <Button
                    onClick={applyJobHandler}
                    disabled={isApplied}
                    className={`rounded-lg ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}>
                    {isApplied ? 'Already Applied' : 'Apply'}
                </Button>
            </div>
            <h1 className='border-b-2 border-b-gray-300 font-medium py-4'>Job Description</h1>
            <div className='my-4'>
                <h1 className='font-bold my-1'>Role: <span className='pl-4 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='font-bold my-1'>Location: <span className='pl-4 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold my-1'>Description: <span className='pl-4 font-normal text-gray-800'>{singleJob?.description}</span></h1>
                <h1 className='font-bold my-1'>Experience: <span className='pl-4 font-normal text-gray-800'>{singleJob?.experience} yrs</span></h1>
                <h1 className='font-bold my-1'>Salary: <span className='pl-4 font-normal text-gray-800'>{singleJob?.salary} LPA</span></h1>
                <h1 className='font-bold my-1'>Total Applicants: <span className='pl-4 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold my-1'>Posted Date: <span className='pl-4 font-normal text-gray-800'>{singleJob?.createdAt?.split("T")[0]}</span></h1>
            </div>
        </div>
    );
};

export default JobDescription;
