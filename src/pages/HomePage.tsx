
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Activity,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useDashboardStats, useUsageAnalytics } from '@/hooks/useDashboardData';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';

const HomePage = () => {
  // Enable real-time updates
  useRealTimeUpdates();
  
  // Fetch real data
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: analyticsData, isLoading: analyticsLoading } = useUsageAnalytics('7d');

  // Process analytics data for charts
  const processedAnalytics = React.useMemo(() => {
    if (!analyticsData) return [];
    
    // Group by date and sum across models
    const grouped = analyticsData.reduce((acc, item) => {
      const date = item.usage_date;
      if (!acc[date]) {
        acc[date] = {
          date,
          requests: 0,
          cost: 0,
          tokens: 0,
          response_time: 0,
          count: 0
        };
      }
      acc[date].requests += item.total_requests || 0;
      acc[date].cost += item.total_cost || 0;
      acc[date].tokens += item.total_tokens || 0;
      acc[date].response_time += item.avg_response_time_ms || 0;
      acc[date].count += 1;
      return acc;
    }, {} as any);

    return Object.values(grouped).map((item: any) => ({
      ...item,
      response_time: item.count > 0 ? Math.round(item.response_time / item.count) : 0,
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  }, [analyticsData]);

  if (statsLoading) {
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Real-time AI usage analytics and insights</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            Live Data
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-card border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Requests Today</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalRequests?.toLocaleString() || '0'}</div>
            <p className="text-xs text-gray-400">
              <span className="text-green-400">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Cost Today</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${stats?.totalCost?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-gray-400">
              <span className="text-green-400">Monthly: ${stats?.monthlyBilling?.toFixed(2) || '0.00'}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.avgResponseTime || 0}ms</div>
            <p className="text-xs text-gray-400">
              <span className="text-green-400">-5%</span> faster than average
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.successRate || 0}%</div>
            <Progress value={stats?.successRate || 0} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">API Usage Trend (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="h-[300px] animate-pulse bg-gray-200 rounded"></div>
            ) : (
              <ChartContainer config={{
                requests: { label: "Requests", color: "#3b82f6" }
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={processedAnalytics}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Cost Trend (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="h-[300px] animate-pulse bg-gray-200 rounded"></div>
            ) : (
              <ChartContainer config={{
                cost: { label: "Cost ($)", color: "#10b981" }
              }} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={processedAnalytics}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent API Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats?.recentCalls?.slice(0, 5).map((call, index) => (
              <div key={call.request_id || index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${call.status === 'success' ? 'bg-green-400' : 'bg-red-400'}`}></div>
                  <div>
                    <p className="text-white font-medium">{call.ai_models?.name || 'Unknown Model'}</p>
                    <p className="text-xs text-gray-400">
                      {call.users?.full_name || 'Unknown User'} • {call.total_tokens} tokens
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white">${call.total_cost?.toFixed(4) || '0.0000'}</p>
                  <p className="text-xs text-gray-400">{call.response_time_ms}ms</p>
                </div>
              </div>
            )) || (
              <p className="text-gray-400 text-center py-8">No recent API calls</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
