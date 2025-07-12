
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Results = () => {
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

  const handleContinue = () => {
    navigate('/primary-assessment');
  };

  if (!assessmentData) {
    return <div>Loading...</div>;
  }

  // Calculate metrics for the overview section from the actual data
  const overviewMetrics = [
    {
      name: "Volume",
      score: assessmentData.assessment_overview?.volume?.score || 6.5,
      color: assessmentData.assessment_overview?.volume?.score >= 8 ? 'bg-green-500' : assessmentData.assessment_overview?.volume?.score >= 6 ? 'bg-orange-500' : 'bg-red-500'
    },
    {
      name: "Elasticity", 
      score: assessmentData.assessment_overview?.elasticity?.score || 7.2,
      color: assessmentData.assessment_overview?.elasticity?.score >= 8 ? 'bg-green-500' : assessmentData.assessment_overview?.elasticity?.score >= 6 ? 'bg-orange-500' : 'bg-red-500'
    },
    {
      name: "Texture",
      score: assessmentData.assessment_overview?.texture?.score || 7.8,
      color: assessmentData.assessment_overview?.texture?.score >= 8 ? 'bg-green-500' : assessmentData.assessment_overview?.texture?.score >= 6 ? 'bg-orange-500' : 'bg-red-500'
    },
    {
      name: "Complexion",
      score: assessmentData.assessment_overview?.complexion?.score || 8.3,
      color: assessmentData.assessment_overview?.complexion?.score >= 8 ? 'bg-green-500' : assessmentData.assessment_overview?.complexion?.score >= 6 ? 'bg-orange-500' : 'bg-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Main Content - Mobile Optimized */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
          
          {/* Header Section - Mobile Optimized */}
          <div className="text-center space-y-3 sm:space-y-4 px-2">
            {/* Eyebrow text */}
            <div className="inline-flex items-center justify-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm sm:text-base font-medium">
              Assessment Complete
            </div>
            
            {/* Main headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
              Your Skin Shows Signs Of A Strong Fit With Treatment
            </h1>
            
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Skin Age: <span className="text-blue-500">{assessmentData.assessed_skin_age || 44}</span>
              </h2>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                Chronological Age: <span className="text-blue-500">{assessmentData.chronological_age || 36}</span>
              </h3>
            </div>
          </div>

          {/* Metrics Overview - Mobile Optimized */}
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <div className="space-y-4 sm:space-y-6">
              {overviewMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-base sm:text-lg font-medium text-gray-700 w-20 sm:w-24">{metric.name}</span>
                  <div className="flex-1 mx-4 sm:mx-6">
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                      <div 
                        className={`h-2 sm:h-3 rounded-full ${metric.color}`}
                        style={{ width: `${(metric.score / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-base sm:text-lg font-bold text-gray-900 w-10 sm:w-12 text-right">
                    {metric.score}/10
                  </span>
                </div>
              ))}
            </div>
            
            {/* Good news message - Mobile Optimized */}
            <div className="mt-4 sm:mt-6 p-4 sm:p-5 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold text-base sm:text-lg text-center leading-relaxed">
                Perfect timing - your skin age gap shows maximum reversal potential
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleContinue}
            className="w-full py-4 bg-purple-800 text-white rounded-2xl text-lg font-semibold hover:bg-purple-900 transition-colors shadow-lg"
          >
            See My Transformation Potential
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;
