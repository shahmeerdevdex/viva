
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Brain, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReversalProtocol = () => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const handleGetProtocol = () => {
    setIsAnalyzing(true);
    
    // Show analyzing animation for 3 seconds, then redirect
    setTimeout(() => {
      // Replace this URL with your actual GoHighLevel page URL
      window.location.href = 'https://your-gohighlevel-page.com';
    }, 3000);
  };

  if (!assessmentData) {
    return <div>Loading...</div>;
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Brain className="w-8 h-8 text-purple-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Creating Your Protocol
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Our AI is analyzing your assessment data and generating your personalized reversal protocol...
            </p>
            <div className="flex items-center justify-center space-x-2 text-purple-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Processing your results</span>
            </div>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
              Get Your Personalised Plan Made Now
            </h1>
          </div>
        </div>
      </div>

      {/* Main content that fills the screen above the button */}
      <div className="flex-1 flex items-center justify-center pb-24">
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
          {/* Main content section with proper sizing */}
          <div className="bg-white rounded-lg p-6 sm:p-8 md:p-10 text-center shadow-sm border">
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Based on your results, we've developed your doctor-led plan for your best glow up and new you
            </p>
            
            {/* Larger Doctor Image */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-3 border-gray-200 shadow-lg">
                <img 
                  src="/lovable-uploads/1536e247-daf4-4f1d-890e-a33ba62983f7.png" 
                  alt="Professional Female Doctor" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Larger Features List */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 sm:p-6 md:p-7 mb-8 sm:mb-12 max-w-md mx-auto">
              <div className="space-y-3 sm:space-y-4 text-left">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-amber-900 text-sm sm:text-base md:text-lg">Your assessment data is analyzed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-amber-900 text-sm sm:text-base md:text-lg">Custom protocol is generated</span>
                </div>
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-amber-900 text-sm sm:text-base md:text-lg">Personalized recommendations created</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-200">
        <div className="max-w-sm mx-auto">
          <button 
            onClick={handleGetProtocol}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg"
          >
            Get My Reversal Protocol
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReversalProtocol;
