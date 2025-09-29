import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen, MapPin, Briefcase } from "lucide-react";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import UpdateProfileDialog from "./UpdateProfileDialog";

// ... [imports and initial setup remain unchanged]

const Profile = () => {
    const { user } = useSelector((store) => store.auth);
    const [profile, setProfile] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          setError(null);
  
          console.log("📡 Fetching profile using JWT token...");
  
          const profileResponse = await axios.get("http://localhost:5000/api/profile", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            withCredentials: true
          });
  
          console.log("✅ Profile fetched:", profileResponse.data);
          setProfile(profileResponse.data.profile);
        } catch (error) {
          console.error("❌ Error fetching profile:", error.response?.data || error.message);
          setError("Failed to load profile. Please try again.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchProfile();
    }, []);
  
    const handleSaveProfile = async () => {
      try {
        console.log("📡 Saving profile data...");
  
        const payload = {
          username: user.email,
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          current_location: profile.current_location,
          preferred_position: profile.preferred_position,
          industry_fields: profile.industry_fields,
          skills: profile.skills,
          resume: profile.resume,
        };
  
        await axios.post("http://localhost:5178/api/job_applicants", payload);
        console.log("✅ Profile saved successfully!");
        alert("Profile saved successfully!");
      } catch (error) {
        console.error("❌ Error saving profile:", error);
        alert("Failed to save profile. Please try again.");
      }
    };
  
    return (
      <div>
        <Navbar />
  
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
          <div className="flex justify-between">
            <h1 className="font-bold text-xl">Profile</h1>
            <Button onClick={() => setOpen(true)} className="text-right" variant="outline">
              <Pen />
            </Button>
          </div>
  
          {loading ? (
            <div className="text-center py-5">Loading profile...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-5">
              {error}
              <br />
              <span className="text-gray-500">You can still edit your profile.</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 my-5">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profile?.avatar || "https://via.placeholder.com/150"}
                    alt="profile"
                  />
                </Avatar>
                <div>
                  <h1 className="font-medium text-xl">{profile?.full_name || "Not Available"}</h1>
                  <p>{profile?.bio || "No Bio Available"}</p>
                </div>
              </div>
  
              <div className="my-5">
                <div className="flex items-center gap-3 my-2">
                  <Mail />
                  <span>{profile?.email || "Not Available"}</span>
                </div>
                <div className="flex items-center gap-3 my-2">
                  <Contact />
                  <span>{profile?.phone || "Not Available"}</span>
                </div>
                <div className="flex items-center gap-3 my-2">
                  <MapPin />
                  <span>{profile?.current_location || "Not Available"}</span>
                </div>
                <div className="flex items-center gap-3 my-2">
                  <Briefcase />
                  <span>{profile?.preferred_position || "Not Available"}</span>
                </div>
              </div>
  
              <div className="my-5">
                <h1 className="font-bold text-lg">Skills</h1>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills ? (
                    profile.skills.split(",").map((skill, index) => (
                      <Badge key={index}>{skill.trim()}</Badge>
                    ))
                  ) : (
                    <span>No skills available</span>
                  )}
                </div>
              </div>
  
              <div className="my-5">
                <h1 className="font-bold text-lg">🎓 Education</h1>
                {profile?.education && profile.education.length > 0 ? (
                  profile.education.map((edu, index) => (
                    <div key={index} className="border rounded-xl p-4 my-2 bg-gray-50">
                      <p className="font-semibold">{edu.degree} - {edu.institution}</p>
                      <p className="text-sm text-gray-600">
                        {edu.start_year} - {edu.end_year}
                      </p>
                      {edu.certificate_files && (
                        <p className="text-blue-600 text-sm mt-1">
                          <a
                            href={edu.certificate_files}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            View Certificate
                          </a>
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No educational details available.</p>
                )}
              </div>
  
              <div className="my-5 text-center">
                <Button onClick={handleSaveProfile} className="bg-blue-500 text-white">
                  Save Profile
                </Button>
              </div>
            </>
          )}
        </div>
  
        <UpdateProfileDialog open={open} setOpen={setOpen} />
      </div>
    );
  };
  
  export default Profile;
  