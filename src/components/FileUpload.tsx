
import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { OpenAPIFile } from '@/types/openapi';

interface FileUploadProps {
  onFilesUploaded: (files: OpenAPIFile[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = (file: File): boolean => {
    const validExtensions = ['.json', '.yaml', '.yml'];
    const isValidExtension = validExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );
    
    if (!isValidExtension) {
      toast.error(`${file.name} is not a valid OpenAPI file. Please upload JSON or YAML files.`);
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error(`${file.name} is too large. Maximum file size is 10MB.`);
      return false;
    }
    
    return true;
  };

  const handleFiles = useCallback((fileList: FileList) => {
    const validFiles: OpenAPIFile[] = [];
    
    Array.from(fileList).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file as OpenAPIFile);
      }
    });
    
    if (validFiles.length > 0) {
      onFilesUploaded(validFiles);
    }
  }, [onFilesUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  return (
    <div className="space-y-4">
      {/* Drag and Drop Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className={`h-12 w-12 mx-auto mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Drop your OpenAPI files here
        </h3>
        <p className="text-gray-600 mb-4">
          or click to browse and select files
        </p>
        <Button
          variant="outline"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <FileText className="h-4 w-4 mr-2" />
          Select Files
        </Button>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".json,.yaml,.yml"
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* File Format Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">Supported Formats</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• OpenAPI 3.0+ JSON files (.json)</li>
              <li>• OpenAPI 3.0+ YAML files (.yaml, .yml)</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Upload multiple files to compare side by side</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
