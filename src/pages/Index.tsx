
import React, { useState, useCallback } from 'react';
import { Upload, Download, FileText, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';
import ComparisonGrid from '@/components/ComparisonGrid';
import { OpenAPIFile, ParsedOpenAPI } from '@/types/openapi';

const Index = () => {
  const [files, setFiles] = useState<OpenAPIFile[]>([]);
  const [parsedFiles, setParsedFiles] = useState<ParsedOpenAPI[]>([]);

  const handleFileUpload = useCallback((newFiles: OpenAPIFile[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    
    // Parse the files
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          let parsed;
          
          if (file.name.endsWith('.json')) {
            parsed = JSON.parse(content);
          } else if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
            // Simple YAML parsing for basic OpenAPI files
            // In a real implementation, you'd use a proper YAML parser
            toast.error('YAML parsing not fully implemented. Please use JSON files.');
            return;
          }
          
          const parsedFile: ParsedOpenAPI = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            content: parsed,
            endpoints: extractEndpoints(parsed),
            schemas: extractSchemas(parsed),
            info: parsed.info || {}
          };
          
          setParsedFiles(prev => [...prev, parsedFile]);
          toast.success(`Successfully parsed ${file.name}`);
        } catch (error) {
          toast.error(`Failed to parse ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const removeFile = useCallback((id: string) => {
    setParsedFiles(prev => prev.filter(file => file.id !== id));
    setFiles(prev => prev.filter((_, index) => parsedFiles[index]?.id !== id));
    toast.success('File removed');
  }, [parsedFiles]);

  const exportComparison = useCallback(() => {
    const comparisonData = {
      files: parsedFiles.map(f => ({
        name: f.name,
        info: f.info,
        endpointCount: f.endpoints.length,
        schemaCount: f.schemas.length
      })),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(comparisonData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `openapi-comparison-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Comparison exported successfully');
  }, [parsedFiles]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FileText className="text-blue-600" />
            OpenAPI Comparison Tool
          </h1>
          <p className="text-gray-600 text-lg">
            Upload multiple OpenAPI files and compare them side by side
          </p>
        </div>

        {/* File Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload OpenAPI Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload onFilesUploaded={handleFileUpload} />
            
            {/* Uploaded Files Display */}
            {parsedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Uploaded Files ({parsedFiles.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {parsedFiles.map((file) => (
                    <div key={file.id} className="bg-white border rounded-lg p-4 relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="pr-8">
                        <h4 className="font-medium text-gray-900 truncate">{file.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {file.info.title || 'No title'}
                        </p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-600">
                          <span>{file.endpoints.length} endpoints</span>
                          <span>{file.schemas.length} schemas</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button onClick={exportComparison} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Comparison
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comparison Grid */}
        {parsedFiles.length > 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Side-by-Side Comparison</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ComparisonGrid files={parsedFiles} />
            </CardContent>
          </Card>
        )}

        {parsedFiles.length === 1 && (
          <div className="text-center py-12 text-gray-500">
            <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Upload another OpenAPI file to start comparing</p>
          </div>
        )}

        {parsedFiles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Upload your first OpenAPI file to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions to extract data from OpenAPI spec
const extractEndpoints = (spec: any) => {
  const endpoints = [];
  if (spec.paths) {
    for (const [path, methods] of Object.entries(spec.paths)) {
      for (const [method, details] of Object.entries(methods as any)) {
        if (typeof details === 'object' && details !== null) {
          endpoints.push({
            path,
            method: method.toUpperCase(),
            summary: (details as any).summary || '',
            operationId: (details as any).operationId || '',
            parameters: (details as any).parameters || [],
            responses: (details as any).responses || {}
          });
        }
      }
    }
  }
  return endpoints;
};

const extractSchemas = (spec: any) => {
  const schemas = [];
  if (spec.components?.schemas) {
    for (const [name, schema] of Object.entries(spec.components.schemas)) {
      schemas.push({
        name,
        type: (schema as any).type || 'object',
        properties: (schema as any).properties || {},
        required: (schema as any).required || []
      });
    }
  }
  return schemas;
};

export default Index;
