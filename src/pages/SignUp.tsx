
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import JupiterBackground from '@/components/JupiterBackground';

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    companyName: '',
    industry: '',
    plan: 'starter'
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just redirect to dashboard
    window.location.href = '/dashboard';
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative flex">
      <JupiterBackground />
      
      {/* Left side - Progress & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center items-center p-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-6">
            Jupiter<span className="text-blue-400">Brains</span>
          </h1>
          <p className="text-xl text-gray-300">
            Join thousands of companies using AI analytics
          </p>
        </div>
        
        {/* Progress Indicator */}
        <div className="glass-card rounded-2xl p-6 w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= i ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'
                }`}>
                  {i}
                </div>
                {i < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step > i ? 'bg-blue-600' : 'bg-gray-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-gray-300">
            <div className="font-semibold text-white">
              {step === 1 && "Personal Information"}
              {step === 2 && "Company Details"}
              {step === 3 && "Choose Your Plan"}
            </div>
            <div className="text-sm">Step {step} of 3</div>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-8">
        <Card className="glass-card border-0 w-full max-w-md">
          <CardHeader className="text-center">
            <div className="lg:hidden mb-4">
              <h1 className="text-3xl font-bold text-white">
                Jupiter<span className="text-blue-400">Brains</span>
              </h1>
            </div>
            <CardTitle className="text-2xl text-white">Create Account</CardTitle>
            <p className="text-gray-300">Get started with your free trial</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-white">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-white">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Acme Corp"
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-white">Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => updateFormData('industry', value)}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="space-y-4">
                    {['starter', 'professional', 'enterprise'].map((plan) => (
                      <div key={plan} className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        formData.plan === plan 
                          ? 'border-blue-400 bg-blue-400/10' 
                          : 'border-gray-600 hover:border-gray-500'
                      }`} onClick={() => updateFormData('plan', plan)}>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white capitalize">{plan}</div>
                            <div className="text-sm text-gray-300">
                              {plan === 'starter' && '$99/month - Up to 100K API calls'}
                              {plan === 'professional' && '$499/month - Up to 1M API calls'}
                              {plan === 'enterprise' && 'Custom pricing - Unlimited calls'}
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            formData.plan === plan ? 'border-blue-400 bg-blue-400' : 'border-gray-600'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack} className="border-gray-600 text-white hover:bg-gray-700">
                    Back
                  </Button>
                )}
                {step < 3 ? (
                  <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 ml-auto">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 ml-auto">
                    Create Account
                  </Button>
                )}
              </div>
            </form>

            {step === 1 && (
              <>
                <div className="relative mt-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800 text-gray-300">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                    Google
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-700">
                    GitHub
                  </Button>
                </div>
              </>
            )}

            <div className="text-center mt-6">
              <p className="text-gray-300">
                Already have an account?{' '}
                <Link to="/signin" className="text-blue-400 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
