'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Pin, PinOff, Bot } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import { cn } from '@/utils/cn';
import { getCountryFlag } from '@/utils/countries';
import { mockMarkets, getUniqueLeagues, getUniqueCountries, type Fixture } from '@/data/mock';
import { getTopPriorityLeagues, getTopPriorityCountries } from '@/config/priorities';
import { API_CONFIG } from '@/config/api';

interface LeftPanelProps {
  fixtures: Fixture[];
}

export default function LeftPanel({ fixtures }: LeftPanelProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [pinnedLeagues, setPinnedLeagues] = useState<string[]>([]);
  
  // Get pinned leagues from session storage on component mount
  React.useEffect(() => {
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

  // Get dynamic data from fixtures
  const allLeagues = getUniqueLeagues(fixtures);
  const allCountries = getUniqueCountries(fixtures);
  const topLeagues = getTopPriorityLeagues(allLeagues.map(l => l.league));
  const topCountries = getTopPriorityCountries(allCountries);
  
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
        <SearchBox />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Top Leagues */}
        <div className="px-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Top Leagues
          </h3>
          <div className="space-y-1">
            {topLeagues.map((leagueName) => {
              const leagueData = allLeagues.find(l => l.league === leagueName);
              if (!leagueData) return null;
              
              return (
                <div key={leagueName} className="flex items-center justify-between group">
                  <Link
                    href={`/leagues/${leagueName.toLowerCase().replace(/\s+/g, '-')}`}
                    className={cn(
                      "flex-1 flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors",
                      pathname.includes(leagueName.toLowerCase())
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                    )}
                  >
                    <span className="text-lg">
                      {getCountryFlag(leagueData.country)}
                    </span>
                    <span>{leagueName}</span>
                  </Link>
                  <button
                    onClick={() => togglePinnedLeague(leagueName)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-yellow-600 dark:text-gray-400 dark:hover:text-yellow-400 transition-all"
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
            {allLeagues.length > topLeagues.length && (
              <Link
                href="/leagues"
                className="block p-2 rounded-lg text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                View all leagues →
              </Link>
            )}
          </div>
        </div>
        
        {/* Ad Slot */}
        <div className="px-4 mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Advertisement</div>
            <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-500">Ad Space</span>
            </div>
          </div>
        </div>
        
        {/* Markets */}
        <div className="px-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
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
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                )}
              >
                {market.name}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Ad Slot */}
        <div className="px-4 mb-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Advertisement</div>
            <div className="h-20 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500 dark:text-gray-500">Ad Space</span>
            </div>
          </div>
        </div>
        
        {/* AI Models - Mobile Only */}
        <div className="px-4 mb-6 lg:hidden">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
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
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
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
              className="flex items-center space-x-2 p-2 rounded-lg text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
            >
              <Bot className="h-4 w-4" />
              <span>BangaBot</span>
            </a>
          </div>
        </div>
        
        {/* Countries */}
        <div className="px-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
            Countries
          </h3>
          <div className="space-y-1">
            {topCountries.map((country) => (
              <Link
                key={country}
                href={`/countries/${country.toLowerCase().replace(/\s+/g, '-')}`}
                className={cn(
                  "flex items-center space-x-2 p-2 rounded-lg text-sm transition-colors",
                  pathname.includes(country.toLowerCase())
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                )}
              >
                <span className="text-lg">
                  {getCountryFlag(country)}
                </span>
                <span>{country}</span>
              </Link>
            ))}
            {allCountries.length > topCountries.length && (
              <Link
                href="/countries"
                className="block p-2 rounded-lg text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                View all countries →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

