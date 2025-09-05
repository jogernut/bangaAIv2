'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Fixture } from '@/data/mock';
import { API_CONFIG, buildApiUrl, shouldUseMockData } from '@/config/api';
import { transformFixtureModelNames } from '@/utils/models';
import { mockFixtures } from '@/data/mock';

interface FixturesContextType {
  fixtures: Fixture[];
  loading: boolean;
  error: string | null;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  refetchFixtures: () => void;
}

const FixturesContext = createContext<FixturesContextType | undefined>(undefined);

export function useFixtures() {
  const context = useContext(FixturesContext);
  if (context === undefined) {
    throw new Error('useFixtures must be used within a FixturesProvider');
  }
  return context;
}

interface FixturesProviderProps {
  children: ReactNode;
}

export function FixturesProvider({ children }: FixturesProviderProps) {
  const [fixtures, setFixtures] = useState<Fixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Set default to a date that has API data (based on user's sample data showing Sept 5, 2025)
  const [selectedDate, setSelectedDate] = useState('2025-09-05');

  const fetchFixtures = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Check if we should use mock data
      if (shouldUseMockData()) {
        console.log('🔄 Using mock data - API not configured');
        setFixtures(mockFixtures);
        setLoading(false);
        return;
      }

      // Build API URL - Convert date format from yyyy-MM-dd to MM/dd/yyyy
      const [year, month, day] = selectedDate.split('-');
      const apiDate = `${month}/${day}/${year}`;
      
      const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.HOMEPAGE, {
        date: apiDate
      });
      
      console.log('🌐 Fetching fixtures from API:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('📡 Error response body:', errorText);
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      // Enhanced JSON parsing error handling
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');
      
      console.log('📡 Response headers:', { contentLength, contentType });
      
      if (contentLength === '0') {
        throw new Error('API returned empty response (content-length: 0)');
      }
      
      const responseText = await response.text();
      console.log('📡 Raw response length:', responseText.length);
      
      if (!responseText.trim()) {
        throw new Error('API returned empty response');
      }
      
      const data = JSON.parse(responseText);
      console.log('✅ Fixtures received:', data);
      console.log('📊 Number of matches received:', Array.isArray(data) ? data.length : 0);
      
      // Debug: Log all unique AI model names
      const allModelNames = data.flatMap((match: Fixture) => 
        (match.modelPredictions || []).map((pred) => pred.aiModel?.name)
      ).filter(Boolean);
      const uniqueModelNames = [...new Set(allModelNames)];
      console.log('🤖 Context: Available AI models in API data:', uniqueModelNames);
      
      // Additional debug: Check if we have the specific models
      const hasModels = {
        ChatGPT: uniqueModelNames.includes('ChatGPT'),
        ML: uniqueModelNames.includes('ML'),
        Gemini: uniqueModelNames.includes('Gemini') || uniqueModelNames.includes('Germini'),
        Grok: uniqueModelNames.includes('Grok')
      };
      console.log('🎯 Context: Model availability check:', hasModels);
      
      // Transform API data to match our Fixture interface
      const transformedFixtures = transformFixtureModelNames(data);
      
      // Debug: Show available dates in the data
      if (transformedFixtures.length > 0) {
        const allDates = transformedFixtures.map(f => f.time.split('T')[0]);
        const uniqueDates = [...new Set(allDates)].sort();
        console.log('📅 Context: Available dates in API data:', uniqueDates.slice(0, 10)); // Show first 10 dates
      }
      
      console.log('🔄 Transformed fixtures:', transformedFixtures.length, 'matches');
      setFixtures(transformedFixtures);
      
    } catch (err) {
      console.error('❌ API Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      // Fallback to mock data
      setFixtures(mockFixtures);
    } finally {
      setLoading(false);
    }
  };

  const refetchFixtures = () => {
    fetchFixtures();
  };

  useEffect(() => {
    fetchFixtures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <FixturesContext.Provider value={{
      fixtures,
      loading,
      error,
      selectedDate,
      setSelectedDate,
      refetchFixtures
    }}>
      {children}
    </FixturesContext.Provider>
  );
}
