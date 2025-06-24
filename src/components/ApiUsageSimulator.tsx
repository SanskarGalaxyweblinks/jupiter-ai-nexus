
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
  const [promptTokens, setPromptTokens] = useState('100');
  const [completionTokens, setCompletionTokens] = useState('50');
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

      // Calculate costs
      const promptTokensNum = parseInt(promptTokens) || 0;
      const completionTokensNum = parseInt(completionTokens) || 0;
      const inputCost = (promptTokensNum / 1000) * (model.input_cost_per_1k_tokens || 0);
      const outputCost = (completionTokensNum / 1000) * (model.output_cost_per_1k_tokens || 0);

      // Insert simulated API usage
      const { error } = await supabase
        .from('api_usage_logs')
        .insert({
          organization_id: org.id,
          user_id: user.id,
          model_id: selectedModel,
          request_id: `sim_${Date.now()}`,
          prompt_tokens: promptTokensNum,
          completion_tokens: completionTokensNum,
          input_cost: inputCost,
          output_cost: outputCost,
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-tokens">Prompt Tokens</Label>
            <Input
              id="prompt-tokens"
              type="number"
              value={promptTokens}
              onChange={(e) => setPromptTokens(e.target.value)}
              placeholder="100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="completion-tokens">Completion Tokens</Label>
            <Input
              id="completion-tokens"
              type="number"
              value={completionTokens}
              onChange={(e) => setCompletionTokens(e.target.value)}
              placeholder="50"
            />
          </div>
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
