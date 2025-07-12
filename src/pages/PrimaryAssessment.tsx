
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const PrimaryAssessment = () => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<string>('');

  useEffect(() => {
    // Get data from sessionStorage
    const storedAssessmentData = sessionStorage.getItem('assessmentData');
    const storedQuestionnaireData = sessionStorage.getItem('questionnaireData');
    const storedImage = sessionStorage.getItem('uploadedImage');

    if (storedAssessmentData) {
      setAssessmentData(JSON.parse(storedAssessmentData));
    }
    if (storedQuestionnaireData) {
      setQuestionnaireData(JSON.parse(storedQuestionnaireData));
    }
    if (storedImage) {
      setUploadedImage(storedImage);
    }

    // Redirect if no data available
    if (!storedAssessmentData) {
      navigate('/');
    }
  }, [navigate]);

  const handleGetReversalProtocol = () => {
    navigate('/analysis-results');
  };

  if (!assessmentData) {
    return <div>Loading...</div>;
  }

  // Generate transformation potential data
  const currentSkinAge = assessmentData.assessed_skin_age || 44;
  const chronologicalAge = assessmentData.chronological_age || 36;
  const targetAge = Math.max(chronologicalAge - 3, 25); // Target to go 3 years below chronological age

  const chartData = [
    { month: 0, age: currentSkinAge, label: 'Current' },
    { month: 1, age: currentSkinAge - 1, label: 'Month 1' },
    { month: 2, age: currentSkinAge - 3, label: 'Month 2' },
    { month: 3, age: currentSkinAge - 5, label: 'Month 3' },
    { month: 6, age: currentSkinAge - 8, label: 'Month 6' },
    { month: 9, age: targetAge, label: 'Month 9' },
    { month: 12, age: targetAge, label: 'Month 12' }
  ];

  const chartConfig = {
    age: {
      label: "Skin Age",
      color: "#8b5cf6",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">

          {/* Header - Mobile Optimized */}
          <div className="text-center space-y-2 sm:space-y-3 px-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Your Skin Age Transformation Journey
            </h1>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                Current Skin Age: <span className="text-blue-500">{currentSkinAge}</span>
              </h2>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                Target Skin Age: <span className="text-green-500">{targetAge}</span>
              </h3>
            </div>
          </div>

          {/* Transformation Graph - Compact */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="relative h-64 sm:h-80 w-full p-2">
              <ChartContainer config={chartConfig}>
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="month" 
                    tickFormatter={(value) => `Month ${value}`}
                    className="text-xs sm:text-sm"
                  />
                  <YAxis 
                    domain={[Math.min(targetAge - 2, 25), currentSkinAge + 2]}
                    tickFormatter={(value) => `${value} years`}
                    className="text-xs sm:text-sm"
                  />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value: any) => [`${value} years`, 'Skin Age']}
                    labelFormatter={(label) => `Month ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="age" 
                    stroke="#8b5cf6" 
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
                  />
                  {/* Add reference line for chronological age */}
                  <Line 
                    type="monotone" 
                    dataKey={() => chronologicalAge}
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    activeDot={false}
                  />
                </LineChart>
              </ChartContainer>
              
              {/* Green callout positioned at the inflection point - Mobile Responsive */}
              <div className="absolute top-16 sm:top-20 right-8 sm:right-16 bg-green-50 border border-green-200 rounded-lg px-2 sm:px-3 py-1 sm:py-2 shadow-md z-10">
                <span className="text-green-700 font-semibold text-xs sm:text-sm">Your Best Skin</span>
              </div>
            </div>

            <p className="text-gray-800 max-w-2xl mx-auto text-base sm:text-lg font-bold leading-relaxed px-4 pb-4 text-center -mt-6">
              With the right personalised plan you'll improve your skin age by {currentSkinAge - targetAge} years and look younger than you are!
            </p>
          </div>
        </div>
      </div>

      {/* Fixed button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleGetReversalProtocol}
            className="w-full py-4 bg-purple-800 text-white rounded-2xl text-lg font-semibold hover:bg-purple-900 transition-colors shadow-lg"
          >
            Get My Reversal Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrimaryAssessment;
