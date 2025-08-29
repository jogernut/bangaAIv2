'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { getCountryFlag, getAllCountriesWithFlags } from '@/utils/countries';
import { mockCountries, mockFixtures } from '@/data/mock';
import { buildApiUrl, API_CONFIG } from '@/config/api';
import { Search, Globe } from 'lucide-react';

// API Endpoints
const HOMEPAGE_API = API_CONFIG.ENDPOINTS.HOMEPAGE;

export default function CountriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get unique countries from fixtures with match counts
  const countriesWithMatches = React.useMemo(() => {
    const countryMatches: Record<string, number> = {};
    
    mockFixtures.forEach(fixture => {
      countryMatches[fixture.country] = (countryMatches[fixture.country] || 0) + 1;
    });
    
    const allCountries = Array.from(new Set([...mockCountries, ...Object.keys(countryMatches)]));
    
    return allCountries
      .map(country => ({
        name: country,
        flag: getCountryFlag(country),
        matchCount: countryMatches[country] || 0,
        slug: country.toLowerCase().replace(/\s+/g, '-')
      }))
      .filter(country => 
        searchQuery === '' || 
        country.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        // Sort by match count (descending), then alphabetically
        if (a.matchCount !== b.matchCount) {
          return b.matchCount - a.matchCount;
        }
        return a.name.localeCompare(b.name);
      });
  }, [searchQuery]);
  
  return (
    <MainLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Globe className="h-8 w-8 text-blue-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Countries
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Browse football predictions by country and explore leagues worldwide
        </p>
      </div>
      
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-700"
          />
        </div>
      </div>
      
      {/* Countries Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {countriesWithMatches.map((country) => (
          <Link
            key={country.name}
            href={`/countries/${country.slug}`}
            className="rounded-lg p-4 transition-colors group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750"
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-3xl">
                {country.flag}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate transition-colors text-gray-900 group-hover:text-blue-700 dark:text-white dark:group-hover:text-blue-400">
                  {country.name}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                {country.matchCount} match{country.matchCount !== 1 ? 'es' : ''}
              </span>
              <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                View →
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      {countriesWithMatches.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">No countries found</div>
          <p className="text-sm text-gray-500">
            Try adjusting your search query
          </p>
        </div>
      )}
    </MainLayout>
  );
}
