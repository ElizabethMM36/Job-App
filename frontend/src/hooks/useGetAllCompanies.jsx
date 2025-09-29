import { setCompanies } from '@/redux/companySlice';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from "sonner";

const useGetAllCompanies = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem("token"); // ✅ Retrieve token
                if (!token) {
                    console.error("❌ No token found in localStorage. User might be logged out.");
                    toast.error("⚠️ Authentication failed. Please log in again.");
                    return;
                }

                console.log("📢 Fetching companies... API:", COMPANY_API_END_POINT);

                // ✅ Include Authorization header with the token
                const res = await axios.get(COMPANY_API_END_POINT, {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });

                console.log("✅ API Response:", res.data);

                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies));
                } else {
                    console.error("❌ API did not return success:", res.data);
                }
            } catch (error) {
                if (error.response) {
                    console.error("❌ Error fetching companies:", error.response.data);
                    
                    // ✅ Handle Expired Token Case
                    if (error.response.status === 401 && error.response.data.message === "Session expired. Please log in again.") {
                        console.warn("⚠️ Token expired. Logging out user...");
                        toast.error("⚠️ Session expired. Please log in again.");
                        localStorage.removeItem("token"); // Clear old token
                        localStorage.removeItem("userId");
                        window.location.href = "/login"; // Redirect to login
                    } else {
                        toast.error(error.response.data.message || "Error fetching companies.");
                    }
                } else {
                    console.error("❌ Network or Server Error:", error.message);
                    toast.error("❌ Unable to fetch companies. Check your network or server.");
                }
            }
        };

        fetchCompanies();
    }, [dispatch]);

};

export default useGetAllCompanies;
