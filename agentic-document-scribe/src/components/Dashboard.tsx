
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Clock, CheckCircle, TrendingUp, Zap } from 'lucide-react';

interface DashboardProps {
  onNewDocument: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNewDocument }) => {
  // Mock data for demonstration
  const recentDocuments = [
    { 
      id: '1', 
      name: 'Business_Report.docx', 
      status: 'completed', 
      createdAt: '2 hours ago',
      goal: 'Professional Business Document'
    },
    { 
      id: '2', 
      name: 'Research_Paper.docx', 
      status: 'processing', 
      createdAt: '30 minutes ago',
      goal: 'Academic Paper'
    },
    { 
      id: '3', 
      name: 'Meeting_Notes.docx', 
      status: 'completed', 
      createdAt: '1 day ago',
      goal: 'Simple Clean Format'
    }
  ];

  const stats = [
    { label: 'Documents Processed', value: '24', icon: FileText, color: 'text-blue-600' },
    { label: 'Processing Time Saved', value: '8.5h', icon: Clock, color: 'text-green-600' },
    { label: 'Success Rate', value: '98%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Active Jobs', value: '2', icon: Zap, color: 'text-orange-600' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Action */}
      <div className="text-center">
        <Button onClick={onNewDocument} size="lg" className="px-8 py-4 text-lg">
          <Plus className="w-6 h-6 mr-2" />
          Format New Document
        </Button>
      </div>

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>
            Your recently processed documents and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{doc.name}</p>
                    <p className="text-sm text-gray-500">{doc.goal}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getStatusBadge(doc.status)}
                  <span className="text-sm text-gray-500">{doc.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Quick Start</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Professional Business Document
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Academic Paper Format
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Simple Clean Document
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>System Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Agent</span>
              <Badge variant="default" className="bg-green-100 text-green-800">Online</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Processing Queue</span>
              <Badge variant="secondary">2 jobs</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Status</span>
              <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
