'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import DatePicker from '@/components/ui/DatePicker';
import MatchCard from '@/components/ui/MatchCard';
import { getCountryFlag } from '@/utils/countries';
import { isMatchOnDate } from '@/utils/date';
import { mockFixtures, mockAiModels } from '@/data/mock';
import { buildApiUrl, API_CONFIG } from '@/config/api';
import { Brain, Bot } from 'lucide-react';

// API Endpoints  
const HOMEPAGE_API = API_CONFIG.ENDPOINTS.HOMEPAGE;

export default function ModelPage() {
  const params = useParams();
  const modelParam = params.model as string;
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Capitalize model name for display
  const modelName = modelParam.charAt(0).toUpperCase() + modelParam.slice(1);
  
  // Find model info
  const modelInfo = mockAiModels.find(m => 
    m.name.toLowerCase() === modelParam.toLowerCase()
  );
  
  // Filter fixtures by date and model
  const filteredFixtures = useMemo(() => {
    return mockFixtures
      .filter(fixture => isMatchOnDate(fixture.time, selectedDate))
      .map(fixture => ({
        ...fixture,
        modelPredictions: fixture.modelPredictions.filter(
          prediction => prediction.aiModel.name.toLowerCase() === modelParam.toLowerCase()
        )
      }))
      .filter(fixture => fixture.modelPredictions.length > 0);
  }, [selectedDate, modelParam]);
  
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
  

  
  if (!modelInfo) {
    return (
      <MainLayout>
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
    <MainLayout>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            {modelName === 'Bangabot' ? (
              <Bot className="h-8 w-8 text-blue-500" />
            ) : (
              <Brain className="h-8 w-8 text-blue-500" />
            )}
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
