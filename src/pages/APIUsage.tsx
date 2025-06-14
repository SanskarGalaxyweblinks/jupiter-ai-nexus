
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Search,
  Download,
  RefreshCw,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const APIUsage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [liveRequests, setLiveRequests] = useState(1247);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveRequests(prev => prev + Math.floor(Math.random() * 5));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Mock real-time performance data
  const performanceData = [
    { time: '10:00', responseTime: 234, requests: 45 },
    { time: '10:05', responseTime: 221, requests: 52 },
    { time: '10:10', responseTime: 245, requests: 48 },
    { time: '10:15', responseTime: 198, requests: 67 },
    { time: '10:20', responseTime: 267, requests: 43 },
    { time: '10:25', responseTime: 189, requests: 58 },
    { time: '10:30', responseTime: 203, requests: 61 },
  ];

  // Mock API calls data
  const apiCalls = [
    {
      id: 'req_123456789',
      endpoint: '/v1/chat/completions',
      method: 'POST',
      status: 200,
      responseTime: 234,
      timestamp: '2024-01-15 10:32:15',
      model: 'gpt-4',
      tokens: 1247,
      cost: 0.0372
    },
    {
      id: 'req_123456788',
      endpoint: '/v1/completions',
      method: 'POST',
      status: 200,
      responseTime: 189,
      timestamp: '2024-01-15 10:32:10',
      model: 'gpt-3.5-turbo',
      tokens: 892,
      cost: 0.0178
    },
    {
      id: 'req_123456787',
      endpoint: '/v1/embeddings',
      method: 'POST',
      status: 429,
      responseTime: 145,
      timestamp: '2024-01-15 10:32:05',
      model: 'text-embedding-ada-002',
      tokens: 0,
      cost: 0.0000
    },
    {
      id: 'req_123456786',
      endpoint: '/v1/chat/completions',
      method: 'POST',
      status: 200,
      responseTime: 312,
      timestamp: '2024-01-15 10:32:00',
      model: 'gpt-4',
      tokens: 1834,
      cost: 0.0550
    },
    {
      id: 'req_123456785',
      endpoint: '/v1/completions',
      method: 'POST',
      status: 500,
      responseTime: 0,
      timestamp: '2024-01-15 10:31:55',
      model: 'gpt-3.5-turbo',
      tokens: 0,
      cost: 0.0000
    }
  ];

  const endpointStats = [
    { endpoint: '/v1/chat/completions', requests: 45287, avgResponseTime: 234, successRate: 99.2 },
    { endpoint: '/v1/completions', requests: 32156, avgResponseTime: 189, successRate: 99.7 },
    { endpoint: '/v1/embeddings', requests: 18943, avgResponseTime: 145, successRate: 98.8 },
    { endpoint: '/v1/images/generations', requests: 8234, avgResponseTime: 2340, successRate: 97.5 },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return <Badge className="bg-green-600/20 text-green-400 hover:bg-green-600/30">Success</Badge>;
    } else if (status >= 400 && status < 500) {
      return <Badge className="bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30">Client Error</Badge>;
    } else if (status >= 500) {
      return <Badge className="bg-red-600/20 text-red-400 hover:bg-red-600/30">Server Error</Badge>;
    }
    return <Badge variant="secondary">Unknown</Badge>;
  };

  const getStatusIcon = (status: number) => {
    if (status >= 200 && status < 300) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    } else if (status >= 400 && status < 500) {
      return <AlertCircle className="w-4 h-4 text-yellow-400" />;
    } else if (status >= 500) {
      return <XCircle className="w-4 h-4 text-red-400" />;
    }
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">API Usage Monitoring</h1>
            <p className="text-gray-300">Real-time monitoring of your API requests and performance</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-600/20 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Live</span>
            </div>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-blue-600/20">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-sm text-green-400">Live</div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Requests/min</p>
              <p className="text-2xl font-bold text-white">{liveRequests.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-green-600/20">
                <Clock className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-sm text-green-400">Avg</div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Response Time</p>
              <p className="text-2xl font-bold text-white">234ms</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-green-600/20">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-sm text-green-400">Success</div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-white">99.2%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 rounded-lg bg-purple-600/20">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <div className="text-sm text-purple-400">Peak</div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Peak Load</p>
              <p className="text-2xl font-bold text-white">1,847</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white">Real-time Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="responseTime" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* API Calls Table */}
      <Card className="glass-card border-0">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <CardTitle className="text-white">Recent API Calls</CardTitle>
            <div className="flex space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Request ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Endpoint</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Model</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Response Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Tokens</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Cost</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-300">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {apiCalls.map((call, index) => (
                  <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(call.status)}
                        {getStatusBadge(call.status)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-300 font-mono text-sm">{call.id}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-medium">{call.endpoint}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                        {call.model}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{call.responseTime}ms</td>
                    <td className="py-3 px-4 text-gray-300">{call.tokens.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-300">${call.cost.toFixed(4)}</td>
                    <td className="py-3 px-4 text-gray-300">{call.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Endpoint Statistics */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white">Endpoint Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {endpointStats.map((stat, index) => (
              <div key={index} className="glass rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate">{stat.endpoint}</span>
                    <Badge variant="secondary" className="text-xs">
                      {stat.successRate}% success
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-gray-400">Requests</div>
                      <div className="text-white font-medium">{stat.requests.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Avg Time</div>
                      <div className="text-white font-medium">{stat.avgResponseTime}ms</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIUsage;
