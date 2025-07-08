import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface DocumentUploadProps {
  onUpload: (files: File[], jobId?: string) => void;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
}

interface UploadedFile {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  acceptedTypes = ['.docx', '.pdf', '.txt'],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);

    const newFiles = acceptedFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i].file;
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/documents/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadedFiles(prev =>
              prev.map((uploadFile, index) =>
                index === uploadedFiles.length + i
                  ? { ...uploadFile, progress: percent }
                  : uploadFile
              )
            );
          }
        });

        setUploadedFiles(prev =>
          prev.map((uploadFile, index) =>
            index === uploadedFiles.length + i
              ? { ...uploadFile, status: 'completed' }
              : uploadFile
          )
        );

        // Pass job ID or file reference to parent
        if (response.data && response.data.job_id) {
          onUpload([file], response.data.job_id);
        } else {
          onUpload([file]);
        }
      } catch (error: any) {
        setUploadedFiles(prev =>
          prev.map((uploadFile, index) =>
            index === uploadedFiles.length + i
              ? { ...uploadFile, status: 'error', error: error.message }
              : uploadFile
          )
        );
      }
    }

    setIsUploading(false);
  }, [uploadedFiles.length, onUpload]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt']
    },
    maxSize,
    multiple
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleContinue = () => {
    const completedFiles = uploadedFiles
      .filter(uf => uf.status === 'completed')
      .map(uf => uf.file);
    
    if (completedFiles.length > 0) {
      onUpload(completedFiles);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Upload Your Document</h2>
        <p className="text-gray-600">
          Upload your document to get started with AI-powered formatting
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Upload</CardTitle>
          <CardDescription>
            Supported formats: {acceptedTypes.join(', ')} • Max size: {formatFileSize(maxSize)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragActive 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-gray-400"
            )}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            
            {isDragActive ? (
              <p className="text-lg text-blue-600">Drop your files here...</p>
            ) : (
              <div>
                <p className="text-lg text-gray-600 mb-2">
                  Drag and drop your documents here, or click to browse
                </p>
                <Button variant="outline" className="mt-2">
                  Choose Files
                </Button>
              </div>
            )}
          </div>

          {/* File Rejections */}
          {fileRejections.length > 0 && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-800 mb-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Upload Errors</span>
              </div>
              {fileRejections.map(({ file, errors }) => (
                <div key={file.name} className="text-sm text-red-700">
                  <strong>{file.name}</strong>: {errors.map(e => e.message).join(', ')}
                </div>
              ))}
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-gray-900">Uploaded Files</h4>
              {uploadedFiles.map((uploadFile, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {uploadFile.file.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatFileSize(uploadFile.file.size)}
                      </span>
                    </div>
                    
                    {uploadFile.status === 'uploading' && (
                      <div className="mt-1">
                        <Progress value={uploadFile.progress} className="h-2" />
                        <p className="text-xs text-gray-500 mt-1">
                          Uploading... {uploadFile.progress}%
                        </p>
                      </div>
                    )}
                    
                    {uploadFile.status === 'completed' && (
                      <p className="text-xs text-green-600 mt-1">Upload completed</p>
                    )}
                    
                    {uploadFile.status === 'error' && (
                      <p className="text-xs text-red-600 mt-1">
                        Error: {uploadFile.error}
                      </p>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Continue Button */}
          {uploadedFiles.some(uf => uf.status === 'completed') && (
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handleContinue}
                disabled={isUploading}
                className="px-8"
              >
                Continue to Goal Setting
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
