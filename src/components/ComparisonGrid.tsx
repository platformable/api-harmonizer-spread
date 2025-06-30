
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ParsedOpenAPI } from '@/types/openapi';

interface ComparisonGridProps {
  files: ParsedOpenAPI[];
}

const ComparisonGrid: React.FC<ComparisonGridProps> = ({ files }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    info: true,
    servers: false,
    security: false,
    endpoints: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderValue = (value: any): string => {
    if (value === null || value === undefined || value === '') {
      return 'Null';
    }
    return String(value);
  };

  const getEndpointSummary = (file: ParsedOpenAPI) => {
    const totalEndpoints = file.endpoints.length;
    const endpointsWithResponses = file.endpoints.filter(ep => 
      ep.responses && Object.keys(ep.responses).length > 0
    ).length;
    const endpointsWithResponseDescriptions = file.endpoints.filter(ep => 
      ep.responses && Object.values(ep.responses).some((resp: any) => resp.description)
    ).length;

    return {
      total: totalEndpoints,
      withResponses: endpointsWithResponses,
      withResponseDescriptions: endpointsWithResponseDescriptions
    };
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
                {renderValue(file.info.title)}
              </div>
            ))}
          </div>

          {expandedSections.info && (
            <>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Title</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {renderValue(file.info.title)}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-white" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Version</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {renderValue(file.info.version)}
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
                    ) : 'Null'}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-white" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Contact Name</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {renderValue(file.info.contact?.name)}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Contact Email</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {renderValue(file.info.contact?.email)}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-white" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Contact URL</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {file.info.contact?.url ? (
                      <a href={file.info.contact.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {file.info.contact.url}
                      </a>
                    ) : 'Null'}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">License Name</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {renderValue(file.info.license?.name)}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-white" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">License URL</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {file.info.license?.url ? (
                      <a href={file.info.license.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {file.info.license.url}
                      </a>
                    ) : 'Null'}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Servers Section */}
        <div className="border-b">
          <div 
            className="grid gap-4 p-4 bg-white hover:bg-gray-50 cursor-pointer border-b"
            style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}
            onClick={() => toggleSection('servers')}
          >
            <div className="flex items-center gap-2 font-medium">
              {expandedSections.servers ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Servers
            </div>
            {files.map((file) => (
              <div key={file.id} className="text-sm text-gray-600">
                {file.servers.length > 0 ? `${file.servers.length} server(s)` : 'Null'}
              </div>
            ))}
          </div>

          {expandedSections.servers && (
            <>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Server Count</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {file.servers.length || 'Null'}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-white" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Primary Server URL</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {renderValue(file.servers[0]?.url)}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Primary Server Description</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {renderValue(file.servers[0]?.description)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Security Schemes Section */}
        <div className="border-b">
          <div 
            className="grid gap-4 p-4 bg-white hover:bg-gray-50 cursor-pointer border-b"
            style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}
            onClick={() => toggleSection('security')}
          >
            <div className="flex items-center gap-2 font-medium">
              {expandedSections.security ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              Security Schemes
            </div>
            {files.map((file) => (
              <div key={file.id} className="text-sm text-gray-600">
                {Object.keys(file.securitySchemes).length > 0 ? `${Object.keys(file.securitySchemes).length} scheme(s)` : 'Null'}
              </div>
            ))}
          </div>

          {expandedSections.security && (
            <>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Security Scheme Count</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {Object.keys(file.securitySchemes).length || 'Null'}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-white" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Security Scheme Names</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {Object.keys(file.securitySchemes).length > 0 ? Object.keys(file.securitySchemes).join(', ') : 'Null'}
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
              Endpoints Summary
            </div>
            {files.map((file) => (
              <div key={file.id} className="text-sm text-gray-600">
                {file.endpoints.length > 0 ? `${file.endpoints.length} endpoint(s)` : 'Null'}
              </div>
            ))}
          </div>

          {expandedSections.endpoints && (
            <>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Total Endpoints</div>
                {files.map((file) => {
                  const summary = getEndpointSummary(file);
                  return (
                    <div key={file.id} className="text-sm">
                      {summary.total || 'Null'}
                    </div>
                  );
                })}
              </div>
              <div className="grid gap-4 p-4 bg-white" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Endpoints with Responses</div>
                {files.map((file) => {
                  const summary = getEndpointSummary(file);
                  return (
                    <div key={file.id} className="text-sm">
                      {summary.withResponses || 'Null'}
                    </div>
                  );
                })}
              </div>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Endpoints with Response Descriptions</div>
                {files.map((file) => {
                  const summary = getEndpointSummary(file);
                  return (
                    <div key={file.id} className="text-sm">
                      {summary.withResponseDescriptions || 'Null'}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonGrid;
