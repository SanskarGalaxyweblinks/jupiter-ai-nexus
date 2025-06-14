
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import JupiterBackground from '@/components/JupiterBackground';
import { BarChart3, Shield, Zap, Users, Clock, TrendingUp } from 'lucide-react';

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

const LandingPage = () => {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-blue-400" />,
      title: "Real-time Usage Tracking",
      description: "Track every API call and token usage with millisecond precision"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-blue-400" />,
      title: "Advanced Analytics",
      description: "Deep insights into model performance and usage patterns"
    },
    {
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      title: "Automated Billing",
      description: "Smart invoicing and payment processing with usage-based pricing"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: "Multi-tenant Support",
      description: "Manage multiple organizations and teams with role-based access"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-400" />,
      title: "Rate Limiting",
      description: "Control and monitor API usage limits with smart throttling"
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: "Enterprise Security",
      description: "SOC 2 compliant with comprehensive audit logs and encryption"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      features: [
        "Up to 100K API calls",
        "Basic analytics",
        "Email support",
        "Standard rate limiting"
      ]
    },
    {
      name: "Professional",
      price: "$499",
      period: "/month",
      features: [
        "Up to 1M API calls",
        "Advanced analytics",
        "Priority support",
        "Custom rate limiting",
        "Multi-tenant support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Unlimited API calls",
        "Custom analytics",
        "24/7 dedicated support",
        "On-premise deployment",
        "White-label solution"
      ]
    }
  ];

  return (
    <div className="min-h-screen relative">
      <JupiterBackground />
      
      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-white">
            Jupiter<span className="text-blue-400">Brains</span>
          </div>
          <div className="flex space-x-4">
            <Link to="/signin">
              <Button variant="ghost" className="text-white hover:text-blue-400">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center animate-fade-in">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Enterprise AI Model<br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Analytics & Billing
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Track, analyze, and monetize your AI model usage with real-time insights. 
            The most advanced platform for enterprise AI operations.
          </p>
          <div className="flex space-x-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                Get Started
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
              View Demo
            </Button>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 animate-slide-up">
          <div className="glass-card rounded-2xl p-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  <AnimatedCounter end={847} />K
                </div>
                <div className="text-gray-300">API Requests</div>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  <AnimatedCounter end={234} />ms
                </div>
                <div className="text-gray-300">Avg Response</div>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  99.<AnimatedCounter end={9} />%
                </div>
                <div className="text-gray-300">Uptime</div>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  $<AnimatedCounter end={12} />.<AnimatedCounter end={4} />K
                </div>
                <div className="text-gray-300">Revenue</div>
              </div>
            </div>
            <div className="glass rounded-lg p-6 h-64 flex items-center justify-center">
              <div className="text-gray-400 text-lg">Interactive Dashboard Preview</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything you need for AI operations
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive tools for monitoring, analyzing, and billing your AI model usage
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-0 hover:scale-105 transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <CardContent className="p-8 text-center">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="animate-counter">
            <div className="text-4xl font-bold text-blue-400 mb-2">
              <AnimatedCounter end={1000000} />+
            </div>
            <div className="text-gray-300">API Calls Tracked</div>
          </div>
          <div className="animate-counter">
            <div className="text-4xl font-bold text-green-400 mb-2">
              <AnimatedCounter end={500} />+
            </div>
            <div className="text-gray-300">Enterprise Clients</div>
          </div>
          <div className="animate-counter">
            <div className="text-4xl font-bold text-purple-400 mb-2">
              99.9%
            </div>
            <div className="text-gray-300">Uptime</div>
          </div>
          <div className="animate-counter">
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              $<AnimatedCounter end={10} />M+
            </div>
            <div className="text-gray-300">Revenue Processed</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose your plan
          </h2>
          <p className="text-xl text-gray-300">
            Flexible pricing for teams of all sizes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className={`glass-card border-0 relative ${plan.popular ? 'ring-2 ring-blue-400' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{plan.name}</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-300">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-gray-300 flex items-center">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">
                Jupiter<span className="text-blue-400">Brains</span>
              </div>
              <p className="text-gray-300">
                The most advanced platform for enterprise AI operations.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-blue-400">Features</a></li>
                <li><a href="#" className="hover:text-blue-400">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-blue-400">About</a></li>
                <li><a href="#" className="hover:text-blue-400">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-blue-400">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400">Contact</a></li>
                <li><a href="#" className="hover:text-blue-400">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 JupiterBrains. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
