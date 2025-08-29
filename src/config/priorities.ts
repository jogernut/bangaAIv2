/**
 * Priority Configuration for Leagues and Countries
 * 
 * This file defines the order in which leagues and countries should appear
 * on the homepage and in the left panel navigation.
 */

// Top priority leagues that should appear first in the left panel
export const PRIORITY_LEAGUES = [
  'Premier League',
  'LaLiga', 
  'Bundesliga',
  'Serie A',
  'Ligue 1',
  'Primeira Liga',
  'Eredivisie',
  'Champions League',
  'Europa League',
  'MLS'
] as const;

// Top priority countries that should appear first in the left panel
export const PRIORITY_COUNTRIES = [
  'England',
  'Spain', 
  'Germany',
  'Italy',
  'France',
  'Portugal',
  'Netherlands',
  'Argentina',
  'Brazil',
  'USA'
] as const;

// Number of priority items to show before "View All" link
export const MAX_PRIORITY_LEAGUES = 6;
export const MAX_PRIORITY_COUNTRIES = 8;

// Helper functions to sort and organize data
export function sortLeaguesByPriority(leagues: string[]): string[] {
  const prioritySet = new Set(PRIORITY_LEAGUES);
  const priorityLeagues = PRIORITY_LEAGUES.filter(league => leagues.includes(league));
  const otherLeagues = leagues.filter(league => !prioritySet.has(league as any)).sort();
  
  return [...priorityLeagues, ...otherLeagues];
}

export function sortCountriesByPriority(countries: string[]): string[] {
  const prioritySet = new Set(PRIORITY_COUNTRIES);
  const priorityCountries = PRIORITY_COUNTRIES.filter(country => countries.includes(country));
  const otherCountries = countries.filter(country => !prioritySet.has(country as any)).sort();
  
  return [...priorityCountries, ...otherCountries];
}

export function getTopPriorityLeagues(leagues: string[]): string[] {
  const sorted = sortLeaguesByPriority(leagues);
  return sorted.slice(0, MAX_PRIORITY_LEAGUES);
}

export function getTopPriorityCountries(countries: string[]): string[] {
  const sorted = sortCountriesByPriority(countries);
  return sorted.slice(0, MAX_PRIORITY_COUNTRIES);
}
