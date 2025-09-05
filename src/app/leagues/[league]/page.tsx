'use client';

import React, { useMemo, use } from 'react';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import DatePicker from '@/components/ui/DatePicker';
import MatchCard from '@/components/ui/MatchCard';
import MatchHeader from '@/components/ui/MatchHeader';
import { getCountryFlag } from '@/utils/countries';
import { isMatchOnDate } from '@/utils/date';
import { useFixtures } from '@/contexts/FixturesContext';

interface LeaguePageProps {
  params: Promise<{
    league: string;
  }>;
}

export default function LeaguePage({ params }: LeaguePageProps) {
  const { fixtures, loading, selectedDate, setSelectedDate } = useFixtures();
  
  // Unwrap the async params
  const resolvedParams = use(params);
  const leagueSlug = resolvedParams.league;
  
  // Convert URL slug back to league name
  const leagueName = leagueSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');


  // Find matching league name from fixtures
  const actualLeagueName = useMemo(() => {
    const fixture = fixtures.find(f => 
      f.league.toLowerCase().replace(/\s+/g, '-') === leagueSlug
    );
    return fixture?.league || leagueName;
  }, [fixtures, leagueSlug, leagueName]);

  // Filter fixtures for this league and date
  const filteredFixtures = useMemo(() => {
    return fixtures.filter(fixture => 
      fixture.league.toLowerCase().replace(/\s+/g, '-') === leagueSlug &&
      isMatchOnDate(fixture.time, selectedDate)
    );
  }, [fixtures, leagueSlug, selectedDate]);

  // Get country for this league
  const leagueCountry = filteredFixtures.length > 0 ? filteredFixtures[0].country : '';
  
  // Loading state
  if (loading) {
    return (
      <MainLayout fixtures={[]}>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">Loading {actualLeagueName} matches...</div>
          <p className="text-sm text-gray-500">Please wait while we fetch the latest data</p>
        </div>
      </MainLayout>
    );
  }

  // Check if league exists in our data
  const leagueExists = fixtures.some(fixture => 
    fixture.league.toLowerCase().replace(/\s+/g, '-') === leagueSlug
  );

  if (!leagueExists) {
    return (
      <MainLayout fixtures={fixtures}>
        <div className="text-center py-12">
          <div className="text-red-400 mb-2">League not found</div>
          <p className="text-sm text-gray-500">
            No matches found for {leagueName}
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout fixtures={fixtures}>
      <main className="p-3 lg:p-4">
        {/* Disclaimer */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-6">
          <p className="text-xs text-blue-300 text-center">
            AI predictions generated using multiple model APIs with our data and algorithms.
          </p>
        </div>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            {leagueCountry && (
              <span className="text-2xl">
                {getCountryFlag(leagueCountry)}
              </span>
            )}
            <div>
              <h1 className="text-lg lg:text-xl font-bold text-white mb-1">
                {actualLeagueName}
              </h1>
              <p className="text-sm text-gray-400">
                {leagueCountry} • {filteredFixtures.length} match{filteredFixtures.length !== 1 ? 'es' : ''} on {format(new Date(selectedDate), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* AI Models Header - Using MatchHeader for perfect alignment */}
        <MatchHeader mode="country" />

        {/* Matches */}
        <div className="space-y-2">
          {filteredFixtures.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">No matches found for {actualLeagueName}</div>
              <p className="text-sm text-gray-500">
                Try selecting a different date or check back later
              </p>
            </div>
          ) : (
            filteredFixtures.map((fixture) => (
              <MatchCard
                key={fixture.id}
                fixture={fixture}
                mode="homepage"
              />
            ))
          )}
        </div>
      </main>
    </MainLayout>
  );
}
