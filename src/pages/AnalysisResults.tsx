
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AnalysisResults = () => {
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

  const handleGetSolution = () => {
    navigate('/vivia-transformation');
  };

  const factors = [
    {
      id: 'hormonal',
      name: 'Hormonal Decline',
      percentage: 78,
      color: 'bg-red-500',
      icon: '🧬'
    },
    {
      id: 'lifestyle',
      name: 'Lifestyle Factors',
      percentage: 65,
      color: 'bg-orange-500',
      icon: '⚡'
    },
    {
      id: 'collagen',
      name: 'Collagen Depletion',
      percentage: 55,
      color: 'bg-yellow-500',
      icon: '💊'
    }
  ];

  if (!assessmentData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-6">
          
          {/* Main Header - Mobile Optimized */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
              We will reverse 3 hidden causes of aging for fastest results
            </h1>
            <p className="text-base text-gray-600">
              Based on your assessment data
            </p>
          </div>

          {/* Progress Bars - More Spacious */}
          <div className="space-y-5 py-3">
            {factors.map((factor) => (
              <div key={factor.id} className="flex items-center gap-4">
                <div className="text-2xl">{factor.icon}</div>
                <div className="flex-1">
                  <div className="text-base font-medium text-gray-900 mb-2">
                    {factor.name}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 relative">
                    <div 
                      className={`h-3 rounded-full ${factor.color}`}
                      style={{ width: `${factor.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-base font-bold text-gray-900 ml-2 min-w-[45px]">
                  {factor.percentage}%
                </div>
              </div>
            ))}
          </div>

          {/* Success Message - More Prominent */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
              <p className="text-base text-green-800 font-medium leading-relaxed">
                Your protocol targets all 3 simultaneously for best results
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200">
        <div className="max-w-sm mx-auto">
          <button 
            onClick={handleGetSolution}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
          >
            Get My Personalized Solution
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
