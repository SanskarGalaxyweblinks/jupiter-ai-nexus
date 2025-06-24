
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDashboardStats, useUsageHistory } from '@/hooks/useDashboardData';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { ApiUsageSimulator } from '@/components/ApiUsageSimulator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, DollarSign, Clock, CheckCircle, Zap } from 'lucide-react';

const HomePage = () => {
  useRealTimeUpdates();
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: usageHistory } = useUsageHistory(7);

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">AI Analytics Dashboard</h1>
        <p className="text-gray-600">Monitor your AI API usage and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalRequests?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.totalCost?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgResponseTime || 0}ms</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.successRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Usage History (Last 7 Days)</CardTitle>
            <CardDescription>Daily API requests and costs</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="usage_date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line yAxisId="left" type="monotone" dataKey="total_requests" stroke="#8884d8" name="Requests" />
                <Line yAxisId="right" type="monotone" dataKey="total_cost" stroke="#82ca9d" name="Cost ($)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <ApiUsageSimulator />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent API Calls</CardTitle>
          <CardDescription>Latest API usage activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentCalls?.length > 0 ? (
              stats.recentCalls.map((call: any) => (
                <div key={call.request_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Badge variant={call.status === 'success' ? 'default' : 'destructive'}>
                      {call.status}
                    </Badge>
                    <div>
                      <p className="font-medium">{call.ai_models?.name || 'Unknown Model'}</p>
                      <p className="text-sm text-gray-500">
                        {call.users?.full_name || 'Unknown User'} • {call.total_tokens} tokens
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${call.total_cost?.toFixed(4) || '0.0000'}</p>
                    <p className="text-sm text-gray-500">{call.response_time_ms}ms</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Zap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No recent API calls</p>
                <p className="text-sm">Use the simulator to generate some test data</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
