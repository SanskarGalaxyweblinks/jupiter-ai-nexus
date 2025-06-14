
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search,
  Filter,
  Download,
  Key,
  Eye,
  EyeOff,
  Copy,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useAPIUsage } from '@/hooks/useDashboardData';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { useToast } from '@/hooks/use-toast';

const APIUsage = () => {
  useRealTimeUpdates();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showApiKey, setShowApiKey] = useState(false);
  
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">API Usage</h1>
          <p className="text-gray-400 mt-1">Monitor and analyze your API calls in real-time</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="border-gray-600">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* API Keys Section */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Key className="w-5 h-5 mr-2" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.apiKeys?.length ? (
              data.apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">{key.name || 'Unnamed Key'}</p>
                    <p className="text-sm text-gray-400">
                      {key.environment} • Last used: {key.last_used ? new Date(key.last_used).toLocaleDateString() : 'Never'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <code className="bg-gray-900 px-3 py-1 rounded text-sm text-gray-300">
                      {showApiKey ? `${key.key_prefix}${'*'.repeat(32)}` : `${key.key_prefix}${'*'.repeat(8)}`}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`${key.key_prefix}${'*'.repeat(32)}`)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No API keys found</p>
                <Button className="mt-4" size="sm">Create API Key</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="glass-card border-gray-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by model, user, or request ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-gray-600 text-white"
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
                  className={statusFilter === status ? 'bg-blue-600 hover:bg-blue-700' : 'border-gray-600'}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Logs */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent API Calls ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.length ? (
              filteredLogs.map((log) => (
                <div key={log.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(log.status)}
                        <span className="text-white font-medium">{log.ai_models?.name || 'Unknown Model'}</span>
                        <Badge variant="outline" className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                        <code className="text-xs text-gray-400 bg-gray-900 px-2 py-1 rounded">
                          {log.request_id}
                        </code>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400">User</p>
                          <p className="text-white">{log.users?.full_name || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Tokens</p>
                          <p className="text-white">{log.total_tokens?.toLocaleString() || '0'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Cost</p>
                          <p className="text-white">${log.total_cost?.toFixed(4) || '0.0000'}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Response Time</p>
                          <p className="text-white">{log.response_time_ms || 0}ms</p>
                        </div>
                      </div>
                      
                      {log.error_message && (
                        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                          <p className="text-red-400 text-sm">{log.error_message}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right text-sm text-gray-400">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No API calls found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIUsage;
