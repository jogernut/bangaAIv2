// API Configuration for Banga.ai
// Environment variables with fallback to empty strings (will trigger mock data)

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  ENDPOINTS: {
    HOMEPAGE: process.env.NEXT_PUBLIC_HOMEPAGE_API || '',
    MARKETS: process.env.NEXT_PUBLIC_MARKETS_API || '',
    MORE_DETAILS: process.env.NEXT_PUBLIC_MORE_DETAILS_API || '',
  },
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Banga.ai',
  BANGABOT_URL: process.env.NEXT_PUBLIC_BANGABOT_URL || 'https://bot.bangaai.com',
};

// Helper function to check if we should use mock data
export const shouldUseMockData = () => {
  return !API_CONFIG.BASE_URL || 
         !API_CONFIG.ENDPOINTS.HOMEPAGE || 
         !API_CONFIG.ENDPOINTS.MARKETS || 
         !API_CONFIG.ENDPOINTS.MORE_DETAILS;
};

// API URL builders
export const buildApiUrl = (endpoint: string, params?: Record<string, string>) => {
  if (shouldUseMockData()) {
    return ''; // Will trigger mock data usage
  }
  
  const url = new URL(endpoint, API_CONFIG.BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }
  return url.toString();
};

