'use client';

import React from 'react';

export default function RightPanel() {
  return (
    <div className="h-full p-4">
      <div className="space-y-6">
        {/* Ad Slot 1 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">Advertisement</div>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-500">300x250 Ad Space</span>
          </div>
        </div>
        
        {/* Ad Slot 2 */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">Advertisement</div>
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-500">300x250 Ad Space</span>
          </div>
        </div>
        
        {/* Ad Slot 3 - Skyscraper */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">Advertisement</div>
          <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-500">160x600 Skyscraper</span>
          </div>
        </div>
      </div>
    </div>
  );
}

