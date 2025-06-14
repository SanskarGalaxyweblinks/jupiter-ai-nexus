
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  User, 
  Building, 
  Key, 
  Bell, 
  Shield,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAPIUsage } from '@/hooks/useDashboardData';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings = () => {
  const [showApiKeys, setShowApiKeys] = useState(false);
  const [notifications, setNotifications] = useState({
    emailUsage: true,
    emailBilling: true,
    pushUsage: false,
    pushBilling: true
  });

  const { data } = useAPIUsage();
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your profile settings have been updated successfully.",
    });
  };

  const handleCreateApiKey = () => {
    toast({
      title: "API Key created",
      description: "New API key has been generated. Make sure to copy it now.",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input 
                    id="firstName" 
                    defaultValue="John"
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input 
                    id="lastName" 
                    defaultValue="Doe"
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  defaultValue="john@acme.com"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="jobTitle" className="text-white">Job Title</Label>
                <Input 
                  id="jobTitle" 
                  defaultValue="CTO"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="department" className="text-white">Department</Label>
                <Input 
                  id="department" 
                  defaultValue="Engineering"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Organization Settings */}
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Organization Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="orgName" className="text-white">Organization Name</Label>
                <Input 
                  id="orgName" 
                  defaultValue="Acme Corporation"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="billingEmail" className="text-white">Billing Email</Label>
                <Input 
                  id="billingEmail" 
                  type="email"
                  defaultValue="billing@acme.com"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry" className="text-white">Industry</Label>
                  <Input 
                    id="industry" 
                    defaultValue="Technology"
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="companySize" className="text-white">Company Size</Label>
                  <Input 
                    id="companySize" 
                    defaultValue="Medium (50-200)"
                    className="bg-gray-800/50 border-gray-600 text-white"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="monthlyBudget" className="text-white">Monthly Budget ($)</Label>
                <Input 
                  id="monthlyBudget" 
                  type="number"
                  defaultValue="500"
                  className="bg-gray-800/50 border-gray-600 text-white"
                />
              </div>
              
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Update Organization
              </Button>
            </CardContent>
          </Card>

          {/* API Keys Management */}
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  API Keys
                </div>
                <Button onClick={handleCreateApiKey} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Key
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.apiKeys?.length ? (
                  data.apiKeys.map((key: any) => (
                    <div key={key.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{key.name || 'Unnamed Key'}</p>
                        <p className="text-sm text-gray-400">
                          {key.environment} • Created {new Date(key.created_at).toLocaleDateString()}
                        </p>
                        <code className="text-xs bg-gray-900 px-2 py-1 rounded mt-1 block w-fit">
                          {showApiKeys ? `${key.key_prefix}${'*'.repeat(32)}` : `${key.key_prefix}${'*'.repeat(8)}`}
                        </code>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={key.is_active ? 'border-green-500/20 text-green-400' : 'border-red-500/20 text-red-400'}>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowApiKeys(!showApiKeys)}
                        >
                          {showApiKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Key className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No API keys created yet</p>
                    <Button onClick={handleCreateApiKey}>Create Your First API Key</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Plan</span>
                  <Badge className="bg-blue-600 text-white">Professional</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Role</span>
                  <Badge variant="outline" className="border-green-500/20 text-green-400">Admin</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Status</span>
                  <Badge variant="outline" className="border-green-500/20 text-green-400">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Member Since</span>
                  <span className="text-white">Jan 2024</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card className="glass-card border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Usage Alerts (Email)</p>
                    <p className="text-sm text-gray-400">Get notified about usage limits</p>
                  </div>
                  <Switch 
                    checked={notifications.emailUsage}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailUsage: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Billing Alerts (Email)</p>
                    <p className="text-sm text-gray-400">Get notified about billing events</p>
                  </div>
                  <Switch 
                    checked={notifications.emailBilling}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailBilling: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Usage Alerts (Push)</p>
                    <p className="text-sm text-gray-400">Push notifications for usage</p>
                  </div>
                  <Switch 
                    checked={notifications.pushUsage}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushUsage: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white">Billing Alerts (Push)</p>
                    <p className="text-sm text-gray-400">Push notifications for billing</p>
                  </div>
                  <Switch 
                    checked={notifications.pushBilling}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushBilling: checked }))}
                  />
                </div>
              </div>
              
              <Button onClick={handleSave} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
