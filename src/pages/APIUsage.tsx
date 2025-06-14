
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Filter,
  Download,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useAPIUsage } from '@/hooks/useDashboardData';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { useToast } from '@/hooks/use-toast';

const ModelUsagePage = () => {
  useRealTimeUpdates();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { data, isLoading } = useAPIUsage();
  const { toast } = useToast();

  const filteredLogs = React.useMemo(() => {
    if (!data?.apiLogs) return [];
    
    return data.apiLogs.filter(log => {
      const matchesSearch = searchTerm === '' || 
        log.ai_models?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.request_id?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [data?.apiLogs, searchTerm, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Model Usage</h1>
          <p className="text-gray-600 mt-1">Monitor and analyze your AI model usage patterns</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Model Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Models</CardTitle>
            <Zap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{data?.apiKeys?.length || 0}</div>
            <p className="text-xs text-gray-600">Available for your organization</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{filteredLogs.length}</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {filteredLogs.length > 0 
                ? Math.round((filteredLogs.filter(log => log.status === 'success').length / filteredLogs.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-gray-600">All time average</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by model, user, or request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300 text-gray-900"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              {['all', 'success', 'error'].map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-300 text-gray-700'}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Usage Logs */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Recent Model Requests ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.length ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(log.status)}
                        <span className="text-gray-900 font-medium">{log.ai_models?.name || 'Unknown Model'}</span>
                        <Badge variant="outline" className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                        <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {log.request_id}
                        </code>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">User</p>
                          <p className="text-gray-900 font-medium">{log.users?.full_name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tokens</p>
                          <p className="text-gray-900 font-medium">{log.total_tokens?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Cost</p>
                          <p className="text-gray-900 font-medium">${log.total_cost?.toFixed(4) || '0.0000'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Response Time</p>
                          <p className="text-gray-900 font-medium">{log.response_time_ms || 0}ms</p>
                        </div>
                      </div>
                      
                      {log.error_message && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                          <p className="text-red-700 text-sm">{log.error_message}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right text-sm text-gray-600">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No model usage found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelUsagePage;
