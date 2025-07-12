
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Loader2, Brain, ArrowRight } from 'lucide-react';

interface ClinicalQuestionnaireProps {
  onComplete: (data: any) => void;
  uploadedImage: string | null;
  isAnalyzing?: boolean;
}

const ClinicalQuestionnaire: React.FC<ClinicalQuestionnaireProps> = ({ onComplete, uploadedImage, isAnalyzing = false }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState({
    age: '',
    sleepQuality: '',
    stressLevel: '',
    periodStatus: '',
    skincareRoutine: []
  });

  const questions = [
    {
      id: 'age',
      title: 'What is your age?',
      type: 'input',
      required: true
    },
    {
      id: 'sleepQuality',
      title: 'How would you describe your sleep quality?',
      type: 'radio',
      required: true,
      options: [
        { value: 'excellent', label: 'Excellent (7-9 hours, restful)' },
        { value: 'good', label: 'Good (6-7 hours, mostly restful)' },
        { value: 'fair', label: 'Fair (5-6 hours, some disruption)' },
        { value: 'poor', label: 'Poor (less than 5 hours, frequent disruption)' }
      ]
    },
    {
      id: 'stressLevel',
      title: 'What is your current stress level?',
      type: 'radio',
      required: true,
      options: [
        { value: 'low', label: 'Low - Well-managed, minimal impact' },
        { value: 'moderate', label: 'Moderate - Occasional stress, manageable' },
        { value: 'high', label: 'High - Chronic stress, affects daily life' }
      ]
    },
    {
      id: 'periodStatus',
      title: 'What is your current period status?',
      type: 'radio',
      required: true,
      options: [
        { value: 'regular', label: 'Regular periods' },
        { value: 'irregular', label: 'Irregular periods' },
        { value: 'stopped', label: 'Periods have stopped (12+ months)' },
        { value: 'hrt', label: 'On hormone replacement therapy' }
      ]
    },
    {
      id: 'skincareRoutine',
      title: 'Which of these are you currently using for anti-aging?',
      type: 'checkbox',
      required: false,
      options: [
        'Retinol or prescription retinoids',
        'Vitamin C or antioxidant serums',
        'Peptide treatments',
        'Hormone-supporting ingredients'
      ]
    }
  ];

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleInputChange = (field: string, value: any) => {
    console.log('handleInputChange called:', field, value);
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkincareChange = (item: string, checked: boolean) => {
    console.log('handleSkincareChange called:', item, checked);
    setFormData(prev => ({
      ...prev,
      skincareRoutine: checked 
        ? [...prev.skincareRoutine, item]
        : prev.skincareRoutine.filter(i => i !== item)
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      onComplete(formData);
    }
  };

  const isCurrentQuestionComplete = () => {
    const question = questions[currentQuestion];
    if (!question.required) return true;
    
    const value = formData[question.id as keyof typeof formData];
    if (question.type === 'input') {
      return value && value.toString().trim() !== '';
    }
    return value !== '' && value !== undefined;
  };

  if (isAnalyzing) {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="py-8 sm:py-12">
            <div className="text-center space-y-4 sm:space-y-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2">Analysis in Progress</h3>
                <p className="text-blue-700 mb-4 text-sm sm:text-base">
                  Analysing by our algorithms using clinical dermatology protocols...
                </p>
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span className="text-xs sm:text-sm">This may take 30-60 seconds</span>
                </div>
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <Progress value={65} className="h-2" />
                <p className="text-xs text-blue-600">Analyzing facial structure, volume, and aging patterns...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-3 py-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-semibold text-indigo-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mb-6">
          {/* Question Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
              {currentQ.title}
            </h1>
          </div>

          {/* Question Content */}
          <div className="p-6">
            {/* Age Input */}
            {currentQ.type === 'input' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full max-w-xs">
                  <Input
                    type="number"
                    min="18"
                    max="100"
                    placeholder="Enter your age"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="text-center text-xl font-semibold h-14 border-2 border-indigo-200 focus:border-indigo-500 rounded-xl bg-gradient-to-br from-white to-indigo-50"
                  />
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Please enter your current age
                </p>
              </div>
            )}

            {/* Radio Questions */}
            {currentQ.type === 'radio' && (
              <div className="space-y-3">
                <RadioGroup 
                  value={formData[currentQ.id as keyof typeof formData] as string}
                  onValueChange={(value) => handleInputChange(currentQ.id, value)}
                >
                  {currentQ.options?.map((option, index) => (
                    <div 
                      key={index} 
                      className="relative rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 transition-all duration-300"
                    >
                      <Label 
                        htmlFor={`${currentQ.id}-${index}`} 
                        className="flex items-center space-x-4 p-4 cursor-pointer w-full"
                      >
                        <RadioGroupItem 
                          value={option.value} 
                          id={`${currentQ.id}-${index}`}
                          className="text-indigo-600 border-2 border-gray-300 hover:border-indigo-500 flex-shrink-0"
                        />
                        <span className="flex-1 text-sm sm:text-base font-medium text-gray-700 hover:text-indigo-700 leading-relaxed">
                          {option.label}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Checkbox Question */}
            {currentQ.type === 'checkbox' && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 text-center mb-4">
                  Select all that apply (optional)
                </p>
                {currentQ.options?.map((item, index) => (
                  <div 
                    key={index} 
                    className="relative rounded-xl border-2 border-gray-200 bg-gradient-to-br from-white to-gray-50 hover:from-green-50 hover:to-emerald-50 hover:border-green-300 transition-all duration-300"
                  >
                    <Label 
                      htmlFor={`skincare-${index}`} 
                      className="flex items-center space-x-4 p-4 cursor-pointer w-full"
                    >
                      <Checkbox 
                        id={`skincare-${index}`}
                        checked={formData.skincareRoutine.includes(item as string)}
                        onCheckedChange={(checked) => handleSkincareChange(item as string, checked as boolean)}
                        className="border-2 border-gray-300 hover:border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 flex-shrink-0"
                      />
                      <span className="flex-1 text-sm sm:text-base font-medium text-gray-700 hover:text-green-700 leading-relaxed">
                        {item}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="space-y-6">
          {/* Progress Dots */}
          <div className="flex justify-center space-x-3">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentQuestion 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 scale-125' 
                    : index < currentQuestion 
                      ? 'bg-green-500 scale-110' 
                      : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          {/* Next Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={!isCurrentQuestionComplete()}
              className="w-full max-w-xs h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {currentQuestion === questions.length - 1 ? (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Get my plans
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalQuestionnaire;
