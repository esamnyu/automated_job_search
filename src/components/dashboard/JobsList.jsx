// src/components/dashboard/JobsList.jsx
import React from 'react';

export default function JobsList({ jobs, onJobUpdated }) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No jobs yet</h3>
        <p className="mt-2 text-sm text-gray-500">
          Get started by adding your first job application
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <li key={job.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{job.company}</h3>
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${job.status === 'applied' ? 'bg-yellow-100 text-yellow-800' : 
                    job.status === 'interview' ? 'bg-green-100 text-green-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                  {job.status}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-600">{job.position}</p>
                <p className="mt-1 text-sm text-gray-500">{job.location}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}