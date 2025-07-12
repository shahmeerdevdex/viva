
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, Shield } from 'lucide-react';

const ViviaTransformation = () => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<any>(null);

  useEffect(() => {
    // Get data from sessionStorage
    const storedAssessmentData = sessionStorage.getItem('assessmentData');

    if (storedAssessmentData) {
      setAssessmentData(JSON.parse(storedAssessmentData));
    }

    // Redirect if no data available
    if (!storedAssessmentData) {
      navigate('/');
    }
  }, [navigate]);

  if (!assessmentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          
          {/* Header - Mobile Optimized */}
          <div className="text-center space-y-4 sm:space-y-6 px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
              Join over 3000 women in reversing aging
            </h1>
          </div>

          {/* Before and After Images */}
          <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="relative">
              <img 
                src="/lovable-uploads/8b89e124-a972-47d5-8789-142b1665bd09.png" 
                alt="Before transformation" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white px-3 py-1 rounded-md">
                <span className="font-medium text-sm">Before</span>
              </div>
            </div>
            <div className="relative">
              
              <img 
                src="/lovable-uploads/22bc5aef-ef99-443c-9230-25fabc0ca476.png" 
                alt="After transformation" 
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-75 text-white px-3 py-1 rounded-md">
                <span className="font-medium text-sm">After</span>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="bg-gray-50 rounded-lg p-6 text-center max-w-3xl mx-auto">
            <blockquote className="text-lg sm:text-xl text-gray-900 font-medium mb-4">
              "I couldn't believe the difference in just 6 weeks. My skin looks years younger and I actually get compliments now!"
            </blockquote>
            <cite className="text-gray-600 font-medium">Sarah M., Age 43</cite>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-gray-900 font-medium">Dermatologist reviewed</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-gray-900 font-medium">Most see results in 6-8 weeks</p>
            </div>
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-gray-900 font-medium">90-day guarantee</p>
            </div>
          </div>

          {/* Statistics */}
          <div className="text-center text-gray-600 text-base sm:text-lg">
            12,247 Success Stories | 4.8 Stars | 94% See Results
          </div>
          
        </div>
      </div>

      {/* Fixed button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200">
        <div className="max-w-sm mx-auto">
          <button 
            onClick={() => navigate('/reversal-protocol')}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
          >
            Start My Transformation Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViviaTransformation;
