// components/dashboard/DashboardStats.jsx
import React from 'react';
import Card from '../ui/Card';

const StatCard = ({ title, value, description, trend }) => {
  const getTrendColor = (trend) => {
    if (!trend) return 'text-gray-500';
    return trend > 0 ? 'text-green-500' : 'text-red-500';
  };

  const getTrendIcon = (trend) => {
    if (!trend) return null;
    return trend > 0 ? '↑' : '↓';
  };

  return (
    <Card className="p-4">
      <div className="flex flex-col">
        <div className="text-sm text-gray-600 font-medium">{title}</div>
        <div className="mt-1 flex items-baseline">
          <div className="text-2xl font-semibold">{value}</div>
          {trend && (
            <span className={`ml-2 text-sm ${getTrendColor(trend)}`}>
              {getTrendIcon(trend)} {Math.abs(trend)}%
            </span>
          )}
        </div>
        {description && (
          <div className="mt-1 text-sm text-gray-500">{description}</div>
        )}
      </div>
    </Card>
  );
};

const MatchQualityChart = ({ matches }) => {
  // Group matches by quality ranges
  const matchRanges = {
    'Excellent (90%+)': matches.filter(m => m.matchScore?.overall >= 0.9).length,
    'Good (75-89%)': matches.filter(m => m.matchScore?.overall >= 0.75 && m.matchScore?.overall < 0.9).length,
    'Fair (60-74%)': matches.filter(m => m.matchScore?.overall >= 0.6 && m.matchScore?.overall < 0.75).length,
    'Low (<60%)': matches.filter(m => m.matchScore?.overall < 0.6).length
  };

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Match Quality Distribution</h3>
      <div className="space-y-2">
        {Object.entries(matchRanges).map(([range, count]) => (
          <div key={range} className="flex items-center">
            <div className="w-32 text-sm text-gray-600">{range}</div>
            <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  range.includes('Excellent') ? 'bg-green-500' :
                  range.includes('Good') ? 'bg-blue-500' :
                  range.includes('Fair') ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${matches.length ? (count / matches.length) * 100 : 0}%` }}
              />
            </div>
            <div className="w-12 text-right text-sm text-gray-600">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardStats = ({ stats }) => {
  if (!stats) {
    return null; // or a loading indicator
  }

  return (
    <div className="space-y-6">
      {/* Main stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Jobs Tracked"
          value={stats.totalJobs}
          description="Total opportunities analyzed"
        />
        <StatCard
          title="Active Applications"
          value={stats.activeApplications}
          description="Currently in progress"
        />
        <StatCard
          title="Interview Rate"
          value={`${stats.interviewRate ? stats.interviewRate.toFixed(1) : '0.0'}%`}
          description="Of applications"
          trend={10} // Placeholder trend value
        />

        <StatCard
          title="Average Match Score"
          value={`${(stats.averageMatchScore * 100).toFixed(1)}%`}
          description="Across all jobs"
        />
      </div>

      {/* Weekly activity */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Weekly Activity</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="New Matches"
            value={stats.weeklyStats.applications}
            description="Last 7 days"
          />
          <StatCard
            title="Interviews Scheduled"
            value={stats.weeklyStats.interviews}
            description="Last 7 days"
          />
          <StatCard
            title="Response Rate"
            value={`${stats.weeklyStats.applications ?
              ((stats.weeklyStats.responses / stats.weeklyStats.applications) * 100).toFixed(1) :
              0}%`}
            description="Last 7 days"
          />
        </div>
      </Card>

      {/* Application status breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Application Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(stats.applicationsByStatus).map(([status, count]) => (
            <div key={status} className="text-center">
              <div className="text-2xl font-semibold">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{status}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Match quality distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Match Quality Analysis</h3>
        <MatchQualityChart matches={stats.recentMatches} />
      </Card>
    </div>
  );
};

export default DashboardStats;
