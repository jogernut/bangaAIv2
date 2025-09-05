'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/cn';
import { API_CONFIG } from '@/config/api';
import { Bot } from 'lucide-react';
import Image from 'next/image';

const aiModels = [
  { name: 'Gemini', path: '/models/gemini' },
  { name: 'ChatGPT', path: '/models/chatgpt' },
  { name: 'Grok', path: '/models/grok' },
  { name: 'ML', path: '/models/ml' },
];

export default function TopMenu() {
  const pathname = usePathname();
  
  return (
    <div className="w-full bg-gray-900">
      <div className="max-w-[1400px] mx-auto px-3 md:px-6 lg:px-12">
        <header className="h-16 lg:h-14 border-b border-gray-800">
          <div className="flex items-center h-full relative px-6">
            {/* Logo - Left */}
            <Link href="/" className="flex items-center py-3">
              <Image
                src="/logo.png"
                alt="Banga.ai Logo"
                width={280}
                height={70}
                className="h-10 lg:h-12 w-auto object-contain"
              />
            </Link>

            {/* Center area left blank (theme toggle removed) */}

            {/* AI Model Tabs - Desktop Only */}
            <nav className="hidden lg:flex items-center space-x-1 overflow-x-auto ml-auto">
              <div className="flex items-center space-x-1">
                {aiModels.map((model) => (
                  <Link
                    key={model.name}
                    href={model.path}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-all duration-200 whitespace-nowrap transform hover:scale-105 min-w-[70px] text-center",
                      pathname === model.path
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "text-gray-300 hover:text-white hover:bg-gray-800/80"
                    )}
                  >
                    {model.name}
                  </Link>
                ))}
                
                {/* BangaBot Special Link */}
                <a
                  href={API_CONFIG.BANGABOT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium bg-white text-gray-900 hover:bg-gray-100 transition-colors border border-gray-300 whitespace-nowrap"
                >
                  <Bot className="h-4 w-4" />
                  <span>BangaBot</span>
                </a>
              </div>
            </nav>
          </div>
        </header>
      </div>
    </div>
  );
}
