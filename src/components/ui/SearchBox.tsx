'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { mockFixtures, mockMarkets, getUniqueLeagues, getUniqueCountries } from '@/data/mock';
import { getCountryFlag } from '@/utils/countries';

interface SearchResult {
  type: 'match' | 'league' | 'country' | 'market';
  name: string;
  url: string;
  meta?: string; // Additional info like league for matches, country for leagues
}

interface SearchBoxProps {
  className?: string;
}

export default function SearchBox({ className }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // Generate search data
  const searchData = useMemo(() => {
    const results: SearchResult[] = [];

    // Matches
    mockFixtures.forEach(fixture => {
      const matchName = `${fixture.hometeam} vs ${fixture.awayteam}`;
      results.push({
        type: 'match',
        name: matchName,
        url: `/matches/${fixture.id}?ref=search`,
        meta: `${fixture.league} • ${fixture.country}`
      });
    });

    // Leagues
    const leagues = getUniqueLeagues(mockFixtures);
    leagues.forEach(({ league, country }) => {
      results.push({
        type: 'league',
        name: league,
        url: `/leagues/${league.toLowerCase().replace(/\s+/g, '-')}`,
        meta: country
      });
    });

    // Countries
    const countries = getUniqueCountries(mockFixtures);
    countries.forEach(country => {
      results.push({
        type: 'country',
        name: country,
        url: `/countries/${country.toLowerCase().replace(/\s+/g, '-')}`,
      });
    });

    // Markets
    mockMarkets.forEach(market => {
      results.push({
        type: 'market',
        name: market.name,
        url: `/markets/${market.key}`,
        meta: market.description
      });
    });

    return results;
  }, []);

  // Filter results based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    return searchData
      .filter(item => 
        item.name.toLowerCase().includes(lowercaseQuery) ||
        item.meta?.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 8); // Limit to 8 results
  }, [query, searchData]);

  const handleSelect = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    router.push(result.url);
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'match':
        return '⚽';
      case 'league':
        return '🏆';
      case 'country':
        return '🌍';
      case 'market':
        return '📊';
      default:
        return '🔍';
    }
  };

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'match':
        return 'Match';
      case 'league':
        return 'League';
      case 'country':
        return 'Country';
      case 'market':
        return 'Market';
      default:
        return '';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search matches, leagues, countries, markets..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            // Delay to allow clicking on results
            setTimeout(() => setIsOpen(false), 200);
          }}
          className="w-full pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500 border border-gray-300 bg-gray-800 placeholder-gray-400 border-gray-700"
        />
        
        {query && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors z-10"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && filteredResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 bg-gray-800 border-gray-600 rounded-lg shadow-xl z-20">
          <div className="max-h-80 overflow-hidden">
            {filteredResults.map((result, index) => (
              <button
                key={`${result.type}-${result.name}-${index}`}
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-3 text-left transition-all duration-150 border-b last:border-b-0 group focus:outline-none hover:bg-gray-100 focus:bg-gray-100 border-gray-200 focus:bg-gray-700 border-gray-700/50"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg mt-0.5 flex-shrink-0">{getTypeIcon(result.type)}</span>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium transition-colors truncate text-gray-900 group-hover:text-blue-300">
                        {result.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 transition-colors text-gray-600 bg-gray-100 group-hover:bg-gray-200 text-gray-300 group-hover:bg-gray-600/80">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                    {result.meta && (
                      <div className="text-sm text-gray-400 truncate">
                        {result.type === 'match' || result.type === 'league' ? (
                          <span className="flex items-center space-x-1">
                            {result.type === 'league' && (
                              <>
                                <span>{getCountryFlag(result.meta)}</span>
                                <span>{result.meta}</span>
                              </>
                            )}
                            {result.type === 'match' && (
                              <span>{result.meta}</span>
                            )}
                          </span>
                        ) : (
                          result.meta
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim() && filteredResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 bg-gray-800 border-gray-700 rounded-lg shadow-lg z-20 p-4 text-center">
          <div className="text-gray-400">
            No results found for &quot;{query}&quot;
          </div>
        </div>
      )}
    </div>
  );
}
