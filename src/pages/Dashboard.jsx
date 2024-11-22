// Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Import components
import DashboardStats from '../components/dashboard/DashboardStats';
import ResumeProfile from '../components/dashboard/resumeProfile';
import JobForm from '../components/dashboard/JobForm';
import JobsList from '../components/dashboard/JobsList';
import Alert from '../components/ui/Alert';

// Import services
import {
  getUserProfile,
  defaultResumeProfile,
  updateProfileSection,
} from '../services/resumeProfileService';
import {
  getUserJobs,
  addJob,
  updateJob,
  deleteJob,
} from '../services/jobService';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(defaultResumeProfile);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showJobForm, setShowJobForm] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    loadDashboardData();
  }, [currentUser, navigate]);

  const loadDashboardData = async () => {
    if (!currentUser?.uid) return;

    try {
      setLoading(true);
      setError('');

      console.log('Loading dashboard data for user:', currentUser.uid);

      // Load profile and jobs in parallel
      const [userProfile, userJobs] = await Promise.all([
        getUserProfile(currentUser.uid).catch((err) => {
          console.error('Error loading profile:', err);
          return defaultResumeProfile;
        }),
        getUserJobs().catch((err) => {
          console.error('Error loading jobs:', err);
          return [];
        }),
      ]);

      console.log('Loaded profile:', userProfile);
      console.log('Loaded jobs:', userJobs);

      setProfile(userProfile);
      setJobs(userJobs);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData) => {
    if (!currentUser?.uid) return;

    try {
      setError('');
      console.log('Adding new job:', jobData);

      await addJob({
        ...jobData,
        userId: currentUser.uid,
        createdAt: new Date(),
      });

      await loadDashboardData(); // Reload all data
      setShowJobForm(false);
    } catch (err) {
      console.error('Error adding job:', err);
      setError('Failed to add job. Please try again.');
    }
  };

  const calculateStats = () => {
    const totalApplications = jobs.length;
    const interviews = jobs.filter((job) => job.status === 'interview').length;
    const offers = jobs.filter((job) => job.status === 'offer').length;
    const rejected = jobs.filter((job) => job.status === 'rejected').length;
    const responses = interviews + offers + rejected;
    const responseRate =
      totalApplications > 0 ? Math.round((responses / totalApplications) * 100) : 0;
    const interviewRate =
      totalApplications > 0 ? (interviews / totalApplications) * 100 : 0;
    const averageMatchScore =
      jobs.length > 0
        ? jobs.reduce((sum, job) => sum + (job.matchScore?.overall || 0), 0) /
          jobs.length
        : 0;

    // Calculate weekly stats
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const weeklyApplications = jobs.filter(
      (job) => new Date(job.createdAt) >= oneWeekAgo
    ).length;

    const weeklyInterviews = jobs.filter(
      (job) =>
        job.status === 'interview' && new Date(job.updatedAt || job.createdAt) >= oneWeekAgo
    ).length;

    const weeklyResponses = jobs.filter(
      (job) =>
        job.status !== 'applied' && new Date(job.updatedAt || job.createdAt) >= oneWeekAgo
    ).length;

    const weeklyStats = {
      applications: weeklyApplications,
      interviews: weeklyInterviews,
      responses: weeklyResponses,
    };

    return {
      totalApplications,
      interviews,
      offers,
      rejected,
      responseRate,
      interviewRate,
      averageMatchScore,
      applicationsByStatus: {
        applied: jobs.filter((job) => job.status === 'applied').length,
        interview: interviews,
        offer: offers,
        rejected: rejected,
      },
      recentMatches: jobs.slice(-10), // Assuming you want the last 10 jobs
      weeklyStats, // Include weeklyStats in the returned object
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => setShowJobForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Job
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Stats Section */}
        <DashboardStats stats={calculateStats()} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Jobs List */}
          <div className="lg:col-span-2">
            <JobsList jobs={jobs} onJobUpdated={loadDashboardData} />
          </div>

          {/* Profile Section */}
          <div className="space-y-6">
            <ResumeProfile
              profile={profile}
              onUpdateProfile={async (section, data) => {
                if (!currentUser?.uid) return;
                try {
                  await updateProfileSection(currentUser.uid, section, data);
                  await loadDashboardData();
                } catch (err) {
                  console.error('Error updating profile:', err);
                  setError('Failed to update profile');
                }
              }}
            />
          </div>
        </div>

        {/* Job Form Modal */}
        {showJobForm && (
          <JobForm onClose={() => setShowJobForm(false)} onSubmit={handleAddJob} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
