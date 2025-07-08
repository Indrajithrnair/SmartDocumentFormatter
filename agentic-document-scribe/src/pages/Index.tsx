import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentUpload } from '@/components/DocumentUpload';
import { GoalSetting } from '@/components/GoalSetting';
import { ProcessingDisplay } from '@/components/ProcessingDisplay';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { Dashboard } from '@/components/Dashboard';
import { FileText, Brain, Zap, Download } from 'lucide-react';
import axios from 'axios';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'goal' | 'processing' | 'results' | 'dashboard'>('dashboard');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formattingGoal, setFormattingGoal] = useState<string>('');
  const [processingJobId, setProcessingJobId] = useState<string>('');

  const handleFileUpload = (files: File[], jobId?: string) => {
    setUploadedFiles(files);
    if (jobId) {
      setProcessingJobId(jobId);
    }
    setCurrentStep('goal');
  };

  const handleGoalSet = async (goal: string) => {
    setFormattingGoal(goal);
    setCurrentStep('processing');
    // Start processing with backend API
    if (processingJobId) {
      try {
        await axios.post(`http://127.0.0.1:8000/api/documents/process/${processingJobId}`, {
          user_goal: goal
        });
        // Optionally, you can handle response or set state here
      } catch (error) {
        // Handle error (show message, etc.)
        console.error('Error starting processing:', error);
      }
    }
  };

  const handleBackToDashboard = () => {
    setCurrentStep('dashboard');
    setUploadedFiles([]);
    setFormattingGoal('');
    setProcessingJobId('');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'upload':
        return <DocumentUpload onUpload={handleFileUpload} />;
      case 'goal':
        return (
          <GoalSetting
            onGoalSet={handleGoalSet}
            uploadedFiles={uploadedFiles}
            onBack={() => setCurrentStep('upload')}
          />
        );
      case 'processing':
        return (
          <ProcessingDisplay
            jobId={processingJobId}
            onComplete={() => setCurrentStep('results')}
          />
        );
      case 'results':
        return (
          <ResultsDisplay
            jobId={processingJobId}
            onNewDocument={() => setCurrentStep('upload')}
            onBackToDashboard={handleBackToDashboard}
          />
        );
      default:
        return (
          <Dashboard
            onNewDocument={() => setCurrentStep('upload')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">DocFormat AI</h1>
                <p className="text-sm text-gray-500">Intelligent Document Formatting</p>
              </div>
            </div>
            
            {currentStep !== 'dashboard' && (
              <Button
                variant="outline"
                onClick={handleBackToDashboard}
                className="flex items-center space-x-2"
              >
                <span>Dashboard</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'dashboard' && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Transform Your Documents with AI
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Our intelligent agent analyzes your documents and applies professional formatting 
                based on your specific goals and requirements.
              </p>
              
              {/* Feature Cards */}
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card className="text-center">
                  <CardHeader>
                    <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle>Smart Upload</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Drag and drop your documents. We support Word, PDF, and text files.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardHeader>
                    <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle>AI Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Watch our AI agent work in real-time, analyzing and formatting your document.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="text-center">
                  <CardHeader>
                    <Download className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle>Perfect Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Download your professionally formatted document with detailed change summaries.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {/* Current Step Content */}
        {renderCurrentStep()}
      </main>
    </div>
  );
};

export default Index;
