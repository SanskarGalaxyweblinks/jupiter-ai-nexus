
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAvailableModels } from '@/hooks/useDashboardData';
import { Loader2, Play } from 'lucide-react';

export const ApiUsageSimulator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: models } = useAvailableModels();
  const [selectedModel, setSelectedModel] = useState('');
  const [totalTokens, setTotalTokens] = useState('100');
  const [isSimulating, setIsSimulating] = useState(false);

  const simulateApiCall = async () => {
    if (!user || !selectedModel) {
      toast({
        title: 'Error',
        description: 'Please select a model and ensure you are logged in',
        variant: 'destructive'
      });
      return;
    }

    setIsSimulating(true);

    try {
      // Get demo organization
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', 'acme-corp')
        .single();

      if (!org) {
        throw new Error('Demo organization not found');
      }

      // Get selected model details
      const model = models?.find(m => m.id === selectedModel);
      if (!model) {
        throw new Error('Selected model not found');
      }

      // Calculate cost (simplified - using average cost per token)
      const tokensNum = parseInt(totalTokens) || 0;
      const avgCostPer1k = ((model.input_cost_per_1k_tokens || 0) + (model.output_cost_per_1k_tokens || 0)) / 2;
      const totalCost = (tokensNum / 1000) * avgCostPer1k;

      // Insert simulated API usage
      const { error } = await supabase
        .from('api_usage_logs')
        .insert({
          organization_id: org.id,
          user_id: user.id,
          model_id: selectedModel,
          total_tokens: tokensNum,
          total_cost: totalCost,
          response_time_ms: Math.floor(Math.random() * 2000) + 200,
          status: 'success'
        });

      if (error) throw error;

      toast({
        title: 'API Call Simulated',
        description: `Successfully simulated API call with ${model.name}`,
      });

    } catch (error) {
      console.error('Error simulating API call:', error);
      toast({
        title: 'Simulation Failed',
        description: 'Failed to simulate API call',
        variant: 'destructive'
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          API Usage Simulator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="model-select">AI Model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger id="model-select">
              <SelectValue placeholder="Select an AI model" />
            </SelectTrigger>
            <SelectContent>
              {models?.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name} ({model.provider})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="total-tokens">Total Tokens</Label>
          <Input
            id="total-tokens"
            type="number"
            value={totalTokens}
            onChange={(e) => setTotalTokens(e.target.value)}
            placeholder="100"
          />
        </div>

        <Button 
          onClick={simulateApiCall} 
          disabled={isSimulating || !selectedModel}
          className="w-full"
        >
          {isSimulating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Simulating...
            </>
          ) : (
            'Simulate API Call'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
