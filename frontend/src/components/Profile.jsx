import React, { useState } from 'react';
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import AppliedJobTable from './AppliedJobTable';
import UpdateProfileDialog from './UpdateProfileDialog';
import { useSelector } from 'react-redux';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);

    return (
        <div>
            <Navbar />
            {/* Profile Section */}
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline"><Pen /></Button>
                </div>

                {/* Contact Details */}
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <MapPin />
                        <span>{user?.profile?.current_location || "Not Available"}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Briefcase />
                        <span>{user?.profile?.preferred_position || "Not Available"}</span>
                    </div>
                </div>

                {/* Skills Section */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg'>Skills</h1>
                    <div className='flex flex-wrap gap-2'>
                        {user?.profile?.skills.length !== 0 
                            ? user?.profile?.skills.map((item, index) => <Badge key={index}>{item}</Badge>) 
                            : <span>NA</span>
                        }
                    </div>
                </div>

                {/* Education Section */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg flex items-center gap-2'><GraduationCap /> Education</h1>
                    <div className='border border-gray-300 p-3 rounded-lg'>
                        {user?.profile?.education?.length > 0 ? (
                            user.profile.education.map((edu, index) => (
                                <div key={index} className="border-b pb-2 mb-2">
                                    <p className="font-semibold">{edu.degree} at {edu.institution}</p>
                                    <p className="text-sm text-gray-600">{edu.start_year} - {edu.end_year || "Present"}</p>
                                    {edu.certificate_files && (
                                        <a href={edu.certificate_files} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            View Certificate
                                        </a>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No education details available</p>
                        )}
                    </div>
                </div>

                {/* Resume Section */}
                <div className='my-5'>
                    <h1 className='font-bold text-lg'>Resume</h1>
                    {isResume ? (
                        <a target='blank' href={user?.profile?.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>
                            {user?.profile?.resumeOriginalName}
                        </a>
                    ) : <span>NA</span>}
                </div>
            </div>

            {/* Applied Jobs Section */}
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                <AppliedJobTable />
            </div>

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile;
