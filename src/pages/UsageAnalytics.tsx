
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useUsageAnalytics } from '@/hooks/useDashboardData';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';

const UsageAnalytics = () => {
  useRealTimeUpdates();
  
  const [dateRange, setDateRange] = useState('7d');
  const { data: analyticsData, isLoading } = useUsageAnalytics(dateRange);

  // Process data for different chart types
  const processedData = React.useMemo(() => {
    if (!analyticsData) return { timeline: [], models: [], costs: [] };
    
    // Timeline data (grouped by date)
    const timeline = analyticsData.reduce((acc, item) => {
      const date = new Date(item.usage_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = acc.find(d => d.date === date);
      
      if (existing) {
        existing.requests += item.total_requests || 0;
        existing.cost += item.total_cost || 0;
        existing.tokens += item.total_tokens || 0;
        existing.response_time = Math.round((existing.response_time + (item.avg_response_time_ms || 0)) / 2);
      } else {
        acc.push({
          date,
          requests: item.total_requests || 0,
          cost: item.total_cost || 0,
          tokens: item.total_tokens || 0,
          response_time: item.avg_response_time_ms || 0
        });
      }
      return acc;
    }, [] as any[]);

    // Model usage data
    const models = analyticsData.reduce((acc, item) => {
      const model = item.ai_models?.name || 'Unknown';
      const existing = acc.find(m => m.name === model);
      
      if (existing) {
        existing.requests += item.total_requests || 0;
        existing.cost += item.total_cost || 0;
        existing.tokens += item.total_tokens || 0;
      } else {
        acc.push({
          name: model,
          requests: item.total_requests || 0,
          cost: item.total_cost || 0,
          tokens: item.total_tokens || 0,
          provider: item.ai_models?.provider || 'unknown'
        });
      }
      return acc;
    }, [] as any[]);

    return {
      timeline: timeline.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      models: models.sort((a, b) => b.requests - a.requests),
      costs: timeline
    };
  }, [analyticsData]);

  const chartConfig = {
    requests: { label: "Requests", color: "#3b82f6" },
    cost: { label: "Cost ($)", color: "#10b981" },
    tokens: { label: "Tokens", color: "#f59e0b" },
    response_time: { label: "Response Time (ms)", color: "#ef4444" }
  };

  const modelColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-white">Usage Analytics</h1>
          <p className="text-gray-400 mt-1">Detailed insights into your AI model usage patterns</p>
        </div>
        
        <div className="flex space-x-2">
          {['7d', '30d', '90d'].map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range)}
              className={dateRange === range ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-gray-700">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">
              {processedData.timeline.reduce((sum, d) => sum + d.requests, 0).toLocaleString()}
            </div>
            <p className="text-xs text-gray-400 mt-1">Total Requests</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-gray-700">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">
              ${processedData.timeline.reduce((sum, d) => sum + d.cost, 0).toFixed(2)}
            </div>
            <p className="text-xs text-gray-400 mt-1">Total Cost</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-gray-700">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">
              {(processedData.timeline.reduce((sum, d) => sum + d.tokens, 0) / 1000).toFixed(1)}K
            </div>
            <p className="text-xs text-gray-400 mt-1">Total Tokens</p>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-gray-700">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-white">
              {processedData.models.length}
            </div>
            <p className="text-xs text-gray-400 mt-1">Models Used</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Requests Timeline */}
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Requests Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={processedData.timeline}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Cost Timeline */}
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Cost Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData.timeline}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Model Usage Bar Chart */}
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Usage by Model</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData.models}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="requests" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Response Time Trend */}
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Response Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData.timeline}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="response_time" stroke="#ef4444" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Model Details Table */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Model Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Model</th>
                  <th className="text-left py-3 px-4 text-gray-300">Provider</th>
                  <th className="text-right py-3 px-4 text-gray-300">Requests</th>
                  <th className="text-right py-3 px-4 text-gray-300">Tokens</th>
                  <th className="text-right py-3 px-4 text-gray-300">Cost</th>
                </tr>
              </thead>
              <tbody>
                {processedData.models.map((model, index) => (
                  <tr key={model.name} className="border-b border-gray-800">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: modelColors[index % modelColors.length] }}
                        ></div>
                        <span className="text-white font-medium">{model.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="capitalize">
                        {model.provider}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right text-white">{model.requests.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-white">{model.tokens.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-white">${model.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsageAnalytics;
