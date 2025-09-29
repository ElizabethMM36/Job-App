import React, { useState } from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const Job = ({ job }) => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const [isApplied, setIsApplied] = useState(false);

  const daysAgoFunction = (createdTime) => {
    const createdAt = new Date(createdTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to apply.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("No token found. Please login again.");
      return;
    }

    try {
      const res = await axios.post(
        `${JOB_API_END_POINT}/apply`,
        { job_id: job?.id },  // ✅ Changed _id to id for MySQL
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.success) {
        setIsApplied(true);
        toast.success(res.data.message || "Applied successfully");
      }
    } catch (error) {
      console.error("❌ Apply error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong while applying.");
    }
  };

  return (
    <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-500'>
          {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
        </p>
        <Button variant="outline" className="rounded-full" size="icon">
          <Bookmark />
        </Button>
      </div>

      <div className='flex items-center gap-2 my-2'>
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
          <p className='text-sm text-gray-500'>India</p>
        </div>
      </div>

      <div>
        <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
        <p className='text-sm text-gray-600'>{job?.description}</p>
      </div>

      <div className='flex items-center gap-2 mt-4'>
        <Badge className='text-blue-700 font-bold' variant="ghost">
          {job?.position} Positions
        </Badge>
        <Badge className='text-[#F83002] font-bold' variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className='text-[#7209b7] font-bold' variant="ghost">
          {job?.salary}LPA
        </Badge>
      </div>

      <div className='flex items-center gap-4 mt-4'>
        <Button onClick={() => navigate(`/description/${job?.id}`)} variant="outline">
          Details
        </Button>
        <Button
          onClick={handleApply}
          disabled={isApplied}
          className={`text-white bg-[#7209b7] hover:bg-[#5e1e97] transition ${
            isApplied ? 'cursor-not-allowed opacity-70' : ''
          }`}
        >
          {isApplied ? "Applied" : "Apply"}
        </Button>
      </div>
    </div>
  );
};

export default Job;
