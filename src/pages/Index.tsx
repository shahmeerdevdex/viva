import React, { useState, useEffect } from 'react';
import { Upload, Camera, User, FileText, BarChart3, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUpload from '@/components/ImageUpload';
import ClinicalQuestionnaire from '@/components/ClinicalQuestionnaire';
import AssessmentResults from '@/components/AssessmentResults';
import { analyzeFaceWithAI } from '@/services/faceAnalysis';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentStep, setCurrentStep] = useState('upload'); // Start directly at upload
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [questionnaireData, setQuestionnaireData] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = async (data: any) => {
    setQuestionnaireData(data);
    setIsAnalyzing(true);
    
    try {
      toast({
        title: "Starting Analysis",
        description: "Your facial image is being analysed by our algorithms...",
      });

      const analysisResult = await analyzeFaceWithAI({
        imageUrl: uploadedImage!,
        questionnaireData: data
      });

      setAssessmentData(analysisResult);
      setCurrentStep('results');
      
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Only show when on upload step */}
      {currentStep === 'upload' && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="text-center space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Upload A Photo & Begin Your Anti-Aging Journey
              </h1>
              
              {/* Purple Badge */}
              <div className="flex justify-center">
                <div className="inline-flex items-center px-4 py-2 bg-purple-100 rounded-full">
                  <span className="text-purple-700 text-sm sm:text-base font-medium">
                    150+ Data Points | Secure & Private
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentStep === 'upload' && (
          <div className="text-center space-y-10">
            <Card className="max-w-4xl mx-auto">
              <CardContent className="space-y-10 pt-10">
                <ImageUpload onImageUpload={handleImageUpload} />
                
                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-8 flex items-center justify-center space-x-6">
                  <div className="text-3xl">
                    🔒
                  </div>
                  <span className="text-green-800 text-xl font-medium">
                    Your photo is processed securely and never stored
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'questionnaire' && (
          <ClinicalQuestionnaire 
            onComplete={handleQuestionnaireComplete}
            uploadedImage={uploadedImage}
            isAnalyzing={isAnalyzing}
          />
        )}

        {currentStep === 'results' && assessmentData && (
          <AssessmentResults 
            data={assessmentData}
            image={uploadedImage}
            questionnaireData={questionnaireData}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
