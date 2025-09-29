import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });

    const { loading, user } = useSelector((store) => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // ✅ Handle Input Changes
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        console.log("🔄 Updated Input:", { ...input, [e.target.name]: e.target.value }); // Debugging
    };

    // ✅ Handle Form Submission
    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.email || !input.password || !input.role) {
            toast.error("⚠️ Please fill in all fields.");
            return;
        }

        try {
            dispatch(setLoading(true));
            console.log("📌 Sending Login Request with:", input);

            const res = await axios.post(
                `${USER_API_END_POINT}/login`,
                input,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true, // ✅ Ensures cookies are sent
                }
            );

            console.log("✅ Response from Backend:", res.data);

            if (res.data.success) {
                dispatch(setUser(res.data.user));

                // ✅ Check if token exists before storing
                if (!res.data.token) {
                    throw new Error("❌ Token missing from response! Backend issue.");
                }

                // ✅ Store the token and user ID in localStorage
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("userId", res.data.user.id);

                console.log("🛠️ Stored Token:", localStorage.getItem("token")); // Debugging
                console.log("🛠️ Stored User ID:", localStorage.getItem("userId"));

                toast.success(res.data.message);
                navigate("/");
            } else {
                toast.error(res.data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("❌ Login Error:", error.response?.data || error.message);
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            dispatch(setLoading(false));
        }
    };

    // ✅ Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center max-w-7xl mx-auto">
                <form onSubmit={submitHandler} className="w-1/2 border border-gray-200 rounded-md p-4 my-10">
                    <h1 className="font-bold text-xl mb-5">Login</h1>

                    {/* ✅ Email Input */}
                    <div className="my-2">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="patel@gmail.com"
                        />
                    </div>

                    {/* ✅ Password Input */}
                    <div className="my-2">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* ✅ Role Selection */}
                    <div className="flex items-center justify-between">
                        <RadioGroup className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="jobseeker"
                                    checked={input.role === "jobseeker"}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r1">Jobseeker</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === "recruiter"}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* ✅ Submit Button with Loader */}
                    {loading ? (
                        <Button className="w-full my-4">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Login
                        </Button>
                    )}

                    <span className="text-sm">
                        Don't have an account?{" "}
                        <Link to="/signup" className="text-blue-600">
                            Signup
                        </Link>
                    </span>
                </form>
            </div>
        </div>
    );
};

export default Login;
