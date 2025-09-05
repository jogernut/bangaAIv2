import React from 'react';
import { Fixture } from '@/data/mock';
import { isLogoAvailable } from '@/utils/markets';

interface MatchHeaderProps {
  mode: 'homepage' | 'market' | 'model' | 'country';
  models?: string[];
  fixtures?: Fixture[];
}

export default function MatchHeader({ mode, models = ['Gemini', 'ChatGPT', 'Grok', 'ML'], fixtures }: MatchHeaderProps) {
  return (
    <div className="hidden md:block bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-lg p-2 mb-3 sticky top-4 z-20 shadow-lg">
      {/* Use same grid as MatchCard for perfect alignment */}
      <div className="grid grid-cols-[50px_1fr_350px_16px] gap-4 items-center">
        {/* Time Column */}
        <div className="text-center">
          <div className="text-xs lg:text-xs text-gray-500 font-medium uppercase tracking-wider">Time</div>
        </div>

        {/* Teams Column */}
        <div className="flex items-center">
            {fixtures && fixtures.length > 0 && isLogoAvailable(fixtures[0].hometeamlogo) && (
              <div className="w-4 h-4 flex-shrink-0"></div>
            )}
            <div className={`${fixtures && fixtures.length > 0 && isLogoAvailable(fixtures[0].hometeamlogo) ? 'ml-2' : ''} text-xs lg:text-xs text-gray-500 font-medium uppercase tracking-wider`}>Teams</div>
          </div>

        {/* Predictions Header */}
        <div>
          {mode === 'model' ? (
            <div className="text-center">
              <div className="text-xs lg:text-xs text-gray-500 font-medium uppercase tracking-wider">Markets</div>
            </div>
          ) : (
            <div className={`grid gap-2 -ml-2 ${mode === 'market' ? 'grid-cols-4 max-w-[350px]' : 'grid-cols-4'}`}>
              {models.map((model) => {
                // Model-based color scheme matching MatchCard exactly
                const getModelColor = (modelName: string) => {
                  const colors = {
                    'Gemini': 'border-blue-500/50 bg-gradient-to-br from-gray-800/70 to-blue-900/30',
                    'ChatGPT': 'border-green-500/50 bg-gradient-to-br from-gray-800/70 to-green-900/30', 
                    'Grok': 'border-purple-500/50 bg-gradient-to-br from-gray-800/70 to-purple-900/30',
                    'ML': 'border-orange-500/50 bg-gradient-to-br from-gray-800/70 to-orange-900/30'
                  };
                  return colors[modelName as keyof typeof colors] || 'border-gray-400/50 bg-gray-800/70';
                };

                return (
                  <div
                    key={model}
                    className={`rounded-md text-center border flex flex-col items-center justify-center ${
                      mode === 'market' ? 'px-2 py-2 min-w-[70px]' : 'px-2 py-2'
                    } ${getModelColor(model)}`}
                  >
                    <div className="text-xs lg:text-xs text-gray-300 font-medium leading-tight">
                      {model}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Arrow Column */}
        <div className="text-center">
          <div className="text-xs text-gray-500">•</div>
        </div>
      </div>
    </div>
  );
}
