'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { getCountryFlag } from '@/utils/countries';
import { formatMatchTime, formatMatchDate } from '@/utils/date';
import { getQualifiedMarkets, usesTotalGoalsConfidence } from '@/utils/markets';
import { mockFixtures } from '@/data/mock';
import { buildApiUrl, API_CONFIG } from '@/config/api';
import { ArrowLeft, Clock, TrendingUp, Shield, Target } from 'lucide-react';
import { cn } from '@/utils/cn';

// API Endpoints
const MORE_DETAILS_API = API_CONFIG.ENDPOINTS.MORE_DETAILS;

export default function MatchDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const matchId = params.id as string;
  const referrer = searchParams.get('ref') || 'homepage';
  const market = searchParams.get('market');
  const model = searchParams.get('model');
  
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  
  // Find the match
  const match = mockFixtures.find(fixture => fixture.id === matchId);
  
  // Filter predictions based on referrer context
  const relevantPredictions = useMemo(() => {
    if (!match) return [];
    
    let predictions = match.modelPredictions;
    
    if (referrer === 'market' && market) {
      // Filter predictions that qualify for this market
      predictions = predictions.filter(prediction => {
        const qualifiedMarkets = getQualifiedMarkets(prediction);
        return qualifiedMarkets.some(qm => qm.key === market);
      });
      // For markets, exclude BangaBot
      predictions = predictions.filter(p => p.aiModel.name !== 'BangaBot');
    } else if (referrer === 'model' && model) {
      // Filter to specific model
      predictions = predictions.filter(
        prediction => prediction.aiModel.name.toLowerCase() === model.toLowerCase()
      );
    } else if (referrer === 'homepage' || referrer === 'country') {
      // Show all predictions except BangaBot for homepage/country
      predictions = predictions.filter(p => p.aiModel.name !== 'BangaBot');
    }
    
    return predictions;
  }, [match, referrer, market, model]);

  // For AI model referrer, get all qualified markets for that model
  const relevantMarkets = useMemo(() => {
    if (referrer === 'model' && model && relevantPredictions.length > 0) {
      return getQualifiedMarkets(relevantPredictions[0]);
    }
    return [];
  }, [referrer, model, relevantPredictions]);
  
  // Set default selection to first prediction (Gemini if available) or first market for AI model
  React.useEffect(() => {
    if (referrer === 'model' && model && relevantMarkets.length > 0 && !selectedPrediction) {
      setSelectedPrediction(relevantMarkets[0].key);
    } else if (relevantPredictions.length > 0 && !selectedPrediction) {
      const geminiPrediction = relevantPredictions.find(p => p.aiModel.name === 'Gemini');
      setSelectedPrediction(geminiPrediction?.aiModel.name || relevantPredictions[0].aiModel.name);
    }
  }, [relevantPredictions, relevantMarkets, selectedPrediction, referrer, model]);
  
  const selectedPredictionData = referrer === 'model' && model 
    ? relevantPredictions[0] // For AI model referrer, always use the model's prediction
    : relevantPredictions.find(p => p.aiModel.name === selectedPrediction);
  
  if (!match) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="text-red-400 mb-2">Match not found</div>
          <p className="text-sm text-gray-500">
            The requested match does not exist
          </p>
        </div>
      </MainLayout>
    );
  }
  
  // Parse recent form
  const parseForm = (form: string) => {
    return form.split(',').map(result => ({
      result,
      color: result === 'win' ? 'bg-green-500' : 
             result === 'draw' ? 'bg-yellow-500' : 'bg-red-500'
    }));
  };
  
  const homeForm = parseForm(match.hometeamRecentForm);
  const awayForm = parseForm(match.awayteamRecentForm);
  
  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to {referrer === 'homepage' ? 'Home' : 
                          referrer === 'market' ? 'Markets' :
                          referrer === 'model' ? 'Models' : 'Countries'}</span>
        </Link>
      </div>
      
      {/* Match Header */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 mb-6">
        {/* Country and League */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl md:text-2xl">{getCountryFlag(match.country)}</span>
          <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{match.country}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-700 dark:text-gray-300 text-sm md:text-base">{match.league}</span>
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Time Info */}
          <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {formatMatchTime(match.time)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{formatMatchDate(match.time)}</p>
          </div>

          {/* Teams - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Home Team */}
            <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="w-12 h-12 mx-auto mb-2 relative">
                <Image
                  src={match.hometeamlogo}
                  alt={`${match.hometeam} logo`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="%23374151"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="14">🌍</text></svg>`;
                  }}
                />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{match.hometeam}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Home</p>
              
              {/* Form */}
              <div className="flex justify-center space-x-1">
                {homeForm.map((game, index) => (
                  <div
                    key={index}
                    className={cn("w-2 h-2 rounded-full", game.color)}
                    title={game.result}
                  />
                ))}
              </div>
            </div>

            {/* Away Team */}
            <div className="text-center bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="w-12 h-12 mx-auto mb-2 relative">
                <Image
                  src={match.awayteamlogo}
                  alt={`${match.awayteam} logo`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="%23374151"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="14">🌍</text></svg>`;
                  }}
                />
              </div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{match.awayteam}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Away</p>
              
              {/* Form */}
              <div className="flex justify-center space-x-1">
                {awayForm.map((game, index) => (
                  <div
                    key={index}
                    className={cn("w-2 h-2 rounded-full", game.color)}
                    title={game.result}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 items-center">
          {/* Home Team */}
          <div className="text-center">
            <div className="mb-3">
              <div className="w-16 h-16 mx-auto mb-2 relative">
                <Image
                  src={match.hometeamlogo}
                  alt={`${match.hometeam} logo`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="%23374151"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="14">🌍</text></svg>`;
                  }}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{match.hometeam}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Home</p>
            </div>
            
            {/* Home Team Form */}
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Recent Form</p>
              <div className="flex justify-center space-x-1">
                {homeForm.map((game, index) => (
                  <div
                    key={index}
                    className={cn("w-3 h-3 rounded-full", game.color)}
                    title={game.result}
                  />
                ))}
              </div>
            </div>
          </div>
          
          {/* Match Time */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatMatchTime(match.time)}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{formatMatchDate(match.time)}</p>
            <div className="text-4xl font-bold text-gray-400 dark:text-gray-600 my-2">VS</div>
          </div>
          
          {/* Away Team */}
          <div className="text-center">
            <div className="mb-3">
              <div className="w-16 h-16 mx-auto mb-2 relative">
                <Image
                  src={match.awayteamlogo}
                  alt={`${match.awayteam} logo`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="%23374151"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="14">🌍</text></svg>`;
                  }}
                />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{match.awayteam}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Away</p>
            </div>
            
            {/* Away Team Form */}
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Recent Form</p>
              <div className="flex justify-center space-x-1">
                {awayForm.map((game, index) => (
                  <div
                    key={index}
                    className={cn("w-3 h-3 rounded-full", game.color)}
                    title={game.result}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Predictions */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-blue-500" />
          <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">AI Predictions</h3>
        </div>
        
        {/* Prediction Cards */}
        {referrer === 'model' && model ? (
          /* AI Model referrer - mobile-friendly layout */
          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Scoreline Prediction */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 lg:p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">
                    {model.charAt(0).toUpperCase() + model.slice(1)} Prediction
                  </span>
                </div>
                
                {selectedPredictionData && (
                  <div className="space-y-4 lg:space-y-6">
                    {/* Score with inline confidence */}
                    <div className="text-center">
                      <div className="flex items-baseline justify-center space-x-2 lg:space-x-3 mb-2">
                        <div className="text-2xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                          {selectedPredictionData.predictedHomeGoal}-{selectedPredictionData.predictedAwayGoal}
                        </div>
                        <div className="text-xs lg:text-sm text-green-500 font-medium">
                          {selectedPredictionData.confidenceLevel}%
                        </div>
                      </div>
                      <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Predicted Score</div>
                    </div>
                    
                    {/* Goals with inline confidence */}
                    <div className="text-center">
                      <div className="flex items-baseline justify-center space-x-2 lg:space-x-3 mb-2">
                        <div className="text-xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                          {selectedPredictionData.predictedTotalGoals}
                        </div>
                        <div className="text-xs lg:text-sm text-yellow-500 font-medium">
                          {selectedPredictionData.confidenceLevelPTG}%
                        </div>
                      </div>
                      <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Expected Goals</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Market Cards */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">Qualifying Markets</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Markets where this model qualifies</p>
              </div>
              
              <div className="grid gap-2 lg:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {relevantMarkets.map((marketData) => (
                  <button
                    key={marketData.key}
                    onClick={() => setSelectedPrediction(marketData.key)}
                    className={cn(
                      "bg-white dark:bg-gray-800 border rounded-lg p-2 lg:p-3 text-center transition-colors",
                      selectedPrediction === marketData.key
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <div className="text-xs lg:text-sm font-medium text-gray-900 dark:text-white">
                      {marketData.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Other referrers - mobile-friendly grid layout */
          <div className="grid gap-3 lg:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {relevantPredictions.map((prediction) => (
              <button
                key={prediction.aiModel.name}
                onClick={() => setSelectedPrediction(prediction.aiModel.name)}
                className={cn(
                  "bg-white dark:bg-gray-800 border rounded-lg p-3 lg:p-4 text-left transition-colors",
                  selectedPrediction === prediction.aiModel.name
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                )}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm lg:text-base">{prediction.aiModel.name}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                      {prediction.predictedHomeGoal}-{prediction.predictedAwayGoal}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Predicted Score</div>
                  </div>
                  
                  {/* Display confidence based on referrer and market type */}
                  {referrer === 'market' && market && usesTotalGoalsConfidence(market) ? (
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-500">
                        {prediction.confidenceLevelPTG}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Confidence Level</div>
                    </div>
                  ) : referrer === 'market' && market ? (
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-500">
                        {prediction.confidenceLevel}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Confidence Level</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-500">
                        {prediction.confidenceLevel}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Score Confidence</div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* Selected Prediction Details */}
        {selectedPredictionData && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 lg:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />
              <h4 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
                {selectedPredictionData.aiModel.name} Analysis
              </h4>
            </div>
            
            {/* Show different layouts based on referrer type */}
            {referrer === 'market' && market && usesTotalGoalsConfidence(market) ? (
              /* Market referrer with over/under - show only goals reasoning */
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm lg:text-base">Match Analysis</h5>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {selectedPredictionData.confidenceLevelReasoningPTG}
                </p>
              </div>
            ) : referrer === 'market' && market ? (
              /* Market referrer with score markets - show only score reasoning */
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm lg:text-base">Match Analysis</h5>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {selectedPredictionData.confidenceLevelReasoning}
                </p>
              </div>
            ) : referrer === 'model' && model ? (
              /* AI Model referrer - show only score reasoning */
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm lg:text-base">Match Analysis</h5>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {selectedPredictionData.confidenceLevelReasoning}
                </p>
              </div>
            ) : (
              /* Homepage or Country referrer - show only score reasoning */
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm lg:text-base">Match Analysis</h5>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {selectedPredictionData.confidenceLevelReasoning}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
