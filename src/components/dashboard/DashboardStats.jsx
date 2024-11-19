// src/components/dashboard/DashboardStats.jsx
import React from 'react';
import Card from '../ui/Card';
import { Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, color }) => (
  <Card className="flex items-center p-4">
    <div className={`p-2 rounded-full ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-xl font-semibold text-gray-900">{value}</h3>
    </div>
  </Card>
);

const DashboardStats = ({ jobs = [] }) => {
  const stats = {
    total: jobs.length,
    active: jobs.filter(job => !['Rejected', 'Withdrawn'].includes(job.status)).length,
    interviews: jobs.filter(job => job.status === 'Interview').length,
    rejected: jobs.filter(job => job.status === 'Rejected').length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Applications"
        value={stats.total}
        icon={Briefcase}
        color="bg-blue-500"
      />
      <StatsCard
        title="Active Applications"
        value={stats.active}
        icon={Clock}
        color="bg-yellow-500"
      />
      <StatsCard
        title="Interviews"
        value={stats.interviews}
        icon={CheckCircle}
        color="bg-green-500"
      />
      <StatsCard
        title="Rejected"
        value={stats.rejected}
        icon={XCircle}
        color="bg-red-500"
      />
    </div>
  );
};

export default DashboardStats;