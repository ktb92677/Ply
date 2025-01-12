import { OpenAPI } from '../api-client';

// Configure the base URL for the API client
OpenAPI.BASE = '';

// Configure axios instance if needed
OpenAPI.WITH_CREDENTIALS = true;

// Export all services
export * from '../api-client/services/DefaultService';

// Export all models
export * from '../api-client/models'; 