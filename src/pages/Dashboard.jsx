import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { jobService } from "../services/jobService";  // Updated import
import JobsList from "../components/dashboard/JobsList";
import JobForm from "../components/dashboard/JobForm";
import DashboardStats from "../components/dashboard/DashboardStats";

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const fetchedJobs = await jobService.getAllJobs();
        setJobs(fetchedJobs);
      } catch (error) {
        setError("Failed to fetch jobs");
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleAddJob = async (jobData) => {
    try {
      const newJob = await jobService.addJob(jobData);
      setJobs([...jobs, newJob]);
    } catch (error) {
      setError("Failed to add job");
      console.error("Error adding job:", error);
    }
  };

  const handleUpdateJob = async (jobId, updates) => {
    try {
      const updatedJob = await jobService.updateJob(jobId, updates);
      setJobs(jobs.map(job => job.id === jobId ? updatedJob : job));
    } catch (error) {
      setError("Failed to update job");
      console.error("Error updating job:", error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await jobService.deleteJob(jobId);
      setJobs(jobs.filter(job => job.id !== jobId));
    } catch (error) {
      setError("Failed to delete job");
      console.error("Error deleting job:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Job Search Dashboard</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          {error}
        </Alert>
      )}

      <DashboardStats jobs={jobs} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Job</h2>
          <JobForm onSubmit={handleAddJob} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Jobs</h2>
          <JobsList 
            jobs={jobs}
            onUpdateJob={handleUpdateJob}
            onDeleteJob={handleDeleteJob}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;