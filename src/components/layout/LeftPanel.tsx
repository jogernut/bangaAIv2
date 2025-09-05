'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pin, PinOff, Bot } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import { cn } from '@/utils/cn';
import { getCountryFlag } from '@/utils/countries';
import { mockMarkets, getUniqueLeagues, getUniqueCountries, type Fixture, mockFixtures } from '@/data/mock';
import { sortLeaguesByPriority, sortCountriesByPriority, MAX_PRIORITY_LEAGUES, MAX_PRIORITY_COUNTRIES } from '@/config/priorities';
import { API_CONFIG, buildApiUrl, shouldUseMockData } from '@/config/api';
import { transformFixtureModelNames } from '@/utils/models';
import { useFixtures } from '@/contexts/FixturesContext';

interface LeftPanelProps {
  fixtures: Fixture[]; // Keep for backwards compatibility but use homepage fixtures internally
}

export default function LeftPanel({ }: LeftPanelProps) {
  const pathname = usePathname();
  // const [searchQuery, setSearchQuery] = useState(''); // Will be used for search functionality
  const [pinnedLeagues, setPinnedLeagues] = useState<string[]>([]);
  const [leaguesToShow, setLeaguesToShow] = useState(MAX_PRIORITY_LEAGUES);
  const [countriesToShow, setCountriesToShow] = useState(MAX_PRIORITY_COUNTRIES);
  const [homepageFixtures, setHomepageFixtures] = useState<Fixture[]>(mockFixtures);
  const { selectedDate } = useFixtures();
  
  // Fetch homepage fixtures independently for the left menu
  useEffect(() => {
    const fetchHomepageFixtures = async () => {
      try {
        // Check if we should use mock data
        if (shouldUseMockData()) {
          setHomepageFixtures(mockFixtures);
          return;
        }

        // Build API URL for homepage fixtures - Convert date format from yyyy-MM-dd to MM/dd/yyyy
        const [year, month, day] = selectedDate.split('-');
        const apiDate = `${month}/${day}/${year}`;
        
        const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.HOMEPAGE, {
          date: apiDate
        });
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
        
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        
        const responseText = await response.text();
        if (!responseText.trim()) {
          throw new Error('API returned empty response');
        }
        
        const data = JSON.parse(responseText);
        const transformedFixtures = transformFixtureModelNames(data);
        setHomepageFixtures(transformedFixtures);
        
      } catch (err) {
        console.error('❌ LeftPanel: Failed to fetch homepage fixtures:', err);
        // Fallback to mock data
        setHomepageFixtures(mockFixtures);
      }
    };

    fetchHomepageFixtures();
  }, [selectedDate]);
  
  // Get pinned leagues from session storage on component mount
  useEffect(() => {
    const saved = sessionStorage.getItem('pinnedLeagues');
    if (saved) {
      setPinnedLeagues(JSON.parse(saved));
    }
  }, []);
  
  // Save pinned leagues to session storage
  const togglePinnedLeague = (leagueName: string) => {
    const updated = pinnedLeagues.includes(leagueName)
      ? pinnedLeagues.filter(l => l !== leagueName)
      : [...pinnedLeagues, leagueName];
    
    setPinnedLeagues(updated);
    sessionStorage.setItem('pinnedLeagues', JSON.stringify(updated));
  };

  // Get dynamic data from homepage fixtures (not current page fixtures)
  const allLeagues = getUniqueLeagues(homepageFixtures);
  const allCountries = getUniqueCountries(homepageFixtures);
  
  // Sort leagues and countries by priority
  const sortedLeagues = sortLeaguesByPriority(allLeagues.map(l => l.league));
  const sortedCountries = sortCountriesByPriority(allCountries);
  
  // Get leagues and countries to display (incrementally)
  const displayedLeagues = sortedLeagues.slice(0, leaguesToShow);
  const displayedCountries = sortedCountries.slice(0, countriesToShow);
  
  // AI Models for mobile navigation
  const aiModels = [
    { name: 'Gemini', path: '/models/gemini' },
    { name: 'ChatGPT', path: '/models/chatgpt' },
    { name: 'Grok', path: '/models/grok' },
    { name: 'ML', path: '/models/ml' },
  ];
  
  return (
    <div className="h-full flex flex-col">
      {/* Search Box */}
      <div className="p-4">
        <SearchBox fixtures={homepageFixtures} />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Top Leagues */}
        <div className="px-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Leagues
          </h3>
          <div className="space-y-1">
            {displayedLeagues.map((leagueName, index) => {
              const leagueData = allLeagues.find(l => l.league === leagueName);
              if (!leagueData) return null;
              
              // Count actual matches for this league from homepage fixtures
              const matchCount = homepageFixtures.filter(f => f.league === leagueName).length;
              
              return (
                <div key={`${leagueName}-${index}`} className="flex items-center justify-between group">
                  <Link
                    href={`/leagues/${leagueName.toLowerCase().replace(/\s+/g, '-')}`}
                    className={cn(
                      "flex-1 flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors",
                      pathname.includes(leagueName.toLowerCase())
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-200 text-gray-300 hover:text-white hover:bg-gray-800"
                    )}
                  >
                    <span className="text-lg">
                      {getCountryFlag(leagueData.country)}
                    </span>
                    <span>{leagueName}</span>
                    <span className="text-xs text-gray-500">({matchCount})</span>
                  </Link>
                  <button
                    onClick={() => togglePinnedLeague(leagueName)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-yellow-400 transition-all"
                  >
                    {pinnedLeagues.includes(leagueName) ? (
                      <Pin className="h-3 w-3 fill-current" />
                    ) : (
                      <PinOff className="h-3 w-3" />
                    )}
                  </button>
                </div>
              );
            })}
            {/* View More Button */}
            {leaguesToShow < sortedLeagues.length && (
              <button
                onClick={() => setLeaguesToShow(prev => Math.min(prev + 6, sortedLeagues.length))}
                className="block w-full p-2 rounded-lg text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800 transition-colors text-left"
              >
                View {Math.min(6, sortedLeagues.length - leaguesToShow)} more →
              </button>
            )}
          </div>
        </div>
        
        {/* Ad Slot */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-400 mb-2">Advertisement</div>
            <div className="h-20 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">Ad Space</span>
            </div>
          </div>
        </div>
        
        {/* Markets */}
        <div className="px-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Markets
          </h3>
          <div className="space-y-1">
            {mockMarkets.map((market) => (
              <Link
                key={market.key}
                href={`/markets/${market.key}`}
                className={cn(
                  "block p-2 rounded-lg text-sm transition-colors",
                  pathname === `/markets/${market.key}`
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200 text-gray-300 hover:text-white hover:bg-gray-800"
                )}
              >
                {market.name}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Ad Slot */}
        <div className="px-4 mb-6">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-400 mb-2">Advertisement</div>
            <div className="h-20 bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">Ad Space</span>
            </div>
          </div>
        </div>
        
        {/* AI Models - Mobile Only */}
        <div className="px-4 mb-6 lg:hidden">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Models
          </h3>
          <div className="space-y-1">
            {aiModels.map((model) => (
              <Link
                key={model.name}
                href={model.path}
                className={cn(
                  "block p-2 rounded-lg text-sm transition-colors",
                  pathname === model.path
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200 text-gray-300 hover:text-white hover:bg-gray-800"
                )}
              >
                {model.name}
              </Link>
            ))}
            
            {/* BangaBot Special Link */}
            <a
              href={API_CONFIG.BANGABOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 p-2 rounded-lg text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-200 text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Bot className="h-4 w-4" />
              <span>BangaBot</span>
            </a>
          </div>
        </div>
        
        {/* Countries */}
        <div className="px-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">
            Countries
          </h3>
          <div className="space-y-1">
            {displayedCountries.map((country, index) => {
              const countryMatches = homepageFixtures.filter(f => f.country === country).length;
              return (
              <Link
                key={`${country}-${index}`}
                href={`/countries/${country.toLowerCase().replace(/\s+/g, '-')}`}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors",
                  pathname.includes(country.toLowerCase())
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200 text-gray-300 hover:text-white hover:bg-gray-800"
                )}
              >
                <span className="text-lg">
                  {getCountryFlag(country)}
                </span>
                <span>{country}</span>
                <span className="text-xs text-gray-500">({countryMatches})</span>
              </Link>
              );
            })}
            {/* View More Button */}
            {countriesToShow < sortedCountries.length && (
              <button
                onClick={() => setCountriesToShow(prev => Math.min(prev + 5, sortedCountries.length))}
                className="block w-full p-2 rounded-lg text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800 transition-colors text-left"
              >
                View {Math.min(5, sortedCountries.length - countriesToShow)} more →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

