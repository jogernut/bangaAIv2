'use client';

import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getAvailableDates } from '@/utils/date';
import { format, addDays, parseISO } from 'date-fns';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  className?: string;
}

export default function DatePicker({ selectedDate, onDateChange, className }: DatePickerProps) {
  const availableDates = getAvailableDates();
  
  // Helper function to get the next available date
  const getNextDate = () => {
    const currentIndex = availableDates.findIndex(date => date.value === selectedDate);
    if (currentIndex < availableDates.length - 1) {
      return availableDates[currentIndex + 1].value;
    }
    return selectedDate; // Stay on current if at the end
  };

  // Helper function to format date for mobile display
  const formatMobileDate = (dateStr: string) => {
    const date = parseISO(dateStr);
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const dayAfter = addDays(today, 2);
    
    if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
      return 'Today';
    } else if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
      return 'Tomorrow';
    } else if (format(date, 'yyyy-MM-dd') === format(dayAfter, 'yyyy-MM-dd')) {
      return 'Day After';
    } else {
      return format(date, 'MMM d');
    }
  };

  const isLastDate = availableDates.findIndex(date => date.value === selectedDate) === availableDates.length - 1;
  
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2", className)}>
      {/* Mobile Date Picker: Simple Today + Forward Arrow */}
      <div className="md:hidden flex items-center justify-between bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {formatMobileDate(selectedDate)}
          </span>
        </div>
        <button
          onClick={() => onDateChange(getNextDate())}
          disabled={isLastDate}
          className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full transition-colors",
            isLastDate
              ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Desktop Date Picker: Original */}
      <div className="hidden md:flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="hidden md:flex rounded-lg p-1 overflow-x-auto bg-gray-100 dark:bg-gray-800">
        {availableDates.map((date) => (
          <button
            key={date.value}
            onClick={() => onDateChange(date.value)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
              selectedDate === date.value
                ? "bg-white text-gray-900 dark:bg-white dark:text-gray-900"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            )}
          >
            {date.label}
          </button>
        ))}
      </div>
    </div>
  );
}
