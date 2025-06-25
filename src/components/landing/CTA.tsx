
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
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
  );
};

export default CTA;
