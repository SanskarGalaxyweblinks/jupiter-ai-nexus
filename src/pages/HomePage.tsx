
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, DollarSign, Zap, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AnimatedCounter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

const HomePage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock data for the chart
  const chartData = [
    { name: 'Mon', requests: 12400, responseTime: 234 },
    { name: 'Tue', requests: 13200, responseTime: 221 },
    { name: 'Wed', requests: 15800, responseTime: 245 },
    { name: 'Thu', requests: 14200, responseTime: 198 },
    { name: 'Fri', requests: 16800, responseTime: 267 },
    { name: 'Sat', requests: 11200, responseTime: 189 },
    { name: 'Sun', requests: 9800, responseTime: 203 },
  ];

  const recentActivity = [
    { time: '2 minutes ago', action: 'High usage detected', type: 'warning' },
    { time: '15 minutes ago', action: 'API key regenerated', type: 'info' },
    { time: '1 hour ago', action: 'New team member added', type: 'success' },
    { time: '3 hours ago', action: 'Rate limit adjusted', type: 'info' },
    { time: '5 hours ago', action: 'Payment processed successfully', type: 'success' },
  ];

  const metricCards = [
    {
      title: 'API Requests',
      value: 847234,
      change: '+12.5%',
      trend: 'up',
      icon: <Activity className="w-6 h-6 text-blue-400" />,
      color: 'blue'
    },
    {
      title: 'Avg Response Time',
      value: 234,
      suffix: 'ms',
      change: '-5.2%',
      trend: 'down',
      icon: <Clock className="w-6 h-6 text-green-400" />,
      color: 'green'
    },
    {
      title: 'Peak Load',
      value: 1247,
      suffix: 'req/s',
      change: '+8.1%',
      trend: 'up',
      icon: <Zap className="w-6 h-6 text-purple-400" />,
      color: 'purple'
    },
    {
      title: 'Outstanding Balance',
      value: 2847,
      prefix: '$',
      change: 'Due in 5 days',
      trend: 'neutral',
      icon: <DollarSign className="w-6 h-6 text-yellow-400" />,
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Welcome back, John! 👋
            </h1>
            <p className="text-gray-300">
              Here's what's happening with your AI models today.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            {['24h', '7d', '30d'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={selectedPeriod === period ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600 text-gray-300 hover:bg-gray-700'}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <Card key={index} className="glass-card border-0 hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-gray-800/50">
                  {metric.icon}
                </div>
                <div className={`flex items-center text-sm ${
                  metric.trend === 'up' ? 'text-green-400' : 
                  metric.trend === 'down' ? 'text-green-400' : 
                  'text-gray-400'
                }`}>
                  {metric.trend === 'up' && <TrendingUp className="w-4 h-4 mr-1" />}
                  {metric.trend === 'down' && <TrendingDown className="w-4 h-4 mr-1" />}
                  {metric.change}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">{metric.title}</p>
                <p className="text-2xl font-bold text-white">
                  {metric.prefix}
                  <AnimatedCounter end={metric.value} />
                  {metric.suffix}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Chart */}
        <Card className="glass-card border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Usage Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
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
                    dataKey="requests" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#3B82F6' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-400' :
                    activity.type === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 justify-start">
              <Zap className="w-4 h-4 mr-2" />
              Generate API Key
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 justify-start">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 justify-start">
              <DollarSign className="w-4 h-4 mr-2" />
              Billing Settings
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 justify-start">
              <Activity className="w-4 h-4 mr-2" />
              System Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
