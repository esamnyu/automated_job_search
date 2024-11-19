// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { jobsService } from '../services/jobsService';
import JobsList from '../components/dashboard/JobsList';
import JobForm from '../components/dashboard/JobForm';
import DashboardStats from '../components/dashboard/DashboardStats';

const Dashboard = () => {
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadJobs();
  }, [currentUser]);

  const loadJobs = async () => {
    try {
      const userJobs = await jobsService.getUserJobs(currentUser.uid);
      setJobs(userJobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      const newJob = await jobsService.createJob(currentUser.uid, jobData);
      setJobs(prevJobs => [newJob, ...prevJobs]);
      setShowJobForm(false);
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleUpdateJob = async (jobId, updates) => {
    try {
      await jobsService.updateJob(jobId, updates);
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, ...updates } : job
        )
      );
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await jobsService.deleteJob(jobId);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Search Dashboard</h1>
          <button
            onClick={() => setShowJobForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Application
          </button>
        </div>

        {showJobForm && (
          <div className="mb-8">
            <JobForm 
              onSubmit={handleAddJob} 
              onCancel={() => setShowJobForm(false)} 
            />
          </div>
        )}

        <div className="space-y-8">
          <DashboardStats jobs={jobs} />
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