import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, CheckCircle, Clock, Zap, FileText, Eye } from 'lucide-react';

interface ProcessingDisplayProps {
  jobId: string;
  onComplete: () => void;
}

interface ProcessingStep {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  details?: string;
  timestamp?: Date;
}

export const ProcessingDisplay: React.FC<ProcessingDisplayProps> = ({
  jobId,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [agentReasoning, setAgentReasoning] = useState('');
  const [processSteps, setProcessSteps] = useState<ProcessingStep[]>([
    { name: 'Document Analysis', status: 'processing', details: 'Analyzing document structure and content' },
    { name: 'Goal Understanding', status: 'pending', details: 'Processing formatting requirements' },
    { name: 'AI Formatting', status: 'pending', details: 'Applying intelligent formatting rules' },
    { name: 'Quality Validation', status: 'pending', details: 'Validating formatting consistency' },
    { name: 'Final Processing', status: 'pending', details: 'Generating formatted document' }
  ]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Poll backend for job status
    const pollStatus = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/documents/${jobId}/status`);
        const status = response.data.status;
        // You may want to adjust this logic based on your backend's status values
        if (status === 'completed') {
          setProgress(100);
          setProcessSteps(prevSteps => prevSteps.map((step, idx) => ({ ...step, status: 'completed' })));
          setAgentReasoning('Formatting complete!');
          if (intervalId) clearInterval(intervalId);
          setTimeout(() => onComplete(), 1000);
        } else if (status === 'processing') {
          setProgress(50);
          setAgentReasoning('AI agent is formatting your document...');
        } else if (status === 'analyzing') {
          setProgress(20);
          setAgentReasoning('Analyzing document structure and identifying formatting inconsistencies...');
        } else if (status === 'error') {
          setAgentReasoning('An error occurred during processing.');
          if (intervalId) clearInterval(intervalId);
        }
      } catch (error) {
        setAgentReasoning('Error contacting backend for status.');
      }
    };
    const id = setInterval(pollStatus, 1500);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [jobId, onComplete]);

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Zap className="w-5 h-5 text-blue-600 animate-pulse" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">AI Agent Processing</h2>
        <p className="text-gray-600">Watch our AI agent format your document in real-time</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Processing Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Processing Steps</span>
            </CardTitle>
            <CardDescription>Current progress: {Math.round(progress)}%</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} className="w-full" />
            
            <div className="space-y-3">
              {processSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  {getStepIcon(step.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{step.name}</h4>
                      <Badge variant={
                        step.status === 'completed' ? 'default' :
                        step.status === 'processing' ? 'secondary' : 'outline'
                      }>
                        {step.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Reasoning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="w-5 h-5" />
              <span>Agent Reasoning</span>
            </CardTitle>
            <CardDescription>Live updates from the AI formatting agent</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg min-h-[200px]">
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {agentReasoning || 'Initializing AI agent...'}
                  </p>
                  {progress < 100 && (
                    <div className="flex items-center space-x-1 mt-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Information */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Job ID: {jobId}</span>
            <span>Estimated time remaining: {Math.max(0, Math.round((100 - progress) / 10))} seconds</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
