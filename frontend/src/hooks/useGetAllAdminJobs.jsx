import { setAllAdminJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const token = localStorage.getItem("token"); // ✅ Get token from local storage

                if (!token) {
                    console.error("❌ No token found. User must log in.");
                    return;
                }

                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Attach token
                    },
                    withCredentials: true, // ✅ Keep if using cookies-based authentication
                });

                if (res.data.success) {
                    dispatch(setAllAdminJobs(res.data.jobs));
                }
            } catch (error) {
                console.error("❌ Error fetching admin jobs:", error.response?.data || error.message);
            }
        };

        fetchAllAdminJobs();
    }, [dispatch]);
};

export default useGetAllAdminJobs;
