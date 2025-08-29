'use client';

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import MainLayout from '@/components/layout/MainLayout';
import DatePicker from '@/components/ui/DatePicker';
import MatchCard from '@/components/ui/MatchCard';
import MatchHeader from '@/components/ui/MatchHeader';
import { cn } from '@/utils/cn';
import { getCountryFlag } from '@/utils/countries';
import { isMatchOnDate } from '@/utils/date';
import { mockFixtures, mockTopLeagues } from '@/data/mock';
import { API_CONFIG } from '@/config/api';
import { Pin, PinOff } from 'lucide-react';

// API Endpoints
const HOMEPAGE_API = API_CONFIG.ENDPOINTS.HOMEPAGE;

export default function HomePage() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [pinnedLeagues, setPinnedLeagues] = useState<string[]>([]);
  
  // Load pinned leagues from session storage
  React.useEffect(() => {
    const saved = sessionStorage.getItem('pinnedLeagues');
    if (saved) {
      setPinnedLeagues(JSON.parse(saved));
    }
  }, []);
  
  // Filter fixtures by selected date
  const filteredFixtures = useMemo(() => {
    return mockFixtures.filter(fixture => 
      isMatchOnDate(fixture.time, selectedDate)
    );
  }, [selectedDate]);
  
  // Group fixtures by country and league with priority and pinning logic
  const groupedFixtures = useMemo(() => {
    const groups: Record<string, typeof filteredFixtures> = {};
    
    filteredFixtures.forEach(fixture => {
      const key = `${fixture.country}-${fixture.league}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(fixture);
    });
    
    // Sort groups: pinned leagues first, then priority leagues, then alphabetical
    const sortedGroups = Object.entries(groups).sort(([keyA], [keyB]) => {
      const [countryA, leagueA] = keyA.split('-');
      const [countryB, leagueB] = keyB.split('-');
      
      const isPinnedA = pinnedLeagues.includes(leagueA);
      const isPinnedB = pinnedLeagues.includes(leagueB);
      
      // Pinned leagues first
      if (isPinnedA && !isPinnedB) return -1;
      if (!isPinnedA && isPinnedB) return 1;
      
      // Priority leagues next (if not pinned)
      if (!isPinnedA && !isPinnedB) {
        const isPriorityA = mockTopLeagues.some(tl => tl.name === leagueA);
        const isPriorityB = mockTopLeagues.some(tl => tl.name === leagueB);
        
        if (isPriorityA && !isPriorityB) return -1;
        if (!isPriorityA && isPriorityB) return 1;
      }
      
      // Alphabetical by country then league
      if (countryA !== countryB) {
        return countryA.localeCompare(countryB);
      }
      return leagueA.localeCompare(leagueB);
    });
    
    return sortedGroups.map(([key, fixtures]) => {
      const [country, league] = key.split('-');
      return { country, league, fixtures };
    });
  }, [filteredFixtures, pinnedLeagues]);
  
  // Toggle pinned league
  const togglePinnedLeague = (leagueName: string) => {
    const updated = pinnedLeagues.includes(leagueName)
      ? pinnedLeagues.filter(l => l !== leagueName)
      : [...pinnedLeagues, leagueName];
    
    setPinnedLeagues(updated);
    sessionStorage.setItem('pinnedLeagues', JSON.stringify(updated));
  };
  
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-3 lg:space-y-0">
        <div>
          <h1 className="text-lg lg:text-xl font-bold text-white mb-1">
            Football Predictions
          </h1>
          <p className="text-sm text-gray-400">
            AI-powered predictions by the best models
          </p>
        </div>
        
        <DatePicker
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      </div>
      
            {/* AI Models Header - Using MatchHeader for perfect alignment */}
      <MatchHeader mode="homepage" />

      {/* Matches by League */}
      <div className="space-y-6">
        {groupedFixtures.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">No matches found for this date</div>
            <p className="text-sm text-gray-500">
              Try selecting a different date or check back later
            </p>
          </div>
        ) : (
          groupedFixtures.map(({ country, league, fixtures }) => (
            <div key={`${country}-${league}`} className="space-y-3">
              {/* League Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">
                    {getCountryFlag(country)}
                  </span>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg sm:text-xl font-semibold text-white">
                        {league}
                      </h2>
                      <button
                        onClick={() => togglePinnedLeague(league)}
                        className={cn(
                          "p-1.5 rounded-full transition-all duration-200 transform hover:scale-110",
                          pinnedLeagues.includes(league)
                            ? "bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30"
                            : "text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10"
                        )}
                        title={pinnedLeagues.includes(league) ? "Unpin league" : "Pin league"}
                      >
                        <Pin className={cn(
                          "h-4 w-4 transition-all duration-200",
                          pinnedLeagues.includes(league) && "fill-current"
                        )} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">{country}</p>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  {fixtures.length} match{fixtures.length !== 1 ? 'es' : ''}
                </div>
              </div>
              
              {/* Matches List - Single column for horizontal cards */}
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
