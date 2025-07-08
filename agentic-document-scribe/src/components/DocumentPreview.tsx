
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';

interface DocumentPreviewProps {
  jobId: string;
  type: 'original' | 'formatted';
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ jobId, type }) => {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/documents/${jobId}/download/${type}`, {
          responseType: 'arraybuffer',
        });
        const result = await mammoth.convertToHtml({ arrayBuffer: response.data });
        setHtml(result.value);
      } catch (error) {
        console.error(`Failed to load ${type} document:`, error);
        setHtml('<p class="text-red-500">Failed to load document preview.</p>');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [jobId, type]);

  return (
    <div>
      <h4 className="font-medium text-gray-900 mb-3">{type === 'original' ? 'Original' : 'Formatted'} Document</h4>
      <div className="bg-gray-100 h-96 rounded-lg overflow-y-auto p-4 border">
        {loading ? (
          <p className="text-gray-500">Loading preview...</p>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </div>
    </div>
  );
};
