// Country utilities and flag handling
import countries from 'world-countries';

export interface Country {
  name: string;
  code: string;
  flag: string;
}

// Get country flag by name
export const getCountryFlag = (countryName: string): string => {
  // Normalize country name for better matching
  const normalizedName = countryName.toLowerCase().trim();
  
  // Find country by common name or official name
  const country = countries.find(c => 
    c.name.common.toLowerCase() === normalizedName ||
    c.name.official.toLowerCase() === normalizedName ||
    c.altSpellings.some(alt => alt.toLowerCase() === normalizedName)
  );
  
  if (country) {
    return country.flag;
  }
  
  // Fallback mappings for common football country names
  const fallbackMappings: Record<string, string> = {
    'england': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    'northern ireland': '🏴󠁧󠁢󠁮󠁩󠁲󠁿',
  };
  
  const fallbackFlag = fallbackMappings[normalizedName];
  if (fallbackFlag) {
    return fallbackFlag;
  }
  
  // Default world flag
  return '🌍';
};

// Get all countries with flags
export const getAllCountriesWithFlags = (): Country[] => {
  return countries.map(country => ({
    name: country.name.common,
    code: country.cca2,
    flag: country.flag
  })).sort((a, b) => a.name.localeCompare(b.name));
};

// Get country info by name
export const getCountryInfo = (countryName: string): Country | null => {
  const normalizedName = countryName.toLowerCase().trim();
  
  const country = countries.find(c => 
    c.name.common.toLowerCase() === normalizedName ||
    c.name.official.toLowerCase() === normalizedName ||
    c.altSpellings.some(alt => alt.toLowerCase() === normalizedName)
  );
  
  if (country) {
    return {
      name: country.name.common,
      code: country.cca2,
      flag: country.flag
    };
  }
  
  // Fallback for special cases
  const fallbackMappings: Record<string, Country> = {
    'england': { name: 'England', code: 'GB', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    'scotland': { name: 'Scotland', code: 'GB', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    'wales': { name: 'Wales', code: 'GB', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
    'northern ireland': { name: 'Northern Ireland', code: 'GB', flag: '🏴󠁧󠁢󠁮󠁩󠁲󠁿' },
  };
  
  return fallbackMappings[normalizedName] || null;
};

