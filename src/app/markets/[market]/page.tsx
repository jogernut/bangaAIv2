'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import DatePicker from '@/components/ui/DatePicker';
import MatchCard from '@/components/ui/MatchCard';
import { getCountryFlag } from '@/utils/countries';
import { isMatchOnDate } from '@/utils/date';
import { filterPredictionsByMarket } from '@/utils/markets';
import { mockMarkets } from '@/data/mock';
import { useFixtures } from '@/contexts/FixturesContext';
// Removed unused imports
import { TrendingUp } from 'lucide-react';

export default function MarketPage() {
  const params = useParams();
  const market = params.market as string;
  const { fixtures, loading, error, selectedDate, setSelectedDate } = useFixtures();
  
  // Find market info
  const marketInfo = mockMarkets.find(m => m.key === market);

  
  // Filter fixtures by date and market
  const filteredFixtures = useMemo(() => {
    return fixtures
      .filter(fixture => isMatchOnDate(fixture.time, selectedDate))
      .map(fixture => ({
        ...fixture,
        modelPredictions: filterPredictionsByMarket(fixture.modelPredictions, market)
      }))
      .filter(fixture => fixture.modelPredictions.length > 0); // Only show matches with qualifying predictions
  }, [fixtures, selectedDate, market]);
  
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

  if (loading) {
    return (
      <MainLayout fixtures={[]}>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-gray-400 mb-2">Loading {marketInfo?.name || market} predictions...</div>
          <p className="text-sm text-gray-500">Please wait while we fetch the latest data</p>
        </div>
      </MainLayout>
    );
  }
  
  if (!marketInfo) {
    return (
      <MainLayout fixtures={fixtures}>
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
          groupedFixtures.map(({ country, league, fixtures }, index) => (
            <div key={`${country}-${league}-${index}`} className="space-y-4">
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
