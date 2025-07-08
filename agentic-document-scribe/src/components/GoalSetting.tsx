
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileText, ArrowLeft, Target } from 'lucide-react';

interface GoalSettingProps {
  onGoalSet: (goal: string) => void;
  uploadedFiles: File[];
  onBack: () => void;
}

export const GoalSetting: React.FC<GoalSettingProps> = ({
  onGoalSet,
  uploadedFiles,
  onBack
}) => {
  const [goal, setGoal] = useState('');
  const [priority, setPriority] = useState('professional');

  const presetGoals = [
    {
      value: 'professional',
      label: 'Professional Business Document',
      description: 'Clean formatting suitable for business presentations and reports'
    },
    {
      value: 'academic',
      label: 'Academic Paper',
      description: 'Proper citations, headers, and academic formatting standards'
    },
    {
      value: 'simple',
      label: 'Simple Clean Format',
      description: 'Basic formatting with consistent fonts and spacing'
    },
    {
      value: 'custom',
      label: 'Custom Goal',
      description: 'Specify your own formatting requirements'
    }
  ];

  const handleSubmit = () => {
    if (priority === 'custom' && !goal.trim()) {
      return;
    }
    
    const finalGoal = priority === 'custom' 
      ? goal 
      : presetGoals.find(p => p.value === priority)?.description || '';
    
    onGoalSet(finalGoal);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Set Formatting Goal</h2>
          <p className="text-gray-600">Define how you want your document to be formatted</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Uploaded Files Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Uploaded Files</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="text-sm text-gray-600">
                  {file.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Goal Setting Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5" />
              <span>Formatting Goal</span>
            </CardTitle>
            <CardDescription>
              Choose a preset or describe your custom formatting requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Select formatting type:</Label>
              <RadioGroup value={priority} onValueChange={setPriority} className="mt-3">
                {presetGoals.map((preset) => (
                  <div key={preset.value} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={preset.value} id={preset.value} className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor={preset.value} className="font-medium cursor-pointer">
                        {preset.label}
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">{preset.description}</p>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {priority === 'custom' && (
              <div>
                <Label htmlFor="custom-goal" className="text-base font-medium">
                  Describe your formatting requirements:
                </Label>
                <Textarea
                  id="custom-goal"
                  placeholder="e.g., Format as a technical specification with numbered sections, code blocks, and a table of contents..."
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="mt-2 min-h-[120px]"
                />
              </div>
            )}

            <Button 
              onClick={handleSubmit} 
              className="w-full"
              disabled={priority === 'custom' && !goal.trim()}
            >
              Start AI Formatting
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
