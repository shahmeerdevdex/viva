
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AssessmentResultsProps {
  data: any;
  image: string | null;
  questionnaireData: any;
}

const AssessmentResults: React.FC<AssessmentResultsProps> = ({ data, image, questionnaireData }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Store the data in sessionStorage and navigate immediately
    sessionStorage.setItem('assessmentData', JSON.stringify(data));
    sessionStorage.setItem('questionnaireData', JSON.stringify(questionnaireData));
    sessionStorage.setItem('uploadedImage', image || '');
    navigate('/results');
  }, [data, image, questionnaireData, navigate]);

  // Show loading while navigating
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Processing your results...</p>
      </div>
    </div>
  );
};

export default AssessmentResults;
