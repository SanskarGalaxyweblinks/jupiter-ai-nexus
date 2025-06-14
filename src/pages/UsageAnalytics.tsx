
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Filter } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

const UsageAnalytics = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [selectedModel, setSelectedModel] = useState('all');

  // Mock data
  const usageTrendData = [
    { date: '2024-01-01', gpt4: 12400, gpt35: 8200, claude: 3400, total: 24000 },
    { date: '2024-01-02', gpt4: 13200, gpt35: 9100, claude: 3800, total: 26100 },
    { date: '2024-01-03', gpt4: 15800, gpt35: 7900, claude: 4200, total: 27900 },
    { date: '2024-01-04', gpt4: 14200, gpt35: 8800, claude: 3900, total: 26900 },
    { date: '2024-01-05', gpt4: 16800, gpt35: 9500, claude: 4500, total: 30800 },
    { date: '2024-01-06', gpt4: 11200, gpt35: 7200, claude: 2800, total: 21200 },
    { date: '2024-01-07', gpt4: 9800, gpt35: 6800, claude: 2400, total: 19000 },
  ];

  const modelDistribution = [
    { name: 'GPT-4', value: 45, color: '#3B82F6' },
    { name: 'GPT-3.5', value: 35, color: '#10B981' },
    { name: 'Claude', value: 15, color: '#F59E0B' },
    { name: 'Others', value: 5, color: '#EF4444' },
  ];

  const peakUsageData = [
    { hour: '00:00', usage: 1200 },
    { hour: '02:00', usage: 800 },
    { hour: '04:00', usage: 600 },
    { hour: '06:00', usage: 1400 },
    { hour: '08:00', usage: 3200 },
    { hour: '10:00', usage: 4800 },
    { hour: '12:00', usage: 5200 },
    { hour: '14:00', usage: 4600 },
    { hour: '16:00', usage: 3800 },
    { hour: '18:00', usage: 2400 },
    { hour: '20:00', usage: 1800 },
    { hour: '22:00', usage: 1600 },
  ];

  const detailedMetrics = [
    { model: 'GPT-4', requests: 847234, tokens: 12400000, avgLatency: 234, successRate: 99.2, cost: 2847.50 },
    { model: 'GPT-3.5', requests: 652180, tokens: 8900000, avgLatency: 189, successRate: 99.7, cost: 1243.20 },
    { model: 'Claude-3', requests: 234567, tokens: 3200000, avgLatency: 298, successRate: 98.9, cost: 892.30 },
    { model: 'Gemini Pro', requests: 123456, tokens: 1800000, avgLatency: 267, successRate: 99.1, cost: 456.80 },
  ];

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Usage Analytics</h1>
            <p className="text-gray-300">Detailed insights into your AI model usage patterns</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-40 bg-gray-800/50 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                <SelectItem value="gpt4">GPT-4</SelectItem>
                <SelectItem value="gpt35">GPT-3.5</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Usage Trend Chart */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white">Usage Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3B82F6" 
                  fill="url(#colorTotal)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Model Distribution and Peak Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Model Distribution */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white">Model Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={modelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {modelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {modelDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-300">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Peak Usage Times */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white">Peak Usage Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakUsageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar dataKey="usage" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics Table */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white">Detailed Model Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Model</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Requests</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Tokens</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Avg Latency</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Success Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Cost</th>
                </tr>
              </thead>
              <tbody>
                {detailedMetrics.map((metric, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-white font-medium">{metric.model}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{metric.requests.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-300">{(metric.tokens / 1000000).toFixed(1)}M</td>
                    <td className="py-3 px-4 text-gray-300">{metric.avgLatency}ms</td>
                    <td className="py-3 px-4">
                      <Badge variant={metric.successRate > 99 ? 'default' : 'secondary'} className="bg-green-600/20 text-green-400">
                        {metric.successRate}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-300">${metric.cost.toFixed(2)}</td>
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
