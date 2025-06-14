
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  DollarSign, 
  Activity,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useDashboardStats, useUserProfile } from '@/hooks/useDashboardData';

const HomePage = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile();

  if (statsLoading || profileLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {userProfile?.full_name || 'User'}! Here's your AI model usage overview.
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            {stats?.recentCalls?.length ? 'Live Data' : 'Demo Data'}
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Requests Today</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.totalRequests?.toLocaleString() || '0'}</div>
            <p className="text-xs text-gray-600">
              <span className="text-green-600 font-medium">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cost Today</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${stats?.totalCost?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-gray-600">
              <span className="text-gray-500">Monthly: ${stats?.monthlyBilling?.toFixed(2) || '0.00'}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.avgResponseTime || 0}ms</div>
            <p className="text-xs text-gray-600">
              <span className="text-green-600 font-medium">-5%</span> faster than average
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats?.successRate || 0}%</div>
            <Progress value={stats?.successRate || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Model Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentCalls?.length ? (
              stats.recentCalls.slice(0, 5).map((call, index) => (
                <div key={call.request_id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${call.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="text-gray-900 font-medium">{call.ai_models?.name || 'Unknown Model'}</p>
                      <p className="text-xs text-gray-600">
                        {call.users?.full_name || 'Unknown User'} • {call.total_tokens} tokens
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900 font-medium">${call.total_cost?.toFixed(4) || '0.0000'}</p>
                    <p className="text-xs text-gray-600">{call.response_time_ms}ms</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No recent model usage found</p>
                <p className="text-xs text-gray-500 mt-2">Start using AI models to see activity here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-gray-900 font-medium mb-2">View Billing Details</h3>
              <p className="text-gray-600 text-sm mb-3">Check your current usage and billing information</p>
              <a href="/dashboard/billing" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Go to Billing →
              </a>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-gray-900 font-medium mb-2">Update Profile</h3>
              <p className="text-gray-600 text-sm mb-3">Manage your account settings and preferences</p>
              <a href="/dashboard/settings" className="text-green-600 hover:text-green-700 text-sm font-medium">
                Go to Settings →
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
