'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import TopMenu from './TopMenu';
import { Menu, X } from 'lucide-react';
import { mockFixtures, type Fixture } from '@/data/mock';
import { useTheme } from '@/components/providers/ThemeProvider';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const { isDarkMode } = useTheme();
  
  return (
    <div className={cn(
      'min-h-screen transition-colors',
      isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
    )}>
      {/* Top Menu */}
      <TopMenu />
      
      {/* Mobile Menu Button - Top Right (Transforms to Close) */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg border border-gray-300 dark:border-gray-700 transition-all duration-200 shadow-lg"
        >
          {isLeftPanelOpen ? (
            <X className="h-5 w-5 text-gray-900 dark:text-white" />
          ) : (
            <Menu className="h-5 w-5 text-gray-900 dark:text-white" />
          )}
        </button>
      </div>

      {/* Container with proper site-wide padding */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-12">
        
              {/* Main Content Area */}
      <div className="flex min-h-[calc(100vh-80px)]">
          {/* Left Panel - Navigation & Filters */}
          <div className={cn(
            "w-56 md:w-64 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ease-in-out",
            "lg:translate-x-0", // Always visible on large screens
            "fixed lg:static inset-y-0 lg:left-0 z-40 top-20", // Mobile: fixed overlay
            // Mobile: slide from right side
            "lg:left-0 right-0 lg:right-auto",
            isLeftPanelOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0" // Mobile: slide in/out from right
          )}>
            {/* Close button removed - now handled by main menu button */}
                          <LeftPanel fixtures={mockFixtures} />
          </div>
          
          {/* Mobile Overlay */}
          {isLeftPanelOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-20"
              onClick={() => setIsLeftPanelOpen(false)}
            />
          )}
          
          {/* Middle Panel - Main Content - Now uses full available width */}
          <div className={cn(
            "flex-1 overflow-auto",
            className
          )}>
            <main className="p-2 md:p-3 lg:p-4">
              {children}
            </main>
          </div>
          
          {/* Right Panel - Ads (Hidden on mobile/tablet) */}
          <div className="hidden xl:block w-64 flex-shrink-0 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
