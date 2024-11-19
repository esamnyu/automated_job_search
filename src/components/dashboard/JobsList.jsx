import React from 'react';
import Card from '../ui/Card';
import { MoreVertical, Calendar, Building2 } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    Applied: 'bg-blue-100 text-blue-800',
    Interview: 'bg-yellow-100 text-yellow-800',
    Offer: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`px-2 py-1 text-sm rounded-full ${statusStyles[status] || statusStyles.default}`}>
      {status}
    </span>
  );
};

const JobCard = ({ job }) => {
  const formattedDate = new Date(job.appliedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="py-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-medium text-gray-900">
              {job.position}
            </h3>
            <StatusBadge status={job.status} />
          </div>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center text-sm text-gray-600">
              <Building2 className="w-4 h-4 mr-1" />
              {job.company}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              {formattedDate}
            </div>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded-full">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

const JobsList = ({ jobs = [
  {
    id: 1,
    company: 'Example Corp',
    position: 'Software Engineer',
    status: 'Applied',
    appliedDate: '2024-03-19'
  }
] }) => {
  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Job Applications</h2>
        <div className="text-sm text-gray-500">
          {jobs.length} {jobs.length === 1 ? 'application' : 'applications'}
        </div>
      </div>

      <div className="divide-y">
        {jobs.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No applications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Start tracking your job applications
            </p>
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>
    </Card>
  );
};

export default JobsList;