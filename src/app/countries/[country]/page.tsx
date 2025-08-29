'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import DatePicker from '@/components/ui/DatePicker';
import MatchCard from '@/components/ui/MatchCard';
import MatchHeader from '@/components/ui/MatchHeader';
import { getCountryFlag } from '@/utils/countries';
import { isMatchOnDate } from '@/utils/date';
import { mockFixtures } from '@/data/mock';
// Removed unused imports
import { ArrowLeft, Pin, PinOff } from 'lucide-react';

// API endpoints would be used here in production

export default function CountryPage() {
  const params = useParams();
  const countrySlug = params.country as string;
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [pinnedLeagues, setPinnedLeagues] = useState<string[]>([]);
  
  // Convert slug back to country name
  const countryName = countrySlug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  // Load pinned leagues from session storage
  React.useEffect(() => {
    const saved = sessionStorage.getItem('pinnedLeagues');
    if (saved) {
      setPinnedLeagues(JSON.parse(saved));
    }
  }, []);
  
  // Filter fixtures by country and date
  const filteredFixtures = useMemo(() => {
    return mockFixtures.filter(fixture => 
      fixture.country.toLowerCase() === countryName.toLowerCase() &&
      isMatchOnDate(fixture.time, selectedDate)
    );
  }, [countryName, selectedDate]);
  
  // Group fixtures by league with pinning logic
  const groupedFixtures = useMemo(() => {
    const groups: Record<string, typeof filteredFixtures> = {};
    
    filteredFixtures.forEach(fixture => {
      if (!groups[fixture.league]) {
        groups[fixture.league] = [];
      }
      groups[fixture.league].push(fixture);
    });
    
    // Sort leagues: pinned first, then alphabetical
    const sortedGroups = Object.entries(groups).sort(([leagueA], [leagueB]) => {
      const isPinnedA = pinnedLeagues.includes(leagueA);
      const isPinnedB = pinnedLeagues.includes(leagueB);
      
      // Pinned leagues first
      if (isPinnedA && !isPinnedB) return -1;
      if (!isPinnedA && isPinnedB) return 1;
      
      // Alphabetical
      return leagueA.localeCompare(leagueB);
    });
    
    return sortedGroups.map(([league, fixtures]) => ({ league, fixtures }));
  }, [filteredFixtures, pinnedLeagues]);
  
  // Toggle pinned league
  const togglePinnedLeague = (leagueName: string) => {
    const updated = pinnedLeagues.includes(leagueName)
      ? pinnedLeagues.filter(l => l !== leagueName)
      : [...pinnedLeagues, leagueName];
    
    setPinnedLeagues(updated);
    sessionStorage.setItem('pinnedLeagues', JSON.stringify(updated));
  };
  
  // Check if country exists in our data
  const countryExists = mockFixtures.some(fixture => 
    fixture.country.toLowerCase() === countryName.toLowerCase()
  );
  
  if (!countryExists) {
    return (
      <MainLayout>
        <div className="mb-6">
          <Link
            href="/countries"
            className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Countries</span>
          </Link>
        </div>
        
        <div className="text-center py-12">
          <div className="text-red-400 mb-2">Country not found</div>
          <p className="text-sm text-gray-500">
            No matches found for {countryName}
          </p>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/countries"
          className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Countries</span>
        </Link>
      </div>
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-4xl">
              {getCountryFlag(countryName)}
            </span>
            <h1 className="text-2xl font-bold text-white">
              {countryName} Matches
            </h1>
          </div>
          <p className="text-gray-400">
            Football predictions from leagues in {countryName}
          </p>
        </div>
        
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
      
      {/* AI Models Header - Using MatchHeader for perfect alignment */}
      <MatchHeader mode="country" />

      {/* Matches by League */}
      <div className="space-y-8">
        {groupedFixtures.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              No matches found for {countryName} on this date
            </div>
            <p className="text-sm text-gray-500">
              Try selecting a different date or check back later
            </p>
          </div>
        ) : (
          groupedFixtures.map(({ league, fixtures }) => (
            <div key={league} className="space-y-4">
              {/* League Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {league}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {fixtures.length} match{fixtures.length !== 1 ? 'es' : ''}
                    </p>
                  </div>
                  {pinnedLeagues.includes(league) && (
                    <Pin className="h-4 w-4 text-yellow-400 fill-current" />
                  )}
                </div>
                
                <button
                  onClick={() => togglePinnedLeague(league)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  {pinnedLeagues.includes(league) ? (
                    <>
                      <PinOff className="h-4 w-4" />
                      <span className="text-sm">Unpin</span>
                    </>
                  ) : (
                    <>
                      <Pin className="h-4 w-4" />
                      <span className="text-sm">Pin</span>
                    </>
                  )}
                </button>
              </div>
              
              {/* Matches */}
              <div className="space-y-2">
                {fixtures.map((fixture) => (
                  <MatchCard
                    key={fixture.id}
                    fixture={fixture}
                    mode="homepage"
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
