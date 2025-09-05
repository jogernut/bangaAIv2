'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import DatePicker from '@/components/ui/DatePicker';
import { getCountryFlag } from '@/utils/countries';
import { isMatchOnDate } from '@/utils/date';
import { mockFixtures, getUniqueLeagues } from '@/data/mock';
// import { sortLeaguesByPriority } from '@/config/priorities'; // Will be used for sorting
// Removed unused import
import Link from 'next/link';

// API endpoints would be used here in production

export default function LeaguesPage() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Get all unique leagues from fixtures
  const allLeaguesData = getUniqueLeagues(mockFixtures);
  // const allLeagueNames = allLeaguesData.map(l => l.league); // Will be used for sorting
  // const sortedLeagues = sortLeaguesByPriority(allLeagueNames); // Will be used when implementing sorting

  // Group leagues by country
  const leaguesByCountry = allLeaguesData.reduce((acc, { country, league }) => {
    if (!acc[country]) acc[country] = [];
    acc[country].push(league);
    return acc;
  }, {} as Record<string, string[]>);

  // Sort countries and leagues within each country
  const sortedCountries = Object.keys(leaguesByCountry).sort();

  return (
    <MainLayout fixtures={mockFixtures}>
      <main className="p-3 lg:p-4">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-lg lg:text-xl font-bold text-white mb-1">
              All Leagues
            </h1>
            <p className="text-sm text-gray-400">
              Browse matches by league and country
            </p>
          </div>
          
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        {/* Leagues by Country */}
        <div className="space-y-8">
          {sortedCountries.map((country) => (
            <div key={country} className="space-y-4">
              {/* Country Header */}
              <div className="flex items-center space-x-3">
                <span className="text-2xl">
                  {getCountryFlag(country)}
                </span>
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-white">
                    {country}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {leaguesByCountry[country].length} league{leaguesByCountry[country].length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Leagues Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {leaguesByCountry[country].map((league) => {
                  const leagueFixtures = mockFixtures.filter(
                    f => f.league === league && isMatchOnDate(f.time, selectedDate)
                  );
                  
                  return (
                    <Link
                      key={league}
                      href={`/leagues/${league.toLowerCase().replace(/\s+/g, '-')}`}
                      className="rounded-lg p-4 transition-all duration-200 group bg-gray-800 border border-gray-700 hover:border-gray-600 hover:bg-gray-750"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-lg">
                          {getCountryFlag(country)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate transition-colors text-gray-900 group-hover:text-blue-400">
                            {league}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-400">
                        {leagueFixtures.length} match{leagueFixtures.length !== 1 ? 'es' : ''} today
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {sortedCountries.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">No leagues found</div>
            <p className="text-sm text-gray-500">
              Try selecting a different date or check back later
            </p>
          </div>
        )}
      </main>
    </MainLayout>
  );
}
