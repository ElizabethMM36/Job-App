import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);

    useEffect(() => {
        if (!searchedQuery) {
            console.log("No search query provided, skipping API call.");
            return;
        }

        const fetchAllJobs = async () => {
            try {
                const url = `${JOB_API_END_POINT}/get?keyword=${encodeURIComponent(searchedQuery)}`;
                console.log("Fetching jobs from:", url);

                const res = await axios.get(url, { withCredentials: true });

                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                } else {
                    console.log("API Response Error:", res.data);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error.response ? error.response.data : error.message);
            }
        };

        fetchAllJobs();
    }, [searchedQuery, dispatch]); // ✅ Correct dependencies

    return null; // Ensures the hook doesn't return anything
};

export default useGetAllJobs;
