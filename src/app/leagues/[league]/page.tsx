'use client';

import React, { useState, useMemo, use } from 'react';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import DatePicker from '@/components/ui/DatePicker';
import MatchCard from '@/components/ui/MatchCard';
import MatchHeader from '@/components/ui/MatchHeader';
import { getCountryFlag } from '@/utils/countries';
import { isMatchOnDate } from '@/utils/date';
import { mockFixtures } from '@/data/mock';
import { API_CONFIG } from '@/config/api';

// API Endpoints
const LEAGUE_API = API_CONFIG.ENDPOINTS.HOMEPAGE;

interface LeaguePageProps {
  params: Promise<{
    league: string;
  }>;
}

export default function LeaguePage({ params }: LeaguePageProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
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
    const fixture = mockFixtures.find(f => 
      f.league.toLowerCase().replace(/\s+/g, '-') === leagueSlug
    );
    return fixture?.league || leagueName;
  }, [leagueSlug, leagueName]);

  // Filter fixtures for this league and date
  const filteredFixtures = useMemo(() => {
    return mockFixtures.filter(fixture => 
      fixture.league.toLowerCase().replace(/\s+/g, '-') === leagueSlug &&
      isMatchOnDate(fixture.time, selectedDate)
    );
  }, [leagueSlug, selectedDate]);

  // Get country for this league
  const leagueCountry = filteredFixtures.length > 0 ? filteredFixtures[0].country : '';
  
  // Check if league exists in our data
  const leagueExists = mockFixtures.some(fixture => 
    fixture.league.toLowerCase().replace(/\s+/g, '-') === leagueSlug
  );

  if (!leagueExists) {
    return (
      <MainLayout>
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
    <MainLayout>
      <main className="p-3 lg:p-4">
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
        <MatchHeader mode="homepage" />

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
