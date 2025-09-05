'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { getCountryFlag } from '@/utils/countries';
import { formatMatchTime, formatMatchDate } from '@/utils/date';
import { getQualifiedMarkets, usesTotalGoalsConfidence, isLogoAvailable } from '@/utils/markets';
import { mockFixtures, Fixture } from '@/data/mock';
import { API_CONFIG, buildApiUrl, shouldUseMockData } from '@/config/api';
// Removed unused imports
import { ArrowLeft, Clock, TrendingUp, Shield } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function MatchDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const matchId = params.id as string;
  const referrer = searchParams.get('ref') || 'homepage';
  const market = searchParams.get('market');
  const model = searchParams.get('model');
  
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [match, setMatch] = useState<Fixture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch match details from API or use mock data
  useEffect(() => {
    const fetchMatch = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Check if we should use mock data
        if (shouldUseMockData()) {
          console.log('🔄 Using mock data for match details - API not configured');
          const mockMatch = mockFixtures.find(fixture => fixture.id === matchId);
          setMatch(mockMatch || null);
          setLoading(false);
          return;
        }

        // Build API URL for match details
        const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.MORE_DETAILS, {
          fixturesId: matchId
        });
        
        console.log('🌐 Fetching match details from API:', apiUrl);
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.log('📡 Error response body:', errorText);
          throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        
        // Check if response has content
        const responseText = await response.text();
        console.log('📡 Raw response length:', responseText.length);
        
        if (!responseText.trim()) {
          throw new Error('API returned empty response');
        }
        
        const data = JSON.parse(responseText);
        console.log('✅ Match details received:', data);
        
        // Transform API data to handle Gemini/Germini naming and add missing fields
        const transformedMatch = {
          ...data,
          hometeamlogo: data.hometeamlogo || '',
          awayteamlogo: data.awayteamlogo || '',
          hometeamRecentForm: data.hometeamRecentForm || 'win,win,draw,win,win',
          awayteamRecentForm: data.awayteamRecentForm || 'win,draw,win,lose,win',
          modelPredictions: (data.modelPredictions || []).map((prediction: Fixture['modelPredictions'][0]) => ({
            ...prediction,
            aiModel: {
              ...prediction.aiModel,
              name: prediction.aiModel?.name === 'Germini' ? 'Gemini' : prediction.aiModel?.name
            }
          }))
        };
        
        setMatch(transformedMatch);
        
      } catch (err) {
        console.error('❌ Match details API Error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch match details');
        // Fallback to mock data
        const mockMatch = mockFixtures.find(fixture => fixture.id === matchId);
        setMatch(mockMatch || null);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);
  
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
      const geminiPrediction = relevantPredictions.find(p => 
        p.aiModel.name === 'Gemini' || p.aiModel.name === 'Germini'
      );
      setSelectedPrediction(geminiPrediction?.aiModel.name || relevantPredictions[0].aiModel.name);
    }
  }, [relevantPredictions, relevantMarkets, selectedPrediction, referrer, model]);
  
  const selectedPredictionData = referrer === 'model' && model 
    ? relevantPredictions[0] // For AI model referrer, always use the model's prediction
    : relevantPredictions.find(p => p.aiModel.name === selectedPrediction);
  
  if (loading) {
    return (
      <MainLayout fixtures={[]}>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">Loading match details...</div>
          <p className="text-sm text-gray-500">Please wait while we fetch the match data</p>
        </div>
      </MainLayout>
    );
  }

  if (!match) {
    return (
      <MainLayout fixtures={[]}>
        <div className="text-center py-12">
          <div className="text-red-400 mb-2">{error || 'Match not found'}</div>
          <p className="text-sm text-gray-500">
            {error ? 'Unable to load match details' : 'The requested match does not exist'}
          </p>
        </div>
      </MainLayout>
    );
  }
  
  // Parse recent form with null safety
  const parseForm = (form: string | null | undefined) => {
    if (!form) {
      // Default form if no data available
      return [
        { result: 'win', color: 'bg-green-500' },
        { result: 'win', color: 'bg-green-500' },
        { result: 'draw', color: 'bg-yellow-500' },
        { result: 'win', color: 'bg-green-500' },
        { result: 'win', color: 'bg-green-500' }
      ];
    }
    
    return form.split(',').map(result => ({
      result: result.trim(),
      color: result.trim() === 'win' ? 'bg-green-500' : 
             result.trim() === 'draw' ? 'bg-yellow-500' : 'bg-red-500'
    }));
  };
  
  const homeForm = parseForm(match.hometeamRecentForm);
  const awayForm = parseForm(match.awayteamRecentForm);
  
  return (
    <MainLayout fixtures={[match]}>
      {/* Disclaimer */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-6">
        <p className="text-xs text-blue-300 text-center">
          AI predictions generated using multiple model APIs with our data and algorithms.
        </p>
      </div>

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
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 md:p-6 mb-6">
        {/* Country and League */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl md:text-2xl">{getCountryFlag(match.country)}</span>
          <span className="text-gray-300 text-sm md:text-base">{match.country}</span>
          <span className="text-gray-500">•</span>
          <span className="text-gray-300 text-sm md:text-base">{match.league}</span>
        </div>
        
        {/* Mobile Layout */}
        <div className="md:hidden space-y-4">
          {/* Time Info */}
          <div className="text-center bg-gray-700 rounded-lg p-3">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-lg font-bold text-white">
                {formatMatchTime(match.time)}
              </span>
            </div>
            <p className="text-sm text-gray-400">{formatMatchDate(match.time)}</p>
          </div>

          {/* Teams - Side by Side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Home Team */}
            <div className="text-center bg-gray-700 rounded-lg p-3">
              {isLogoAvailable(match.hometeamlogo) && (
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
              )}
              <h3 className="text-sm font-bold text-white mb-1">{match.hometeam}</h3>
              <p className="text-xs text-gray-400 mb-2">Home</p>
              
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
            <div className="text-center bg-gray-700 rounded-lg p-3">
              {isLogoAvailable(match.awayteamlogo) && (
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
              )}
              <h3 className="text-sm font-bold text-white mb-1">{match.awayteam}</h3>
              <p className="text-xs text-gray-400 mb-2">Away</p>
              
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
              {isLogoAvailable(match.hometeamlogo) && (
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
              )}
              <h2 className="text-xl font-bold text-white">{match.hometeam}</h2>
              <p className="text-sm text-gray-400">Home</p>
            </div>
            
            {/* Home Team Form */}
            <div>
              <p className="text-xs text-gray-400 mb-2">Recent Form</p>
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
              <Clock className="h-5 w-5 text-gray-400" />
              <span className="text-2xl font-bold text-white">
                {formatMatchTime(match.time)}
              </span>
            </div>
            <p className="text-gray-400">{formatMatchDate(match.time)}</p>
            <div className="text-4xl font-bold text-gray-600 my-2">VS</div>
          </div>
          
          {/* Away Team */}
          <div className="text-center">
            <div className="mb-3">
              {isLogoAvailable(match.awayteamlogo) && (
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
              )}
              <h2 className="text-xl font-bold text-white">{match.awayteam}</h2>
              <p className="text-sm text-gray-400">Away</p>
            </div>
            
            {/* Away Team Form */}
            <div>
              <p className="text-xs text-gray-400 mb-2">Recent Form</p>
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
          <h3 className="text-lg lg:text-xl font-semibold text-white">AI Predictions</h3>
        </div>
        
        {/* Prediction Cards */}
        {referrer === 'model' && model ? (
          /* AI Model referrer - mobile-friendly layout */
          <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
            {/* Scoreline Prediction */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 lg:p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />
                  <span className="font-medium text-white text-sm lg:text-base">
                    {model.charAt(0).toUpperCase() + model.slice(1)} Prediction
                  </span>
                </div>
                
                {selectedPredictionData && (
                  <div className="space-y-4 lg:space-y-6">
                    {/* Score with inline confidence */}
                    <div className="text-center">
                      <div className="flex items-baseline justify-center space-x-2 lg:space-x-3 mb-2">
                        <div className="text-2xl lg:text-4xl font-bold text-white">
                          {selectedPredictionData.predictedHomeGoal}-{selectedPredictionData.predictedAwayGoal}
                        </div>
                        <div className="text-xs lg:text-sm text-green-500 font-medium">
                          {Math.round(selectedPredictionData.confidenceLevel)}%
                        </div>
                      </div>
                      <div className="text-xs lg:text-sm text-gray-400">Predicted Score</div>
                    </div>
                    
                    {/* Goals with inline confidence */}
                    <div className="text-center">
                      <div className="flex items-baseline justify-center space-x-2 lg:space-x-3 mb-2">
                        <div className="text-xl lg:text-3xl font-bold text-white">
                          {selectedPredictionData.predictedTotalGoals}
                        </div>
                        <div className="text-xs lg:text-sm text-yellow-500 font-medium">
                          {Math.round(selectedPredictionData.confidenceLevelPTG)}%
                        </div>
                      </div>
                      <div className="text-xs lg:text-sm text-gray-400">Expected Goals</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Market Cards */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <h4 className="text-base lg:text-lg font-semibold text-white">Qualifying Markets</h4>
                <p className="text-sm text-gray-400">Markets where this model qualifies</p>
              </div>
              
              <div className="grid gap-2 lg:gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {relevantMarkets.map((marketData) => (
                  <button
                    key={marketData.key}
                    onClick={() => setSelectedPrediction(marketData.key)}
                    className={cn(
                      "bg-gray-800 border rounded-lg p-2 lg:p-3 text-center transition-colors",
                      selectedPrediction === marketData.key
                        ? "border-blue-500 bg-blue-900/20"
                        : "border-gray-700 hover:border-gray-600"
                    )}
                  >
                    <div className="text-xs lg:text-sm font-medium text-white">
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
                  "bg-gray-800 border rounded-lg p-3 lg:p-4 text-left transition-colors",
                  selectedPrediction === prediction.aiModel.name
                    ? "border-blue-500 bg-blue-900/20"
                    : "border-gray-700 hover:border-gray-600"
                )}
              >
                <div className="flex items-center space-x-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-white text-sm lg:text-base">{prediction.aiModel.name}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-xl lg:text-2xl font-bold text-white">
                      {prediction.predictedHomeGoal}-{prediction.predictedAwayGoal}
                    </div>
                    <div className="text-xs text-gray-400">Predicted Score</div>
                  </div>
                  
                  {/* Display confidence based on referrer and market type */}
                  {referrer === 'market' && market && usesTotalGoalsConfidence(market) ? (
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-500">
                        {Math.round(prediction.confidenceLevelPTG)}%
                      </div>
                      <div className="text-xs text-gray-400">Confidence Level</div>
                    </div>
                  ) : referrer === 'market' && market ? (
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-500">
                        {Math.round(prediction.confidenceLevel)}%
                      </div>
                      <div className="text-xs text-gray-400">Confidence Level</div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-sm font-medium text-green-500">
                        {Math.round(prediction.confidenceLevel)}%
                      </div>
                      <div className="text-xs text-gray-400">Score Confidence</div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* Selected Prediction Details */}
        {selectedPredictionData && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 lg:p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-4 w-4 lg:h-5 lg:w-5 text-blue-500" />
              <h4 className="text-base lg:text-lg font-semibold text-white">
                {selectedPredictionData.aiModel.name} Analysis
              </h4>
            </div>
            
            {/* Show different layouts based on referrer type */}
            {referrer === 'market' && market && usesTotalGoalsConfidence(market) ? (
              /* Market referrer with over/under - show only goals reasoning */
              <div className="bg-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-white mb-2 text-sm lg:text-base">Match Analysis</h5>
                <p className="text-gray-300 text-sm">
                  {selectedPredictionData.confidenceLevelReasoningPTG}
                </p>
              </div>
            ) : referrer === 'market' && market ? (
              /* Market referrer with score markets - show only score reasoning */
              <div className="bg-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-white mb-2 text-sm lg:text-base">Match Analysis</h5>
                <p className="text-gray-300 text-sm">
                  {selectedPredictionData.confidenceLevelReasoning}
                </p>
              </div>
            ) : referrer === 'model' && model ? (
              /* AI Model referrer - show only score reasoning */
              <div className="bg-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-white mb-2 text-sm lg:text-base">Match Analysis</h5>
                <p className="text-gray-300 text-sm">
                  {selectedPredictionData.confidenceLevelReasoning}
                </p>
              </div>
            ) : (
              /* Homepage or Country referrer - show only score reasoning */
              <div className="bg-gray-700 rounded-lg p-4">
                <h5 className="font-medium text-white mb-2 text-sm lg:text-base">Match Analysis</h5>
                <p className="text-gray-300 text-sm">
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
