'use client';

import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import TopMenu from './TopMenu';
import { Menu, X, Bot } from 'lucide-react';
import { mockFixtures, Fixture } from '@/data/mock';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { API_CONFIG } from '@/config/api';

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
  fixtures?: Fixture[];
}

const aiModels = [
  { name: 'Gemini', path: '/models/gemini' },
  { name: 'ChatGPT', path: '/models/chatgpt' },
  { name: 'Grok', path: '/models/grok' },
  { name: 'ML', path: '/models/ml' },
];

export default function MainLayout({ children, className, fixtures }: MainLayoutProps) {
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(false);
  const pathname = usePathname();
  
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Menu */}
      <TopMenu />
      
      {/* Mobile Models Menu - Below Top Bar */}
      <div className="lg:hidden bg-gray-900 border-b border-gray-800">
        <div className="max-w-[1400px] mx-auto px-3">
          <div className="flex items-stretch gap-1 py-2">
            {aiModels.map((model) => (
              <Link
                key={model.name}
                href={model.path}
                className={cn(
                  "flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 text-center",
                  pathname === model.path
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/80 bg-gray-800/50"
                )}
              >
                {model.name}
              </Link>
            ))}
            
            {/* BangaBot Button */}
            <a
              href={API_CONFIG.BANGABOT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-1 flex-1 px-2 py-1.5 rounded-lg text-xs font-medium bg-white text-gray-900 hover:bg-gray-100 transition-colors border border-gray-300"
            >
              <Bot className="h-4 w-4" />
              <span>Bot</span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Button - Top Right (Transforms to Close) */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
          className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg border border-gray-700 transition-all duration-200 shadow-lg"
        >
          {isLeftPanelOpen ? (
            <X className="h-5 w-5 text-white" />
          ) : (
            <Menu className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      {/* Container with proper site-wide padding - smaller for 90% zoom effect */}
      <div className="max-w-[1400px] mx-auto px-3 md:px-6 lg:px-12">
        
              {/* Main Content Area */}
      <div className="flex min-h-[calc(100vh-128px)] lg:min-h-[calc(100vh-80px)]">
          {/* Left Panel - Navigation & Filters */}
          <div className={cn(
            "lg:w-56 xl:w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out",
            "lg:translate-x-0", // Always visible on large screens
            "fixed lg:static inset-y-0 lg:left-0 z-40", // Mobile: fixed overlay
            "top-[128px] lg:top-0", // Account for mobile menu height (80px + 48px = 128px)
            // Mobile: full screen width
            "w-full lg:w-56 xl:w-64 left-0 right-0 lg:right-auto",
            isLeftPanelOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0" // Mobile: slide in/out from right
          )}>
            {/* Close button removed - now handled by main menu button */}
                          <LeftPanel fixtures={fixtures || mockFixtures} />
          </div>
          
          {/* Mobile Overlay - Removed since menu is now full screen */}
          
          {/* Middle Panel - Main Content - Now uses full available width */}
          <div className={cn(
            "flex-1 overflow-auto",
            className
          )}>
            <main className="p-2 md:p-3 lg:p-3">
              {children}
            </main>
          </div>
          
                   {/* Right Panel - Ads (Hidden on mobile, visible from large screens) */}
         <div className="hidden lg:block w-80 flex-shrink-0 bg-gray-900 border-l border-gray-800">
            <RightPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
