
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Download, 
  DollarSign, 
  TrendingUp,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useBillingInfo } from '@/hooks/useDashboardData';

const BillingPage = () => {
  const { data: billingData, isLoading } = useBillingInfo();

  // Mock current usage data - in real app this would come from API
  const currentUsage = {
    requests: 8542,
    requestLimit: 10000,
    cost: 127.45,
    costLimit: 200,
    tokens: 1250000,
    tokenLimit: 2000000
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'overdue':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'overdue':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-white">Billing & Usage</h1>
          <p className="text-gray-400 mt-1">Manage your subscription and monitor usage</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="border-gray-600">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Current Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Monthly Requests</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{currentUsage.requests.toLocaleString()}</div>
            <p className="text-xs text-gray-400 mb-2">
              of {currentUsage.requestLimit.toLocaleString()} limit
            </p>
            <Progress value={(currentUsage.requests / currentUsage.requestLimit) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card className="glass-card border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${currentUsage.cost}</div>
            <p className="text-xs text-gray-400 mb-2">
              of ${currentUsage.costLimit} budget
            </p>
            <Progress value={(currentUsage.cost / currentUsage.costLimit) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card className="glass-card border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Monthly Tokens</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{(currentUsage.tokens / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-400 mb-2">
              of {(currentUsage.tokenLimit / 1000000).toFixed(1)}M limit
            </p>
            <Progress value={(currentUsage.tokens / currentUsage.tokenLimit) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Current Billing Cycle */}
      {billingData?.currentCycle && (
        <Card className="glass-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Current Billing Cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-400 text-sm">Billing Period</p>
                <p className="text-white font-medium">
                  {new Date(billingData.currentCycle.cycle_start).toLocaleDateString()} - {new Date(billingData.currentCycle.cycle_end).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Usage Cost</p>
                <p className="text-white font-medium">${billingData.currentCycle.usage_cost}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Subscription</p>
                <p className="text-white font-medium">${billingData.currentCycle.subscription_cost}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Amount</p>
                <p className="text-white font-medium text-lg">${billingData.currentCycle.total_amount}</p>
              </div>
            </div>

            {billingData.currentCycle.billing_line_items && billingData.currentCycle.billing_line_items.length > 0 && (
              <div className="mt-6">
                <h4 className="text-white font-medium mb-4">Line Items</h4>
                <div className="space-y-2">
                  {billingData.currentCycle.billing_line_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded">
                      <div>
                        <p className="text-white">{item.description}</p>
                        <p className="text-gray-400 text-sm">{item.quantity} {item.unit_type}</p>
                      </div>
                      <p className="text-white font-medium">${item.total_amount}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Methods */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          {billingData?.paymentMethods?.length ? (
            <div className="space-y-4">
              {billingData.paymentMethods.map((method: any) => (
                <div key={method.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">
                        {method.brand?.toUpperCase()} •••• {method.last_four}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Expires {method.expiry_month}/{method.expiry_year}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.is_default && (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        Default
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No payment methods added</p>
              <Button>Add Payment Method</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card className="glass-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          {billingData?.invoiceHistory?.length ? (
            <div className="space-y-4">
              {billingData.invoiceHistory.map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(invoice.status)}
                    <div>
                      <p className="text-white font-medium">
                        Invoice #{invoice.invoice_number || `INV-${invoice.id.slice(0, 8)}`}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(invoice.cycle_start).toLocaleDateString()} - {new Date(invoice.cycle_end).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-white font-medium">${invoice.total_amount}</p>
                      <p className="text-gray-400 text-sm">
                        {invoice.paid_at ? `Paid ${new Date(invoice.paid_at).toLocaleDateString()}` : 
                         invoice.due_date ? `Due ${new Date(invoice.due_date).toLocaleDateString()}` : ''}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No invoices found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
