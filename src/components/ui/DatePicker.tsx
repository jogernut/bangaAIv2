'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';
import { getAvailableDates } from '@/utils/date';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  className?: string;
}

export default function DatePicker({ selectedDate, onDateChange, className }: DatePickerProps) {
  const availableDates = getAvailableDates();
  
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2", className)}>
      <div className="flex items-center space-x-2">
        <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <span className="text-sm text-gray-600 dark:text-gray-400 sm:hidden">Select Date:</span>
      </div>
      <div className="flex rounded-lg p-1 overflow-x-auto bg-gray-100 dark:bg-gray-800">
        {availableDates.map((date) => (
          <button
            key={date.value}
            onClick={() => onDateChange(date.value)}
            className={cn(
              "px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0",
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
