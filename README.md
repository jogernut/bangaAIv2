# Banga.ai Frontend

A comprehensive football predictions platform showcasing AI-powered predictions from multiple providers.

## Features

- **3-Panel Responsive Layout**: Left navigation, main content, and ads panel
- **AI Model Integration**: Support for Gemini, ChatGPT, Grok, ML, and BangaBot
- **Market Predictions**: Over/Under goals, Both Teams to Score, Match Results
- **Country & League Filtering**: Browse predictions by country and league
- **League Pinning**: Pin favorite leagues for priority display
- **Dark Mode**: Professional sports-focused design with dark theme as default
- **Responsive Design**: Optimized for desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Country Data**: world-countries package

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd banga-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
cp .env.example .env.local
```

### Environment Configuration

The application supports both real API endpoints and mock data for development.

Create a `.env.local` file with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_HOMEPAGE_API=
NEXT_PUBLIC_MARKETS_API=
NEXT_PUBLIC_MORE_DETAILS_API=

# Other Configuration
NEXT_PUBLIC_APP_NAME=Banga.ai
NEXT_PUBLIC_BANGABOT_URL=https://bot.bangaai.com
```

**Mock Data Mode**: If any API endpoint is empty, the application automatically uses comprehensive mock data for development and testing.

### Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── countries/         # Countries listing and details
│   ├── markets/           # Market-specific predictions
│   ├── matches/           # Match details page
│   ├── models/            # AI model-specific pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── config/                # Configuration files
├── data/                  # Mock data and types
└── utils/                 # Utility functions
```

## Pages

### 1. Homepage (`/`)
- **Features**: Date picker, league grouping, match cards
- **Sorting**: Pinned leagues → Priority leagues → Alphabetical
- **Predictions**: Shows 4 AI models (Gemini, ChatGPT, Grok, ML)

### 2. Markets (`/markets/[market]`)
- **Supported Markets**:
  - `over2_5`, `over1_5` - Over goals
  - `under2_5`, `under1_5` - Under goals  
  - `GG`, `NG` - Both teams to score
  - `home_win`, `away_win`, `draw` - Match results
- **Filter Logic**: Only shows predictions that qualify for the selected market

### 3. Countries (`/countries`, `/countries/[country]`)
- **Features**: Country listing with flags, match counts
- **Filtering**: Search functionality, alphabetical sorting
- **Individual Pages**: Country-specific matches with league filtering

### 4. AI Models (`/models/[model]`)
- **Models**: `gemini`, `chatgpt`, `grok`, `ml`
- **Display**: Shows which markets each model's predictions qualify for
- **Statistics**: Model performance metrics and confidence levels

### 5. Match Details (`/matches/[id]`)
- **Context-Aware**: Different displays based on referrer page
- **Features**: Team info, recent form, detailed AI analysis
- **Confidence Display**: Shows reasoning behind predictions

## API Integration

The application is designed to work with 3 main APIs:

1. **Homepage API**: Powers homepage, model pages, countries pages
2. **Markets API**: Powers market-specific pages
3. **More Details API**: Powers detailed match information

### Defensive Programming

All components are built to handle missing data gracefully:
- Missing team logos fall back to world emoji
- Missing predictions don't break the UI
- Invalid routes show appropriate error messages

## Market Qualification Logic

The application implements sophisticated logic to determine which predictions qualify for specific markets:

- **Over 2.5/1.5**: Based on `predictedTotalGoals`
- **Under 2.5/1.5**: Inverse of over logic
- **Both Teams Score**: Both `predictedHomeGoal` and `predictedAwayGoal` ≥ 1
- **Match Results**: Based on comparison of predicted goals

## Development Notes

### Mock Data
- Comprehensive fixture data with realistic predictions
- Multiple AI models with varying confidence levels
- Recent form data for teams
- Country flags using the world-countries package

### Responsive Design
- Mobile-first approach
- Collapsible panels on smaller screens
- Grid layouts that adapt to screen size

### Performance
- Memoized calculations for filtering and grouping
- Lazy loading of images with error handling
- Efficient re-renders using React keys

## Build & Deploy

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

## Contributing

1. Follow the existing code structure and naming conventions
2. Ensure all components handle missing data gracefully
3. Test across different screen sizes
4. Maintain dark theme consistency

## License

Private project for Banga.ai