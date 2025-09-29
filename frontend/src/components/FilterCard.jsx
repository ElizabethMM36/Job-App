import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "42-1lakh", "1lakh to 5lakh"]
    },
]

const FilterCard = ({ jobs }) => {
    const [selectedValue, setSelectedValue] = useState('');
    const [manualInput, setManualInput] = useState({ location: '', industry: '', salary: '' });
    const [filteredJobs, setFilteredJobs] = useState(jobs || []);  // Initialize filteredJobs as an empty array if no jobs

    const dispatch = useDispatch();

    const changeHandler = (value) => {
        setSelectedValue(value);
    }

    const handleManualInputChange = (e, field) => {
        setManualInput((prev) => ({ ...prev, [field]: e.target.value }));
    }

    const handleAddCustomValue = (field) => {
        if (manualInput[field].trim()) {
            const newFilterData = filterData.map((data) => {
                if (data.filterType.toLowerCase() === field) {
                    return {
                        ...data,
                        array: [...data.array, manualInput[field].trim()]
                    };
                }
                return data;
            });

            // Update the filtered jobs based on the new filter data
            filterJobs(newFilterData);

            // Reset the manual input field
            setManualInput((prev) => ({ ...prev, [field]: '' }));
        }
    }

    const filterJobs = (newFilterData) => {
        let newFilteredJobs = jobs || [];  // Ensure jobs are initialized as an empty array

        newFilterData.forEach(filter => {
            if (filter.filterType === "Location") {
                newFilteredJobs = newFilteredJobs.filter(job => filter.array.includes(job.location));
            }
            if (filter.filterType === "Industry") {
                newFilteredJobs = newFilteredJobs.filter(job => filter.array.includes(job.industry));
            }
            if (filter.filterType === "Salary") {
                newFilteredJobs = newFilteredJobs.filter(job => filter.array.includes(job.salaryRange));
            }
        });

        setFilteredJobs(newFilteredJobs);
    };

    useEffect(() => {
        dispatch(setSearchedQuery(selectedValue));
    }, [selectedValue]);

    return (
        <div className='w-full bg-white p-3 rounded-md'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    filterData.map((data, index) => (
                        <div key={index}>
                            <h1 className='font-bold text-lg'>{data.filterType}</h1>
                            {
                                data.array.map((item, idx) => {
                                    const itemId = `id${index}-${idx}`;
                                    return (
                                        <div key={idx} className='flex items-center space-x-2 my-2'>
                                            <RadioGroupItem value={item} id={itemId} />
                                            <Label htmlFor={itemId}>{item}</Label>
                                        </div>
                                    );
                                })
                            }
                            {/* Manually add values for each category */}
                            {data.filterType === "Location" && (
                                <div className="my-4">
                                    <input
                                        type="text"
                                        placeholder="Add custom location"
                                        value={manualInput.location}
                                        onChange={(e) => handleManualInputChange(e, 'location')}
                                        className="border p-2 rounded-md w-full"
                                    />
                                    <button
                                        onClick={() => handleAddCustomValue('location')}
                                        className="bg-blue-500 text-white px-4 py-2 mt-2"
                                    >
                                        Add Location
                                    </button>
                                </div>
                            )}
                            {data.filterType === "Industry" && (
                                <div className="my-4">
                                    <input
                                        type="text"
                                        placeholder="Add custom industry"
                                        value={manualInput.industry}
                                        onChange={(e) => handleManualInputChange(e, 'industry')}
                                        className="border p-2 rounded-md w-full"
                                    />
                                    <button
                                        onClick={() => handleAddCustomValue('industry')}
                                        className="bg-blue-500 text-white px-4 py-2 mt-2"
                                    >
                                        Add Industry
                                    </button>
                                </div>
                            )}
                            {data.filterType === "Salary" && (
                                <div className="my-4">
                                    <input
                                        type="text"
                                        placeholder="Add custom salary range"
                                        value={manualInput.salary}
                                        onChange={(e) => handleManualInputChange(e, 'salary')}
                                        className="border p-2 rounded-md w-full"
                                    />
                                    <button
                                        onClick={() => handleAddCustomValue('salary')}
                                        className="bg-blue-500 text-white px-4 py-2 mt-2"
                                    >
                                        Add Salary Range
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                }
            </RadioGroup>

            {/* Display Filtered Jobs */}
            <div className="mt-4">
                <h2 className="font-bold text-lg">Filtered Jobs:</h2>
                {filteredJobs && filteredJobs.length === 0 ? (
                    <p>No jobs match the selected criteria.</p>
                ) : (
                    <ul>
                        {filteredJobs.map((job, idx) => (
                            <li key={idx}>
                                {job.title} - {job.location} - {job.industry} - {job.salaryRange}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default FilterCard;
