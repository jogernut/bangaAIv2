import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import type { Metadata } from "next";
import MainLayout from '@/components/layout/MainLayout';
import DatePicker from '@/components/ui/DatePicker';
import MatchCard from '@/components/ui/MatchCard';
import { getCountryFlag } from '@/utils/countries';
import { isMatchOnDate } from '@/utils/date';
import { mockAiModels } from '@/data/mock';
import { useFixtures } from '@/contexts/FixturesContext';
// Removed unused imports
import { Brain, Bot } from 'lucide-react';

type Props = {
  params: { model: string }
}

export function generateMetadata({ params }: Props): Metadata {
  const modelParam = params.model;
  let modelName = modelParam.charAt(0).toUpperCase() + modelParam.slice(1);

  // Handle special cases
  if (modelParam.toLowerCase() === 'chatgpt') {
    modelName = 'ChatGPT';
  } else if (modelParam.toLowerCase() === 'grok') {
    modelName = 'Grok';
  } else if (modelParam.toLowerCase() === 'ml') {
    modelName = 'ML';
  } else if (modelParam.toLowerCase() === 'gemini') {
    modelName = 'Gemini';
  }

  const modelDescriptions = {
    'Gemini': 'Get the most accurate football predictions powered by Google\'s Gemini AI model',
    'ChatGPT': 'Advanced football predictions using OpenAI\'s ChatGPT for professional betting analysis',
    'Grok': 'Cutting-edge soccer predictions powered by xAI\'s Grok AI technology',
    'ML': 'Machine learning powered football predictions with statistical analysis'
  };

  return {
    title: `${modelName} AI Football Predictions - Banga.ai`,
    description: modelDescriptions[modelName as keyof typeof modelDescriptions] || `AI-powered football predictions using ${modelName} technology`,
    keywords: [
      `${modelName} football predictions`,
      `${modelName} AI soccer tips`,
      `${modelName} match predictions`,
      `${modelName} betting analysis`,
      `AI ${modelName} football`,
      `${modelName} soccer predictions`
    ],
    openGraph: {
      title: `${modelName} AI Football Predictions - Banga.ai`,
      description: modelDescriptions[modelName as keyof typeof modelDescriptions] || `AI-powered football predictions using ${modelName} technology`,
      type: "website",
      url: `https://banga.ai/models/${modelParam}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${modelName} AI Football Predictions`,
      description: modelDescriptions[modelName as keyof typeof modelDescriptions] || `AI-powered football predictions using ${modelName} technology`,
    },
  };
}

