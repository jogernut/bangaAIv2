'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import TopMenu from './TopMenu';
import { Menu, X } from 'lucide-react';
import { mockFixtures, type Fixture } from '@/data/mock';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function MainLayout({ children, className }: MainLayoutProps) {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Menu */}
      <TopMenu />
      
      {/* Container with proper site-wide padding */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
              {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-24 left-4 z-50">
          <button
            onClick={() => setIsLeftPanelOpen(true)}
            className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg border border-gray-700 transition-colors"
          >
            <Menu className="h-5 w-5 text-white" />
          </button>
        </div>
        
              {/* Main Content Area */}
      <div className="flex min-h-[calc(100vh-80px)]">
          {/* Left Panel - Navigation & Filters */}
          <div className={cn(
            "w-56 flex-shrink-0 bg-gray-900 border-r border-gray-800 transition-transform duration-300 ease-in-out",
            "lg:translate-x-0", // Always visible on large screens
            "fixed lg:static inset-y-0 left-0 z-40 top-20", // Mobile: fixed overlay
            isLeftPanelOpen ? "translate-x-0" : "-translate-x-full" // Mobile: slide in/out
          )}>
            {/* Mobile Close Button */}
            <div className="lg:hidden absolute top-4 right-4 z-50">
              <button
                onClick={() => setIsLeftPanelOpen(false)}
                className="bg-gray-800 hover:bg-gray-700 p-1 rounded-lg border border-gray-700 transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
                          <LeftPanel fixtures={mockFixtures} />
          </div>
          
          {/* Mobile Overlay */}
          {isLeftPanelOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 top-16"
              onClick={() => setIsLeftPanelOpen(false)}
            />
          )}
          
          {/* Middle Panel - Main Content - Now uses full available width */}
          <div className={cn(
            "flex-1 overflow-auto",
            className
          )}>
            <main className="p-3 lg:p-4">
              {children}
            </main>
          </div>
          
          {/* Right Panel - Ads (Hidden on mobile/tablet) */}
          <div className="hidden xl:block w-64 flex-shrink-0 bg-gray-900 border-l border-gray-800">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
