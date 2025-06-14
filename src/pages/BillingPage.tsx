
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Download, 
  AlertCircle,
  TrendingUp,
  DollarSign,
  Calendar,
  Zap,
  Plus
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const BillingPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock billing data
  const currentUsage = {
    period: 'January 2024',
    totalCost: 2847.50,
    limit: 5000.00,
    usage: 57,
    daysLeft: 5,
    projectedCost: 3200.00
  };

  const usageBreakdown = [
    { model: 'GPT-4', requests: 847234, cost: 1247.50, percentage: 44 },
    { model: 'GPT-3.5 Turbo', requests: 652180, cost: 892.30, percentage: 31 },
    { model: 'Claude-3', requests: 234567, cost: 456.80, percentage: 16 },
    { model: 'Text Embedding', requests: 123456, cost: 234.90, percentage: 8 },
    { model: 'Others', requests: 45678, cost: 16.00, percentage: 1 }
  ];

  const monthlySpend = [
    { month: 'Jul', cost: 1850.30 },
    { month: 'Aug', cost: 2240.80 },
    { month: 'Sep', cost: 1995.60 },
    { month: 'Oct', cost: 2567.90 },
    { month: 'Nov', cost: 2890.45 },
    { month: 'Dec', cost: 3120.75 },
    { month: 'Jan', cost: 2847.50 },
  ];

  const invoices = [
    {
      id: 'INV-2024-001',
      date: '2024-01-01',
      amount: 3120.75,
      status: 'paid',
      period: 'December 2023'
    },
    {
      id: 'INV-2023-012',
      date: '2023-12-01',
      amount: 2890.45,
      status: 'paid',
      period: 'November 2023'
    },
    {
      id: 'INV-2023-011',
      date: '2023-11-01',
      amount: 2567.90,
      status: 'paid',
      period: 'October 2023'
    },
    {
      id: 'INV-2023-010',
      date: '2023-10-01',
      amount: 1995.60,
      status: 'paid',
      period: 'September 2023'
    }
  ];

  const paymentMethods = [
    {
      id: 1,
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/25',
      default: true
    },
    {
      id: 2,
      type: 'card',
      last4: '8888',
      brand: 'Mastercard',
      expiry: '08/26',
      default: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-600/20 text-green-400">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-600/20 text-yellow-400">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-600/20 text-red-400">Overdue</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Billing & Usage</h1>
            <p className="text-gray-300">Monitor your usage and manage billing information</p>
          </div>
          
          <div className="flex space-x-3">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Download className="w-4 h-4 mr-2" />
              Export Usage
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </div>
      </div>

      {/* Current Usage Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Meter */}
        <Card className="glass-card border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Current Usage - {currentUsage.period}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">${currentUsage.totalCost.toFixed(2)}</p>
                  <p className="text-gray-300">of ${currentUsage.limit.toFixed(2)} limit</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Projected</p>
                  <p className="text-xl font-semibold text-yellow-400">${currentUsage.projectedCost.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Usage Progress</span>
                  <span className="text-gray-300">{currentUsage.usage}%</span>
                </div>
                <Progress value={currentUsage.usage} className="h-3" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{currentUsage.daysLeft} days left in billing period</span>
                </div>
                {currentUsage.projectedCost > currentUsage.limit && (
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>Projected to exceed limit</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-blue-600/20">
                  <TrendingUp className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-sm text-green-400">+15.3%</div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-white">${currentUsage.totalCost.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-green-600/20">
                  <Zap className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-sm text-gray-400">Requests</div>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Total API Calls</p>
                <p className="text-2xl font-bold text-white">1.9M</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Breakdown */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white">Usage Breakdown by Model</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageBreakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 glass rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">{item.model}</p>
                    <p className="text-sm text-gray-400">{item.requests.toLocaleString()} requests</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${item.cost.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Spend Chart */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-white">Monthly Spending Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySpend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Cost']}
                />
                <Bar dataKey="cost" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods and Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <Card className="glass-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Payment Methods</CardTitle>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 glass rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-gray-700">
                      <CreditCard className="w-5 h-5 text-gray-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {method.brand} •••• {method.last4}
                      </p>
                      <p className="text-sm text-gray-400">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.default && (
                      <Badge variant="secondary" className="bg-blue-600/20 text-blue-400">
                        Default
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card className="glass-card border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Recent Invoices</CardTitle>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 glass rounded-lg">
                  <div>
                    <p className="text-white font-medium">{invoice.id}</p>
                    <p className="text-sm text-gray-400">{invoice.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${invoice.amount.toFixed(2)}</p>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(invoice.status)}
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-1">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingPage;
