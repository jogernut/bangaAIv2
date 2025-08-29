import React from 'react';

interface MatchHeaderProps {
  mode: 'homepage' | 'market' | 'model' | 'country';
  models?: string[];
}

export default function MatchHeader({ mode, models = ['Gemini', 'ChatGPT', 'Grok', 'ML'] }: MatchHeaderProps) {
  return (
    <div className="hidden md:block bg-gray-100/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-800 rounded-lg p-3 mb-4">
      {/* Use same grid as MatchCard for perfect alignment */}
      <div className="grid grid-cols-[50px_1fr_240px_20px] md:grid-cols-[60px_1fr_320px_20px] gap-3 md:gap-6 items-center">
        {/* Time Column */}
        <div className="text-center">
          <div className="text-xs text-gray-600 dark:text-gray-500 font-medium uppercase tracking-wider">Time</div>
        </div>

        {/* Teams Column */}
        <div className="flex items-center">
            <div className="w-5 h-5 flex-shrink-0"></div>
            <div className="ml-2 text-xs text-gray-600 dark:text-gray-500 font-medium uppercase tracking-wider">Teams</div>
          </div>

        {/* Predictions Header */}
        <div>
          {mode === 'model' ? (
            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-500 font-medium uppercase tracking-wider">Markets</div>
            </div>
          ) : (
            <div className={`grid gap-1 md:gap-3 ${mode === 'market' ? 'grid-cols-2 md:grid-cols-[1fr_1fr_1fr_1fr] max-w-[400px]' : 'grid-cols-2 md:grid-cols-4'}`}>
              {models.map((model) => (
                <div
                  key={model}
                  className={`bg-gray-200/70 dark:bg-gray-800/70 rounded-md text-center border border-gray-400/50 dark:border-gray-700/50 flex flex-col items-center justify-center ${
                    mode === 'market' ? 'px-2 md:px-3 py-1 md:py-2 min-w-[60px] md:min-w-[80px]' : 'px-1 md:px-2 py-1 md:py-2'
                  }`}
                >
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium leading-tight">
                    {model}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Arrow Column */}
        <div className="text-center">
          <div className="text-xs text-gray-600 dark:text-gray-500">•</div>
        </div>
      </div>
    </div>
  );
}
