/**
 * Utility functions for AI model handling
 */

/**
 * Normalize AI model names to match our expected naming conventions
 */
export const normalizeModelName = (modelName: string | undefined | null): string => {
  if (!modelName) return '';
  
  // Handle various model name variations
  if (modelName === 'Germini') return 'Gemini';
  if (modelName === 'chatgpt' || modelName === 'Chat GPT' || modelName === 'gpt') return 'ChatGPT';
  if (modelName === 'ml' || modelName === 'ML Model') return 'ML';
  if (modelName === 'grok') return 'Grok';
  
  return modelName;
};

/**
 * Transform API fixture data to normalize model names
 */
export const transformFixtureModelNames = (apiData: any[]): any[] => {
  return Array.isArray(apiData) ? apiData.map((match: any) => ({
    ...match,
    hometeamlogo: match.hometeamlogo || '',
    awayteamlogo: match.awayteamlogo || '',
    modelPredictions: (match.modelPredictions || []).map((prediction: any) => ({
      ...prediction,
      aiModel: {
        ...prediction.aiModel,
        name: normalizeModelName(prediction.aiModel?.name)
      }
    }))
  })) : [];
};
