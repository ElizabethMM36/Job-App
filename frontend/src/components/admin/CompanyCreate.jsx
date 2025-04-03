import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setSingleCompany } from "@/redux/companySlice";

const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // ✅ Get userId from Redux store or localStorage
    const userId = useSelector((state) => state.auth.user?.id) || localStorage.getItem("userId");
    const token = useSelector((state) => state.auth.token) || localStorage.getItem("token");

    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);

   
    const registerNewCompany = async () => {
        if (!name.trim()) {
            toast.error("Company name cannot be empty!");
            return;
        }

        if (!token) {
            toast.error("Authentication failed. Please log in again.");
            return;
        }

        try {
            setLoading(true);
            console.log("📢 Registering company:", { name });
            console.log("📌 API Endpoint:", `${COMPANY_API_END_POINT}/register`);

            const res = await axios.post(
                `${COMPANY_API_END_POINT}/register`,
                { name }, // ✅ Send only name, backend extracts userId
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // ✅ Ensure Authorization header
                    },
                    withCredentials: true, // ✅ Supports cookies-based authentication
                }
            );

            console.log("✅ API Response:", res.data);

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                navigate(`/admin/companies/${res.data.company?.id}`); // ✅ Redirect after success
            } else {
                toast.error(res.data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("❌ Error registering company:", error);
            toast.error(error.response?.data?.message || "Failed to register company.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto">
                <div className="my-10">
                    <h1 className="font-bold text-2xl">Your Company Name</h1>
                    <p className="text-gray-500">
                        What would you like to name your company? You can change this later.
                    </p>
                </div>

                <Label>Company Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="JobHunt, Microsoft, etc."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="flex items-center gap-2 my-10">
                    <Button variant="outline" onClick={() => navigate("/admin/companies")}>
                        Cancel
                    </Button>
                    <Button onClick={registerNewCompany} disabled={loading}>
                        {loading ? "Registering..." : "Continue"}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
