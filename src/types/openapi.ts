
export interface OpenAPIFile extends File {}

export interface OpenAPIInfo {
  title?: string;
  version?: string;
  description?: string;
  contact?: {
    name?: string;
    email?: string;
    url?: string;
  };
  license?: {
    name?: string;
    url?: string;
  };
}

export interface OpenAPIEndpoint {
  path: string;
  method: string;
  summary?: string;
  operationId?: string;
  parameters: any[];
  responses: Record<string, any>;
}

export interface OpenAPISchema {
  name: string;
  type: string;
  properties: Record<string, any>;
  required: string[];
}

export interface ParsedOpenAPI {
  id: string;
  name: string;
  content: any;
  info: OpenAPIInfo;
  endpoints: OpenAPIEndpoint[];
  schemas: OpenAPISchema[];
}
