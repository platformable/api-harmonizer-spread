
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ParsedOpenAPI } from '@/types/openapi';

interface ComparisonGridProps {
  files: ParsedOpenAPI[];
}

const ComparisonGrid: React.FC<ComparisonGridProps> = ({ files }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    info: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
              <div className="grid gap-4 p-4 bg-white" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Contact Name</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {file.info.contact?.name || '-'}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">Contact Email</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {file.info.contact?.email || '-'}
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
                    ) : '-'}
                  </div>
                ))}
              </div>
              <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `300px repeat(${files.length}, 1fr)` }}>
                <div className="text-sm font-medium pl-6">License Name</div>
                {files.map((file) => (
                  <div key={file.id} className="text-sm">
                    {file.info.license?.name || '-'}
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
                    ) : '-'}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonGrid;
