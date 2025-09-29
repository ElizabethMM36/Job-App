import React, { useEffect, useState } from "react";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { setAllJobs } from "@/redux/jobSlice";

const Jobs = () => {
    const dispatch = useDispatch();
    const { allJobs, searchedQuery } = useSelector((store) => store.job);
    const [filterJobs, setFilterJobs] = useState([]);

    // 🔹 Fetch Jobs from Backend and Update Redux Store
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                    setFilterJobs(res.data.jobs);
                }
            } catch (error) {
                console.error("❌ Error fetching jobs:", error);
            }
        };

        fetchJobs();
    }, [dispatch]);

    // 🔹 Update Filtered Jobs When Search Query Changes
    useEffect(() => {
        if (searchedQuery) {
            const filteredJobs = allJobs.filter((job) =>
                job.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
                job.location?.toLowerCase().includes(searchedQuery.toLowerCase())
            );
            setFilterJobs(filteredJobs);
        } else {
            setFilterJobs(allJobs);
        }
    }, [allJobs, searchedQuery]);

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto mt-5">
                <div className="flex gap-5">
                    <div className="w-1/5">
                        <FilterCard />
                    </div>
                    {filterJobs.length === 0 ? (
                        <span>No jobs found.</span>
                    ) : (
                        <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filterJobs.map((job) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.3 }}
                                        key={job.id} // ✅ Use MySQL-style primary key
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Jobs;
