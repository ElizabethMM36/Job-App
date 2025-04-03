import { setCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllCompanies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                // ✅ Fixed the API endpoint (removed `/get`)
                const res = await axios.get(COMPANY_API_END_POINT, { withCredentials: true });

                console.log('📢 API called:', COMPANY_API_END_POINT);

                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                } else {
                    console.error('❌ API did not return success:', res.data);
                }
            } catch (error) {
                console.error('❌ Error fetching companies:', error.response?.data || error.message);
            }
        };

        fetchCompanies();
    }, [dispatch]); // ✅ Added dispatch to dependency array

};

export default useGetAllCompanies;
