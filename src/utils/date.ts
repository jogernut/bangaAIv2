// Date utilities for Banga.ai
import { format, addDays, isToday, isTomorrow, parseISO, isAfter, isBefore } from 'date-fns';

// Format time for match display
export const formatMatchTime = (timeString: string): string => {
  const date = parseISO(timeString);
  return format(date, 'HH:mm');
};

// Format date for display
export const formatMatchDate = (timeString: string): string => {
  const date = parseISO(timeString);
  
  if (isToday(date)) {
    return 'Today';
  }
  
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  
  return format(date, 'dd/MM/yyyy');
};

// Get available dates (today + 2 days forward)
export const getAvailableDates = (): { date: Date; label: string; value: string }[] => {
  const today = new Date();
  const dates = [];
  
  for (let i = 0; i < 3; i++) {
    const date = addDays(today, i);
    const value = format(date, 'yyyy-MM-dd');
    let label = format(date, 'dd/MM/yyyy');
    
    if (i === 0) label = 'Today';
    if (i === 1) label = 'Tomorrow';
    
    dates.push({ date, label, value });
  }
  
  return dates;
};

// Check if a match is on a specific date
export const isMatchOnDate = (matchTime: string, targetDate: string): boolean => {
  const matchDate = parseISO(matchTime);
  const target = parseISO(targetDate);
  
  return format(matchDate, 'yyyy-MM-dd') === format(target, 'yyyy-MM-dd');
};

// Check if match is live (within 2 hours of kickoff)
export const isMatchLive = (timeString: string): boolean => {
  const matchTime = parseISO(timeString);
  const now = new Date();
  const twoHoursLater = addDays(matchTime, 0);
  twoHoursLater.setHours(twoHoursLater.getHours() + 2);
  
  return isAfter(now, matchTime) && isBefore(now, twoHoursLater);
};

