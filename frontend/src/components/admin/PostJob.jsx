import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: "",
        companyId: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { companies } = useSelector(store => store.company);

    // Auto-select first available company if no company is selected
    useEffect(() => {
        if (companies.length > 0 && !input.companyId) {
            setInput((prev) => ({
                ...prev,
                companyId: companies[0].id // ✅ Use `id` instead of `_id`
            }));
        }
    }, [companies]);

    // Handle Input Change
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    // Handle Company Selection
    const selectChangeHandler = (companyId) => {
        setInput((prevInput) => ({
            ...prevInput,
            companyId: companyId
        }));
    };

    // Parse salary (convert "7LPA" to 700000)
    const parseSalary = (salary) => {
        const match = salary.match(/\d+/g);
        if (!match) return NaN;

        let numericSalary = parseInt(match.join(""), 10);
        if (salary.toLowerCase().includes("lpa")) {
            numericSalary *= 100000; // Convert LPA to absolute value
        }
        return numericSalary;
    };

    // Submit Form
    const submitHandler = async (e) => {
        e.preventDefault();

        console.log("Job Data Before Submit:", input); // 🚀 Debugging

        // Ensure companyId is selected
        if (!input.companyId) {
            toast.error("Please select a company before posting the job.");
            return;
        }

        // Convert salary
        const parsedSalary = parseSalary(input.salary);
        if (isNaN(parsedSalary)) {
            toast.error("Invalid salary format. Please enter a valid number.");
            return;
        }

        // Allowed job types
        const validJobTypes = ["Full-time", "Part-time", "Remote", "Contract", "Internship"];
        if (!validJobTypes.includes(input.jobType)) {
            toast.error("Invalid job type. Please select a valid option.");
            return;
        }

        // Prepare Data for Submission
        const jobData = {
            ...input,
            salary: parsedSalary,
            position: input.position.toString(), // Ensure it's a string
        };

        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, jobData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            console.error("Error posting job:", error.response?.data);
            toast.error(error.response?.data?.message || "Error posting job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center w-screen my-5">
                <form onSubmit={submitHandler} className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text"
                                name="title"
                                value={input.title}
                                onChange={changeEventHandler}
                                required
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                required
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                required
                            />
                        </div>
                        <div>
                            <Label>Salary (e.g., 7LPA or 700000)</Label>
                            <Input
                                type="text"
                                name="salary"
                                value={input.salary}
                                onChange={changeEventHandler}
                                required
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={changeEventHandler}
                                required
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Select value={input.jobType} onValueChange={(value) => setInput({ ...input, jobType: value })} required>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select Job Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {["Full-time", "Part-time", "Remote", "Contract", "Internship"].map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Experience (in years)</Label>
                            <Input
                                type="text"
                                name="experience"
                                value={input.experience}
                                onChange={changeEventHandler}
                                required
                            />
                        </div>
                        <div>
                            <Label>No of Positions</Label>
                            <Input
                                type="text"
                                name="position"
                                value={input.position}
                                onChange={changeEventHandler}
                                required
                            />
                        </div>
                        {companies.length > 0 && (
                            <div>
                                <Label>Select Company</Label>
                                <Select value={input.companyId} onValueChange={selectChangeHandler} required>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a Company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company.id} value={company.id}> {/* ✅ Use `id` */}
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>
                    {loading ? (
                        <Button className="w-full my-4">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">
                            Post New Job
                        </Button>
                    )}
                    {companies.length === 0 && (
                        <p className="text-xs text-red-600 font-bold text-center my-3">
                            *Please register a company first before posting a job
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default PostJob;
