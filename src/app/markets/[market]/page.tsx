'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import DatePicker from '@/components/ui/DatePicker';
import MatchCard from '@/components/ui/MatchCard';
import { getCountryFlag } from '@/utils/countries';
import { isMatchOnDate } from '@/utils/date';
import { filterPredictionsByMarket } from '@/utils/markets';
import { mockFixtures, mockMarkets } from '@/data/mock';
import { buildApiUrl, API_CONFIG } from '@/config/api';
import { TrendingUp } from 'lucide-react';

// API Endpoints
const MARKETS_API = API_CONFIG.ENDPOINTS.MARKETS;

export default function MarketPage() {
  const params = useParams();
  const market = params.market as string;
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  // Find market info
  const marketInfo = mockMarkets.find(m => m.key === market);
  
  // Filter fixtures by date and market
  const filteredFixtures = useMemo(() => {
    return mockFixtures
      .filter(fixture => isMatchOnDate(fixture.time, selectedDate))
      .map(fixture => ({
        ...fixture,
        modelPredictions: filterPredictionsByMarket(fixture.modelPredictions, market)
      }))
      .filter(fixture => fixture.modelPredictions.length > 0); // Only show matches with qualifying predictions
  }, [selectedDate, market]);
  
  // Group fixtures by country and league, then sort by model count
  const groupedFixtures = useMemo(() => {
    const groups: Record<string, typeof filteredFixtures> = {};
    
    // First sort individual fixtures by number of qualifying model predictions (highest first)
    const sortedFixtures = [...filteredFixtures].sort((a, b) => {
      return b.modelPredictions.length - a.modelPredictions.length;
    });
    
    sortedFixtures.forEach(fixture => {
      const key = `${fixture.country}-${fixture.league}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(fixture);
    });
    
    return Object.entries(groups)
      .sort(([keyA, fixturesA], [keyB, fixturesB]) => {
        // Sort groups by total number of model predictions (highest first)
        const totalModelsA = fixturesA.reduce((sum, f) => sum + f.modelPredictions.length, 0);
        const totalModelsB = fixturesB.reduce((sum, f) => sum + f.modelPredictions.length, 0);
        
        if (totalModelsA !== totalModelsB) {
          return totalModelsB - totalModelsA; // Highest model count first
        }
        
        // If same model count, sort by country then league
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
  
  if (!marketInfo) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="text-red-400 mb-2">Market not found</div>
          <p className="text-sm text-gray-500">
            The requested market does not exist
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
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">
              {marketInfo.name} Predictions
            </h1>
          </div>
          <p className="text-gray-400">
            {marketInfo.description} - AI predictions that qualify for this market
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
              No matches qualify for {marketInfo.name} on this date
            </div>
            <p className="text-sm text-gray-500">
              Try selecting a different date or check other markets
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
                    mode="market"
                    market={market}
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
