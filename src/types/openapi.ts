
export interface OpenAPIFile extends File {}

export interface OpenAPIInfo {
  title?: string;
  version?: string;
  description?: string;
  termsOfService?: string;
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

export interface OpenAPIServer {
  url?: string;
  description?: string;
}

export interface OpenAPISecurityScheme {
  type?: string;
  description?: string;
  name?: string;
  in?: string;
  scheme?: string;
  bearerFormat?: string;
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
  servers: OpenAPIServer[];
  securitySchemes: Record<string, OpenAPISecurityScheme>;
  endpoints: OpenAPIEndpoint[];
  schemas: OpenAPISchema[];
}
