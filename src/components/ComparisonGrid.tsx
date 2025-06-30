
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ParsedOpenAPI } from '@/types/openapi';

interface ComparisonGridProps {
  files: ParsedOpenAPI[];
}

const ComparisonGrid: React.FC<ComparisonGridProps> = ({ files }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    info: true,
    endpoints: false,
    schemas: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getAllEndpoints = () => {
    const allEndpoints = new Set<string>();
    files.forEach(file => {
      file.endpoints.forEach(endpoint => {
        allEndpoints.add(`${endpoint.method} ${endpoint.path}`);
      });
    });
    return Array.from(allEndpoints).sort();
  };

  const getAllSchemas = () => {
    const allSchemas = new Set<string>();
    files.forEach(file => {
      file.schemas.forEach(schema => {
        allSchemas.add(schema.name);
      });
    });
    return Array.from(allSchemas).sort();
  };

  const getEndpointForFile = (file: ParsedOpenAPI, endpointKey: string) => {
    const [method, path] = endpointKey.split(' ', 2);
    return file.endpoints.find(e => e.method === method && e.path === path);
  };

  const getSchemaForFile = (file: ParsedOpenAPI, schemaName: string) => {
    return file.schemas.find(s => s.name === schemaName);
  };

  const renderComparisonIcon = (hasValue: boolean, isConsistent: boolean) => {
    if (!hasValue) return <X className="h-4 w-4 text-red-500" />;
    if (!isConsistent) return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <Check className="h-4 w-4 text-green-500" />;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        {/* Header Row */}
        <div className="grid gap-4 p-4 bg-gray-50 border-b" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
          <div className="font-semibold text-gray-900">Field</div>
          {files.map((file) => (
            <div key={file.id} className="font-semibold text-gray-900 truncate">
              {file.name}
            </div>
          ))}
        </div>

        {/* API Info Section */}
        <div className="border-b">
          <div 
            className="grid gap-4 p-4 bg-white hover:bg-gray-50 cursor-pointer border-b"
            style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}
            onClick={() => toggleSection('info')}
          >
            <div className="flex items-center gap-2 font-medium">
              {expandedSections.info ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              API Information
            </div>
            {files.map((file) => (
              <div key={file.id} className="text-sm text-gray-600">
                {file.info.title || 'No title'}
              </div>
            ))}
          </div>

          {expandedSections.info && (
            <>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Title</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {file.info.title || '-'}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-white" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Version</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {file.info.version || '-'}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Description</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm text-gray-600">
                    {file.info.description ? (
                      <div className="truncate max-w-xs" title={file.info.description}>
                        {file.info.description}
                      </div>
                    ) : '-'}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Endpoints Section */}
        <div className="border-b">
          <div 
            className="grid gap-4 p-4 bg-white hover:bg-gray-50 cursor-pointer border-b"
            style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}
            onClick={() => toggleSection('endpoints')}
          >
            <div className="flex items-center gap-2 font-medium">
              {expandedSections.endpoints ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Endpoints ({getAllEndpoints().length})
            </div>
            {files.map((file) => (
              <div key={file.id} className="text-sm text-gray-600">
                {file.endpoints.length} endpoints
              </div>
            ))}
          </div>

          {expandedSections.endpoints && getAllEndpoints().map((endpointKey, index) => {
            const [method, path] = endpointKey.split(' ', 2);
            const endpointsInFiles = files.map(file => getEndpointForFile(file, endpointKey));
            const hasEndpoint = endpointsInFiles.map(ep => !!ep);
            const allHaveEndpoint = hasEndpoint.every(has => has);
            
            return (
              <div 
                key={endpointKey}
                className={`grid gap-4 p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}
              >
                <div className="text-sm pl-6">
                  <div className="flex items-center gap-2">
                    <Badge variant={method === 'GET' ? 'default' : method === 'POST' ? 'destructive' : 'secondary'}>
                      {method}
                    </Badge>
                    <span className="font-mono text-xs">{path}</span>
                  </div>
                </div>
                {files.map((file, fileIndex) => {
                  const endpoint = endpointsInFiles[fileIndex];
                  return (
                    <div key={file.id} className="text-sm">
                      <div className="flex items-center gap-2">
                        {renderComparisonIcon(!!endpoint, allHaveEndpoint)}
                        {endpoint ? (
                          <div>
                            <div className="font-medium">{endpoint.summary || 'No summary'}</div>
                            <div className="text-xs text-gray-500">
                              {endpoint.parameters.length} params, {Object.keys(endpoint.responses).length} responses
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not present</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Schemas Section */}
        <div className="border-b">
          <div 
            className="grid gap-4 p-4 bg-white hover:bg-gray-50 cursor-pointer border-b"
            style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}
            onClick={() => toggleSection('schemas')}
          >
            <div className="flex items-center gap-2 font-medium">
              {expandedSections.schemas ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Schemas ({getAllSchemas().length})
            </div>
            {files.map((file) => (
              <div key={file.id} className="text-sm text-gray-600">
                {file.schemas.length} schemas
              </div>
            ))}
          </div>

          {expandedSections.schemas && getAllSchemas().map((schemaName, index) => {
            const schemasInFiles = files.map(file => getSchemaForFile(file, schemaName));
            const hasSchema = schemasInFiles.map(schema => !!schema);
            const allHaveSchema = hasSchema.every(has => has);
            
            return (
              <div 
                key={schemaName}
                className={`grid gap-4 p-4 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}
              >
                <div className="text-sm font-medium pl-6">{schemaName}</div>
                {files.map((file, fileIndex) => {
                  const schema = schemasInFiles[fileIndex];
                  return (
                    <div key={file.id} className="text-sm">
                      <div className="flex items-center gap-2">
                        {renderComparisonIcon(!!schema, allHaveSchema)}
                        {schema ? (
                          <div>
                            <div className="font-medium">{schema.type}</div>
                            <div className="text-xs text-gray-500">
                              {Object.keys(schema.properties).length} properties
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">Not present</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComparisonGrid;
