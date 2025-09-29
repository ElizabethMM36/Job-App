import axios from "axios";
import { JOB_API_END_POINT } from "./constant";
import { toast } from "sonner";

export const applyJob = async ({ jobId, job, user, setIsApplied, dispatch, setSingleJob }) => {
  if (!user || !user.applicant_id) {
    toast.error("User info missing. Please login again.");
    return;
  }

  try {
    const payload = {
      job_id: jobId,
      applicant_id: user.applicant_id,
      recruiter_id: job?.userId,
      full_name: user.full_name || "",
      email: user.email || "",
      phone: user.phone || "",
      preferred_position: user.preferred_position || "",
    };

    const res = await axios.post(`${JOB_API_END_POINT}/apply`, payload, {
      withCredentials: true,
    });

    if (res.data.success) {
      setIsApplied && setIsApplied(true);
      setSingleJob &&
        dispatch &&
        setSingleJob({
          ...job,
          applications: [...(job.applications || []), { applicant: user?._id }],
        });

      toast.success(res.data.message);
    }
  } catch (error) {
    console.error("❌ Application Error:", error?.response?.data || error.message);
    toast.error(error?.response?.data?.message || "Application failed");
  }
};
