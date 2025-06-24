import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Download, 
  DollarSign, 
  TrendingUp,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BillingPage = () => {
  const { toast } = useToast();
  const [showAddPayment, setShowAddPayment] = useState(false);

  // Mock current usage data - in real app this would come from API
  const currentUsage = {
    requests: 8542,
    requestLimit: 10000,
    cost: 127.45,
    costLimit: 200,
    tokens: 1250000,
    tokenLimit: 2000000
  };

  // Mock billing data since we simplified the database
  const billingData = {
    currentCycle: {
      cycle_start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      cycle_end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString(),
      usage_cost: 127.45,
      subscription_cost: 29.00,
      total_amount: 156.45,
      billing_line_items: [
        {
          id: '1',
          description: 'AI API Usage',
          quantity: 8542,
          unit_type: 'requests',
          total_amount: 127.45
        },
        {
          id: '2',
          description: 'Pro Subscription',
          quantity: 1,
          unit_type: 'month',
          total_amount: 29.00
        }
      ]
    },
    paymentMethods: [
      {
        id: '1',
        brand: 'visa',
        last_four: '4242',
        expiry_month: 12,
        expiry_year: 2025,
        is_default: true
      }
    ],
    invoiceHistory: [
      {
        id: '1',
        invoice_number: 'INV-001',
        cycle_start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString(),
        cycle_end: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString(),
        total_amount: 142.30,
        status: 'paid',
        paid_at: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
      },
      {
        id: '2',
        invoice_number: 'INV-002',
        cycle_start: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1).toISOString(),
        cycle_end: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0).toISOString(),
        total_amount: 98.75,
        status: 'paid',
        paid_at: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 5).toISOString()
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'overdue':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
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

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock payment method addition
    toast({
      title: "Payment method added",
      description: "Your payment method has been successfully added.",
    });
    setShowAddPayment(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Usage & Billing</h1>
          <p className="text-gray-600 mt-1">Monitor your AI model usage and manage billing</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Current Usage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Requests</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{currentUsage.requests.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mb-2">
              of {currentUsage.requestLimit.toLocaleString()} limit
            </p>
            <Progress value={(currentUsage.requests / currentUsage.requestLimit) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${currentUsage.cost}</div>
            <p className="text-xs text-gray-600 mb-2">
              of ${currentUsage.costLimit} budget
            </p>
            <Progress value={(currentUsage.cost / currentUsage.costLimit) * 100} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Monthly Tokens</CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{(currentUsage.tokens / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-gray-600 mb-2">
              of {(currentUsage.tokenLimit / 1000000).toFixed(1)}M limit
            </p>
            <Progress value={(currentUsage.tokens / currentUsage.tokenLimit) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Current Billing Cycle */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Current Billing Cycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-gray-600 text-sm">Billing Period</p>
              <p className="text-gray-900 font-medium">
                {new Date(billingData.currentCycle.cycle_start).toLocaleDateString()} - {new Date(billingData.currentCycle.cycle_end).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Usage Cost</p>
              <p className="text-gray-900 font-medium">${billingData.currentCycle.usage_cost}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Subscription</p>
              <p className="text-gray-900 font-medium">${billingData.currentCycle.subscription_cost}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-gray-900 font-medium text-lg">${billingData.currentCycle.total_amount}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-gray-900 font-medium mb-4">Line Items</h4>
            <div className="space-y-2">
              {billingData.currentCycle.billing_line_items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="text-gray-900">{item.description}</p>
                    <p className="text-gray-600 text-sm">{item.quantity} {item.unit_type}</p>
                  </div>
                  <p className="text-gray-900 font-medium">${item.total_amount}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Methods
            </CardTitle>
            <Button onClick={() => setShowAddPayment(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Payment Method
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddPayment && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-gray-900 font-medium mb-4">Add New Payment Method</h4>
              <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cardNumber" className="text-gray-700">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="holderName" className="text-gray-700">Cardholder Name</Label>
                    <Input 
                      id="holderName" 
                      placeholder="John Doe" 
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry" className="text-gray-700">Expiry Date</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY" 
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvc" className="text-gray-700">CVC</Label>
                    <Input 
                      id="cvc" 
                      placeholder="123" 
                      className="bg-white border-gray-300"
                      required
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit">Add Payment Method</Button>
                  <Button type="button" variant="outline" onClick={() => setShowAddPayment(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {billingData?.paymentMethods?.length ? (
            <div className="space-y-4">
              {billingData.paymentMethods.map((method: any) => (
                <div key={method.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-8 h-8 text-gray-600" />
                    <div>
                      <p className="text-gray-900 font-medium">
                        {method.brand?.toUpperCase()} •••• {method.last_four}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Expires {method.expiry_month}/{method.expiry_year}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {method.is_default && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Default
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="text-gray-600">Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !showAddPayment && (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No payment methods added</p>
                <Button onClick={() => setShowAddPayment(true)}>Add Payment Method</Button>
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Invoice History */}
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          {billingData?.invoiceHistory?.length ? (
            <div className="space-y-4">
              {billingData.invoiceHistory.map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(invoice.status)}
                    <div>
                      <p className="text-gray-900 font-medium">
                        Invoice #{invoice.invoice_number || `INV-${invoice.id.slice(0, 8)}`}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {new Date(invoice.cycle_start).toLocaleDateString()} - {new Date(invoice.cycle_end).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Badge variant="outline" className={getStatusColor(invoice.status)}>
                      {invoice.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-gray-900 font-medium">${invoice.total_amount}</p>
                      <p className="text-gray-600 text-sm">
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
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No invoices found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
