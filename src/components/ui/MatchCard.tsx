'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
// import { getCountryFlag } from '@/utils/countries'; // Will be used for country displays
import { formatMatchTime } from '@/utils/date';
import { Fixture, ModelPrediction } from '@/data/mock';
import { getQualifiedMarkets, getMarketDisplayValue } from '@/utils/markets';

interface MatchCardProps {
  fixture: Fixture;
  mode?: 'homepage' | 'market' | 'model';
  market?: string;
  selectedModel?: string;
  className?: string;
}

export default function MatchCard({ 
  fixture, 
  mode = 'homepage', 
  market, 
  selectedModel,
  className 
}: MatchCardProps) {
  const matchTime = formatMatchTime(fixture.time);
  
  // Filter predictions based on mode
  let displayPredictions: ModelPrediction[] = [];
  
  if (mode === 'homepage') {
    // Show first 4 models (exclude BangaBot)
    displayPredictions = fixture.modelPredictions
      .filter(p => p.aiModel.name !== 'BangaBot')
      .slice(0, 4);
  } else if (mode === 'market' && market) {
    // Show only predictions that qualify for this market
    displayPredictions = fixture.modelPredictions.filter(prediction => {
      const qualifiedMarkets = getQualifiedMarkets(prediction);
      return qualifiedMarkets.some(qm => qm.key === market);
    });
  } else if (mode === 'model' && selectedModel) {
    // Show only the selected model
    displayPredictions = fixture.modelPredictions.filter(
      p => p.aiModel.name === selectedModel
    );
  }
  
  const detailsUrl = `/matches/${fixture.id}?ref=${mode}${market ? `&market=${market}` : ''}${selectedModel ? `&model=${selectedModel}` : ''}`;
  
  return (
    <Link
      href={detailsUrl}
      className={cn(
        "block bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 hover:bg-gray-700 transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg group cursor-pointer",
        className
      )}
    >
      {/* Mobile Layout: Stacked */}
      <div className="md:hidden space-y-3">
        {/* Top Row: Time and Teams */}
        <div className="flex items-center justify-between">
          {/* Time */}
          <div className="text-center">
            <div className="text-xs font-medium text-white transition-colors">{matchTime}</div>
          </div>
          
          {/* Teams */}
          <div className="flex-1 mx-3">
            {/* Home Team */}
            <div className="flex items-center space-x-2 mb-1">
              <div className="w-4 h-4 relative flex-shrink-0">
                <Image
                  src={fixture.hometeamlogo}
                  alt={`${fixture.hometeam} logo`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="%23374151"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="14">🌍</text></svg>`;
                  }}
                />
              </div>
              <span className="text-xs font-medium text-white truncate transition-colors">{fixture.hometeam}</span>
            </div>

            {/* Away Team */}
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 relative flex-shrink-0">
                <Image
                  src={fixture.awayteamlogo}
                  alt={`${fixture.awayteam} logo`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="%23374151"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="14">🌍</text></svg>`;
                  }}
                />
              </div>
              <span className="text-xs font-medium text-white truncate transition-colors">{fixture.awayteam}</span>
            </div>
          </div>
          
          {/* Arrow Icon */}
          <div className="text-center">
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
          </div>
        </div>
        
        {/* Bottom Row: Predictions (2 per row) */}
        <div>
          {mode === 'model' && selectedModel ? (
            // Model page: Show individual market predictions
            <div className="grid grid-cols-2 gap-2">
              {(() => {
                const prediction = displayPredictions[0];
                if (!prediction) return null;

                const qualifiedMarkets = getQualifiedMarkets(prediction);
                return qualifiedMarkets.slice(0, 4).map((qm) => (
                  <div
                    key={qm.key}
                    className="bg-gray-700 rounded-lg px-2 py-2 text-center border border-gray-600 hover:bg-gray-600 hover:border-gray-500 transition-all duration-200"
                  >
                    <div className="text-xs font-bold text-white whitespace-nowrap">
                      {qm.name}
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            // Homepage, market, country pages: Show predictions with model names on mobile
            <div className="grid grid-cols-2 gap-2">
              {displayPredictions.slice(0, 4).map((prediction) => (
                <div
                  key={prediction.aiModel.name}
                  className="bg-gray-700 rounded-lg px-2 py-2 text-center border border-gray-600 hover:bg-gray-600 hover:border-gray-500 transition-all duration-200"
                >
                  <div className="text-xs text-gray-300 mb-1 font-semibold leading-tight">
                    {prediction.aiModel.name}
                  </div>
                  <div className="text-xs font-bold text-white transition-colors text-center leading-tight">
                    {mode === 'homepage' || (mode === 'market' && !market?.includes('over') && !market?.includes('under')) ? (
                      `${prediction.predictedHomeGoal}-${prediction.predictedAwayGoal}`
                    ) : mode === 'market' && market ? (
                      getMarketDisplayValue(prediction, market)
                    ) : (
                      `${prediction.predictedHomeGoal}-${prediction.predictedAwayGoal}`
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout: Original Grid */}
      <div className="hidden md:grid md:grid-cols-[60px_1fr_320px_20px] gap-6 items-center">
        {/* Time */}
        <div className="text-center">
          <div className="text-sm font-medium text-white transition-colors">{matchTime}</div>
        </div>
        
        {/* Teams */}
        <div className="min-w-0">
          {/* Home Team */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-5 h-5 relative flex-shrink-0">
              <Image
                src={fixture.hometeamlogo}
                alt={`${fixture.hometeam} logo`}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="%23374151"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="14">🌍</text></svg>`;
                }}
              />
            </div>
            <span className="text-sm font-medium text-white truncate transition-colors">{fixture.hometeam}</span>
          </div>

          {/* Away Team */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 relative flex-shrink-0">
              <Image
                src={fixture.awayteamlogo}
                alt={`${fixture.awayteam} logo`}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="12" fill="%23374151"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="14">🌍</text></svg>`;
                }}
              />
            </div>
            <span className="text-sm font-medium text-white truncate transition-colors">{fixture.awayteam}</span>
          </div>
        </div>
        
        {/* Predictions - Context-Aware Cards */}
        <div>
          {mode === 'model' && selectedModel ? (
            // Model page: Show individual market predictions
            <div className="flex gap-2 flex-wrap">
              {(() => {
                const prediction = displayPredictions[0];
                if (!prediction) return null;

                const qualifiedMarkets = getQualifiedMarkets(prediction);
                return qualifiedMarkets.map((qm) => (
                  <div
                    key={qm.key}
                    className="bg-gray-700 rounded-lg px-3 py-2 text-center min-w-[100px] border border-gray-600 hover:bg-gray-600 hover:border-gray-500 transition-all duration-200"
                  >
                    <div className="text-xs font-bold text-white whitespace-nowrap">
                      {qm.name}
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            // Homepage, market, country pages: Use Grid for Perfect Alignment
            <div className={`grid gap-3 ${mode === 'market' ? 'grid-cols-[1fr_1fr_1fr_1fr] max-w-[400px]' : 'grid-cols-4'}`}>
              {displayPredictions.slice(0, 4).map((prediction) => (
                <div
                  key={prediction.aiModel.name}
                  className={`bg-gray-700 rounded-lg text-center border border-gray-600 hover:bg-gray-600 hover:border-gray-500 transition-all duration-200 flex flex-col items-center justify-center ${
                    mode === 'market' ? 'px-4 py-4 min-w-[90px]' : 'px-3 py-3'
                  }`}
                >
                  {mode === 'market' && (
                    <div className="text-xs text-gray-300 mb-1 font-semibold leading-tight whitespace-nowrap">
                      {prediction.aiModel.name}
                    </div>
                  )}
                  <div className={`text-sm font-bold text-white transition-colors text-center leading-tight whitespace-nowrap ${mode === 'market' ? '' : 'mt-1'}`}>
                    {mode === 'homepage' || (mode === 'market' && !market?.includes('over') && !market?.includes('under')) ? (
                      `${prediction.predictedHomeGoal}-${prediction.predictedAwayGoal}`
                    ) : mode === 'market' && market ? (
                      getMarketDisplayValue(prediction, market)
                    ) : (
                      `${prediction.predictedHomeGoal}-${prediction.predictedAwayGoal}`
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Arrow Icon */}
        <div className="text-center">
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
        </div>
      </div>
    </Link>
  );
}
