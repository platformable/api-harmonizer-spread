import React, { useState, useCallback } from 'react';
import { Upload, Download, FileText, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import FileUpload from '@/components/FileUpload';
import ComparisonGrid from '@/components/ComparisonGrid';
import { OpenAPIFile, ParsedOpenAPI, OpenAPIEndpoint, OpenAPIServer, OpenAPISecurityScheme, OpenAPISchema } from '@/types/openapi';

const Index = () => {
  const [files, setFiles] = useState<OpenAPIFile[]>([]);
  const [parsedFiles, setParsedFiles] = useState<ParsedOpenAPI[]>([]);

  const extractEndpoints = (content: any): OpenAPIEndpoint[] => {
    const endpoints: OpenAPIEndpoint[] = [];
    if (content.paths) {
      Object.entries(content.paths).forEach(([path, pathObj]: [string, any]) => {
        Object.entries(pathObj).forEach(([method, methodObj]: [string, any]) => {
          if (typeof methodObj === 'object' && methodObj !== null) {
            endpoints.push({
              path,
              method: method.toUpperCase(),
              summary: methodObj.summary,
              operationId: methodObj.operationId,
              parameters: methodObj.parameters || [],
              responses: methodObj.responses || {}
            });
          }
        });
      });
    }
    return endpoints;
  };

  const extractServers = (content: any): OpenAPIServer[] => {
    return content.servers || [];
  };

  const extractSecuritySchemes = (content: any): Record<string, OpenAPISecurityScheme> => {
    return content.components?.securitySchemes || {};
  };

  const extractSchemas = (content: any): OpenAPISchema[] => {
    const schemas: OpenAPISchema[] = [];
    if (content.components?.schemas) {
      Object.entries(content.components.schemas).forEach(([name, schemaObj]: [string, any]) => {
        if (typeof schemaObj === 'object' && schemaObj !== null) {
          schemas.push({
            name,
            type: schemaObj.type || 'object',
            properties: schemaObj.properties || {},
            required: schemaObj.required || []
          });
        }
      });
    }
    return schemas;
  };

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
          
          const endpoints = extractEndpoints(parsed);
          const servers = extractServers(parsed);
          const securitySchemes = extractSecuritySchemes(parsed);
          const schemas = extractSchemas(parsed);
          
          const parsedFile: ParsedOpenAPI = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            content: parsed,
            info: parsed.info || {},
            servers,
            securitySchemes,
            endpoints,
            schemas
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
        info: f.info
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center py-16 mb-12">
          <div className="flex items-center justify-center mb-8">
            <img 
              src="/lovable-uploads/a39897f3-ccef-4aa3-a6bd-380cd5f5ec22.png" 
              alt="Platformable Logo" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
            <FileText className="text-primary" />
            OpenAPI Comparison Tool
          </h1>
          <p className="text-muted-foreground text-xl max-w-3xl mx-auto leading-relaxed">
            Upload multiple OpenAPI files and compare their information side by side. 
            Analyze endpoints, schemas, security schemes, and more with our comprehensive comparison tool.
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
                        <p className="text-xs text-gray-600 mt-1">
                          Version: {file.info.version || 'Not specified'}
                        </p>
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

export default Index;