export default function ModelPage() {
  const params = useParams();
  const modelParam = params.model as string;
  const { fixtures, loading, selectedDate, setSelectedDate } = useFixtures();
  
  // Capitalize model name for display, but ensure it matches API format
  let modelName = modelParam.charAt(0).toUpperCase() + modelParam.slice(1);

  // Handle special cases to match API format
  if (modelParam.toLowerCase() === 'chatgpt') {
    modelName = 'ChatGPT';
  } else if (modelParam.toLowerCase() === 'grok') {
    modelName = 'Grok';
  } else if (modelParam.toLowerCase() === 'ml') {
    modelName = 'ML';
  } else if (modelParam.toLowerCase() === 'gemini') {
    modelName = 'Gemini';
  }

  
  // Find model info
  const modelInfo = mockAiModels.find(m => 
    m.name.toLowerCase() === modelParam.toLowerCase()
  );
  
  // Filter fixtures by date and model
  const filteredFixtures = useMemo(() => {
    console.log(`🔍 Filtering fixtures for model: "${modelParam}"`);
    console.log(`📅 Selected date: ${selectedDate}`);
    console.log(`📊 Total fixtures available: ${fixtures.length}`);
    
    // Debug: Show some sample fixture dates (only for problematic models)
    if ((modelParam === 'chatgpt' || modelParam === 'grok') && fixtures.length > 0) {
      const sampleDates = fixtures.slice(0, 3).map(f => f.time);
      console.log(`🗓️ Sample fixture dates for ${modelParam}:`, sampleDates);
    }
    
    const dateFiltered = fixtures.filter(fixture => isMatchOnDate(fixture.time, selectedDate));
    console.log(`📅 Fixtures matching date: ${dateFiltered.length}`);
    
    const modelFiltered = dateFiltered.map(fixture => ({
      ...fixture,
      modelPredictions: fixture.modelPredictions.filter(
        prediction => {
          const apiModelName = prediction.aiModel.name;
          const matches = apiModelName.toLowerCase() === modelName.toLowerCase();

          if (!matches && (apiModelName === 'ChatGPT' || apiModelName === 'Grok') && modelParam === 'chatgpt') {
            console.log(`❌ Model filter mismatch: "${apiModelName}" vs "${modelName}"`);
          }

          return matches;
        }
      )
    })).filter(fixture => fixture.modelPredictions.length > 0);
    
    console.log(`🤖 Final fixtures with ${modelParam} predictions: ${modelFiltered.length}`);
    
    return modelFiltered;
  }, [fixtures, selectedDate, modelParam, modelName]);
  
  // Group fixtures by country and league
  const groupedFixtures = useMemo(() => {
    const groups: Record<string, typeof filteredFixtures> = {};
    
    filteredFixtures.forEach(fixture => {
      const key = `${fixture.country}-${fixture.league}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(fixture);
    });
    
    return Object.entries(groups)
      .sort(([keyA], [keyB]) => {
        const [countryA, leagueA] = keyA.split('-');
        const [countryB, leagueB] = keyB.split('-');
        
        if (countryA !== countryB) {
          return countryA.localeCompare(countryB);
        }
        return leagueA.localeCompare(leagueB);
      })
      .map(([key, fixtures]) => {
        const [country, league] = key.split('-');
        return { country, league, fixtures };
      });
  }, [filteredFixtures]);

  if (loading) {
    return (
      <MainLayout fixtures={[]}>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-gray-400 mb-2">Loading {modelName} predictions...</div>
          <p className="text-sm text-gray-500">Please wait while we fetch the latest data</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!modelInfo) {
    return (
      <MainLayout fixtures={fixtures}>
        <div className="text-center py-12">
          <div className="text-red-400 mb-2">Model not found</div>
          <p className="text-sm text-gray-500">
            The requested AI model does not exist
          </p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout fixtures={fixtures}>
      {/* Disclaimer */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-6">
        <p className="text-xs text-blue-300 text-center">
          AI predictions generated using multiple model APIs with our data and algorithms.
        </p>
      </div>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            {(() => {
              // Model-based color scheme
              const getModelColor = (modelName: string) => {
                const colors = {
                  'Gemini': 'text-blue-500',
                  'ChatGPT': 'text-green-500', 
                  'Grok': 'text-purple-500',
                  'ML': 'text-orange-500',
                  'Bangabot': 'text-blue-500'
                };
                return colors[modelName as keyof typeof colors] || 'text-blue-500';
              };
              
              const iconColor = getModelColor(modelName);
              
              return modelName === 'Bangabot' ? (
                <Bot className={`h-8 w-8 ${iconColor}`} />
              ) : (
                <Brain className={`h-8 w-8 ${iconColor}`} />
              );
            })()}
            <h1 className="text-2xl font-bold text-white">
              {modelName} Predictions
            </h1>
          </div>
          <p className="text-gray-400">
            Market predictions and qualified bets from {modelName} AI
          </p>
        </div>
        
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
      

      
      {/* Matches by League */}
      <div className="space-y-8">
        {groupedFixtures.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              No {modelName} predictions found for this date
            </div>
            <p className="text-sm text-gray-500">
              Try selecting a different date or check other models
            </p>
          </div>
        ) : (
          groupedFixtures.map(({ country, league, fixtures }) => (
            <div key={`${country}-${league}`} className="space-y-4">
              {/* League Header */}
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {getCountryFlag(country)}
                </span>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {league}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {country} • {fixtures.length} match{fixtures.length !== 1 ? 'es' : ''}
                  </p>
                </div>
              </div>
              
              {/* Matches */}
              <div className="space-y-2">
                {fixtures.map((fixture) => (
                  <MatchCard
                    key={fixture.id}
                    fixture={fixture}
                    mode="model"
                    selectedModel={modelName}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}
