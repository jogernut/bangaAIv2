// Market qualification logic for AI predictions
import { ModelPrediction } from '@/data/mock';

// Utility function to check if a team logo URL is available
export const isLogoAvailable = (logoUrl: string | undefined | null): boolean => {
  return !!(logoUrl && logoUrl.trim() !== '' && !logoUrl.includes('placeholder'));
};

export interface QualifiedMarket {
  key: string;
  name: string;
  description: string;
  prediction: ModelPrediction;
}

// Market qualification logic based on predictions
export const getQualifiedMarkets = (prediction: ModelPrediction): QualifiedMarket[] => {
  const { predictedHomeGoal, predictedAwayGoal, predictedTotalGoals } = prediction;
  const qualifiedMarkets: QualifiedMarket[] = [];
  
  // Over/Under Goals Markets
  if (predictedTotalGoals > 2.5) {
    qualifiedMarkets.push({
      key: 'over2_5',
      name: 'Over 2.5',
      description: 'Over 2.5 Goals',
      prediction
    });
  } else {
    qualifiedMarkets.push({
      key: 'under2_5',
      name: 'Under 2.5',
      description: 'Under 2.5 Goals',
      prediction
    });
  }
  
  if (predictedTotalGoals > 1.5) {
    qualifiedMarkets.push({
      key: 'over1_5',
      name: 'Over 1.5',
      description: 'Over 1.5 Goals',
      prediction
    });
  } else {
    qualifiedMarkets.push({
      key: 'under1_5',
      name: 'Under 1.5',
      description: 'Under 1.5 Goals',
      prediction
    });
  }
  
  // Both Teams to Score
  if (predictedHomeGoal >= 1 && predictedAwayGoal >= 1) {
    qualifiedMarkets.push({
      key: 'GG',
      name: 'BTTS (Yes)',
      description: 'Both Teams to Score (Yes)',
      prediction
    });
  } else {
    qualifiedMarkets.push({
      key: 'NG',
      name: 'BTTS (No)',
      description: 'Both Teams to Score (No)',
      prediction
    });
  }
  
  // Match Result
  if (predictedHomeGoal > predictedAwayGoal) {
    qualifiedMarkets.push({
      key: 'home_win',
      name: 'Home Win',
      description: 'Home Team Win',
      prediction
    });
  } else if (predictedAwayGoal > predictedHomeGoal) {
    qualifiedMarkets.push({
      key: 'away_win',
      name: 'Away Win',
      description: 'Away Team Win',
      prediction
    });
  } else {
    qualifiedMarkets.push({
      key: 'draw',
      name: 'Draw',
      description: 'Match Draw',
      prediction
    });
  }
  
  return qualifiedMarkets;
};

// Filter predictions by market
export const filterPredictionsByMarket = (predictions: ModelPrediction[], market: string): ModelPrediction[] => {
  return predictions.filter(prediction => {
    const qualifiedMarkets = getQualifiedMarkets(prediction);
    return qualifiedMarkets.some(qm => qm.key === market);
  });
};

// Get market display value for a prediction
export const getMarketDisplayValue = (prediction: ModelPrediction, market: string): string => {
  const { predictedHomeGoal, predictedAwayGoal, predictedTotalGoals } = prediction;
  
  switch (market) {
    case 'over2_5':
    case 'under2_5':
    case 'over1_5':
    case 'under1_5':
      // Use readable format with more space available
      const goals = predictedTotalGoals % 1 === 0
        ? predictedTotalGoals.toFixed(0)
        : predictedTotalGoals.toFixed(1);
      return `${goals} goals`;
    case 'GG':
      return `${predictedHomeGoal}-${predictedAwayGoal}`;
    case 'NG':
      return `${predictedHomeGoal}-${predictedAwayGoal}`;
    case 'home_win':
      return `${predictedHomeGoal}-${predictedAwayGoal}`;
    case 'away_win':
      return `${predictedHomeGoal}-${predictedAwayGoal}`;
    case 'draw':
      return `${predictedHomeGoal}-${predictedAwayGoal}`;
    default:
      return `${predictedHomeGoal}-${predictedAwayGoal}`;
  }
};

// Check if a market uses total goals confidence
export const usesTotalGoalsConfidence = (market: string): boolean => {
  return ['over2_5', 'under2_5', 'over1_5', 'under1_5'].includes(market);
};

