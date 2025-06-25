
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JupiterBrainsLogo from '@/components/JupiterBrainsLogo';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm animate-fade-in">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="animate-slide-in-left">
            <JupiterBrainsLogo size="lg" variant="color" />
          </div>
          <div className="flex items-center space-x-4 animate-slide-in-right">
            <Link to="/auth">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-200">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all duration-200">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="flex justify-center mb-8 animate-scale-in">
            <JupiterBrainsLogo size="xl" variant="color" showText={false} />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-up animation-delay-200">
            Professional AI Analytics Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-400">
            Track, analyze, and optimize your AI usage with enterprise-grade analytics, 
            real-time monitoring, and comprehensive billing management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-600">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 hover:scale-105 transition-all duration-200">
                Get Started Today
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 text-lg px-8 py-3 hover:scale-105 transition-all duration-200">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage AI usage
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From real-time monitoring to detailed analytics and automated billing, 
              we provide the complete solution for AI usage management.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animation-delay-200">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <CardTitle className="text-gray-900">Real-time Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monitor your AI usage in real-time with detailed metrics, 
                  response times, and success rates across all your models.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animation-delay-400">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <CardTitle className="text-gray-900">Cost Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track costs across all AI models with detailed billing, 
                  automated invoicing, and budget alerts to control spending.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animation-delay-600">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <CardTitle className="text-gray-900">Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Enterprise-grade security with API key management, 
                  rate limiting, audit logs, and compliance reporting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 animate-fade-in-up">
            Trusted by leading companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="animate-fade-in-up animation-delay-200 hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-blue-600 mb-2 animate-counter">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div className="animate-fade-in-up animation-delay-400 hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-green-600 mb-2 animate-counter">500K+</div>
              <div className="text-gray-600">API Calls/Day</div>
            </div>
            <div className="animate-fade-in-up animation-delay-600 hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-purple-600 mb-2 animate-counter">1000+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="animate-fade-in-up animation-delay-800 hover:scale-105 transition-transform duration-200">
              <div className="text-3xl font-bold text-orange-600 mb-2 animate-counter">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 animate-fade-in-up">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in-up animation-delay-200">
            Ready to optimize your AI usage?
          </h2>
          <p className="text-blue-100 mb-8 text-lg animate-fade-in-up animation-delay-400">
            Join thousands of companies using JupiterBrains to track and optimize their AI investments.
          </p>
          <div className="animate-fade-in-up animation-delay-600">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 hover:scale-105 transition-all duration-200">
                Start Using JupiterBrains
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 animate-fade-in">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-fade-in-up animation-delay-200">
              <JupiterBrainsLogo size="md" variant="light" className="mb-4" />
              <p className="text-gray-400">
                Professional AI analytics and usage tracking for modern businesses.
              </p>
            </div>
            <div className="animate-fade-in-up animation-delay-400">
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Analytics</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Billing</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">API Management</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Security</Link></li>
              </ul>
            </div>
            <div className="animate-fade-in-up animation-delay-600">
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#" className="hover:text-white transition-colors duration-200">About</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Blog</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Careers</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Contact</Link></li>
              </ul>
            </div>
            <div className="animate-fade-in-up animation-delay-800">
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Documentation</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Help Center</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Status</Link></li>
                <li><Link to="#" className="hover:text-white transition-colors duration-200">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 animate-fade-in-up animation-delay-1000">
            <p>&copy; 2024 JupiterBrains. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
