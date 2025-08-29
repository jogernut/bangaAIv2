// Mock data for Banga.ai when APIs are not available

export interface AiModel {
  name: string;
  isActive: boolean;
}

export interface ModelPrediction {
  predictedHomeGoal: number;
  predictedAwayGoal: number;
  confidenceLevel: number;
  confidenceLevelReasoning: string;
  predictedTotalGoals: number;
  confidenceLevelPTG: number;
  confidenceLevelReasoningPTG: string;
  aiModel: AiModel;
}

export interface Fixture {
  id: string;
  country: string;
  league: string;
  hometeam: string;
  hometeamlogo: string;
  awayteam: string;
  awayteamlogo: string;
  time: string;
  hometeamRecentForm: string;
  awayteamRecentForm: string;
  modelPredictions: ModelPrediction[];
}

// Mock AI Models
export const mockAiModels: AiModel[] = [
  { name: "Gemini", isActive: true },
  { name: "ChatGPT", isActive: true },
  { name: "Grok", isActive: true },
  { name: "ML", isActive: true },
  { name: "BangaBot", isActive: true },
];

// Mock fixtures data
export const mockFixtures: Fixture[] = [
  {
    id: "a3e884f3-1846-4b34-5f35-08dde6daafe2",
    country: "Spain",
    league: "LaLiga",
    hometeam: "Real Madrid",
    hometeamlogo: "https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png",
    awayteam: "Barcelona",
    awayteamlogo: "https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png",
    time: "2025-08-29T20:00:00",
    hometeamRecentForm: "win,win,draw,win,win",
    awayteamRecentForm: "win,draw,win,lose,win",
    modelPredictions: [
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 1,
        confidenceLevel: 75,
        confidenceLevelReasoning: "Real Madrid has strong home form and recent head-to-head advantage",
        predictedTotalGoals: 2.5,
        confidenceLevelPTG: 68,
        confidenceLevelReasoningPTG: "Both teams have strong attacking records but solid defenses",
        aiModel: { name: "Gemini", isActive: true }
      },
      {
        predictedHomeGoal: 1,
        predictedAwayGoal: 2,
        confidenceLevel: 70,
        confidenceLevelReasoning: "Barcelona's recent form and tactical superiority favor away win",
        predictedTotalGoals: 3.5,
        confidenceLevelPTG: 60,
        confidenceLevelReasoningPTG: "El Clasico typically produces high-scoring matches",
        aiModel: { name: "ChatGPT", isActive: true }
      },
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 2,
        confidenceLevel: 65,
        confidenceLevelReasoning: "Even match-up with both teams in excellent form",
        predictedTotalGoals: 4.5,
        confidenceLevelPTG: 55,
        confidenceLevelReasoningPTG: "Expect goals from both sides in this high-stakes encounter",
        aiModel: { name: "Grok", isActive: true }
      },
      {
        predictedHomeGoal: 3,
        predictedAwayGoal: 1,
        confidenceLevel: 80,
        confidenceLevelReasoning: "Statistical models favor Real Madrid at home with strong goal difference",
        predictedTotalGoals: 3.5,
        confidenceLevelPTG: 72,
        confidenceLevelReasoningPTG: "Historical data suggests over 3.5 goals in El Clasico matches",
        aiModel: { name: "ML", isActive: true }
      }
    ]
  },
  {
    id: "z1a234b5-6789-0123-4567-890123456789",
    country: "England",
    league: "Premier League", 
    hometeam: "Arsenal",
    hometeamlogo: "https://logos-world.net/wp-content/uploads/2020/05/Arsenal-Logo.png",
    awayteam: "Chelsea",
    awayteamlogo: "https://logos-world.net/wp-content/uploads/2020/05/Chelsea-Logo.png",
    time: "2025-08-29T19:30:00",
    hometeamRecentForm: "win,win,draw,win,lose",
    awayteamRecentForm: "draw,win,win,lose,win",
    modelPredictions: [
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 1,
        confidenceLevel: 72,
        confidenceLevelReasoning: "Arsenal's home form has been impressive this season",
        predictedTotalGoals: 3.5,
        confidenceLevelPTG: 65,
        confidenceLevelReasoningPTG: "Both teams attack-minded with good scoring records",
        aiModel: { name: "Gemini", isActive: true }
      },
      {
        predictedHomeGoal: 1,
        predictedAwayGoal: 2,
        confidenceLevel: 68,
        confidenceLevelReasoning: "Chelsea's tactical setup favors counter-attacks",
        predictedTotalGoals: 2.5,
        confidenceLevelPTG: 58,
        confidenceLevelReasoningPTG: "Tactical battle could limit goal opportunities",
        aiModel: { name: "ChatGPT", isActive: true }
      },
      {
        predictedHomeGoal: 3,
        predictedAwayGoal: 1,
        confidenceLevel: 75,
        confidenceLevelReasoning: "Arsenal's attacking prowess at Emirates",
        predictedTotalGoals: 4.5,
        confidenceLevelPTG: 70,
        confidenceLevelReasoningPTG: "Expecting an entertaining, high-scoring affair",
        aiModel: { name: "Grok", isActive: true }
      },
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 2,
        confidenceLevel: 61,
        confidenceLevelReasoning: "Historical data suggests even contest",
        predictedTotalGoals: 3.5,
        confidenceLevelPTG: 63,
        confidenceLevelReasoningPTG: "Both teams likely to score multiple goals",
        aiModel: { name: "ML", isActive: true }
      }
    ]
  },
  {
    id: "y2b345c6-7890-1234-5678-901234567890",
    country: "England",
    league: "Premier League",
    hometeam: "Tottenham",
    hometeamlogo: "https://logos-world.net/wp-content/uploads/2020/06/Tottenham-Hotspur-Logo.png",
    awayteam: "Newcastle",
    awayteamlogo: "https://logos-world.net/wp-content/uploads/2020/06/Newcastle-Logo.png",
    time: "2025-08-29T21:45:00",
    hometeamRecentForm: "win,lose,win,draw,win",
    awayteamRecentForm: "draw,draw,win,lose,draw",
    modelPredictions: [
      {
        predictedHomeGoal: 3,
        predictedAwayGoal: 0,
        confidenceLevel: 78,
        confidenceLevelReasoning: "Spurs attacking at home against struggling Newcastle defense",
        predictedTotalGoals: 3.5,
        confidenceLevelPTG: 72,
        confidenceLevelReasoningPTG: "Spurs likely to dominate possession and create chances",
        aiModel: { name: "Gemini", isActive: true }
      },
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 1,
        confidenceLevel: 65,
        confidenceLevelReasoning: "Newcastle can be dangerous on the counter",
        predictedTotalGoals: 2.5,
        confidenceLevelPTG: 59,
        confidenceLevelReasoningPTG: "Moderate scoring expected",
        aiModel: { name: "ChatGPT", isActive: true }
      },
      {
        predictedHomeGoal: 4,
        predictedAwayGoal: 1,
        confidenceLevel: 82,
        confidenceLevelReasoning: "Tottenham's home advantage and attacking form",
        predictedTotalGoals: 4.5,
        confidenceLevelPTG: 79,
        confidenceLevelReasoningPTG: "High-scoring home win predicted",
        aiModel: { name: "Grok", isActive: true }
      },
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 0,
        confidenceLevel: 69,
        confidenceLevelReasoning: "Statistical model favors home team strongly",
        predictedTotalGoals: 2.5,
        confidenceLevelPTG: 61,
        confidenceLevelReasoningPTG: "Clean sheet expected for Tottenham",
        aiModel: { name: "ML", isActive: true }
      }
    ]
  },
  {
    id: "b4f995g4-2957-5c45-6g46-19eef7ebbgf3",
    country: "England",
    league: "Premier League",
    hometeam: "Manchester City",
    hometeamlogo: "https://logos-world.net/wp-content/uploads/2020/06/Manchester-City-Logo.png",
    awayteam: "Liverpool",
    awayteamlogo: "https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png",
    time: "2025-08-29T17:30:00",
    hometeamRecentForm: "win,win,win,draw,win",
    awayteamRecentForm: "win,win,lose,win,draw",
    modelPredictions: [
      {
        predictedHomeGoal: 3,
        predictedAwayGoal: 2,
        confidenceLevel: 72,
        confidenceLevelReasoning: "Manchester City's home advantage and attacking prowess",
        predictedTotalGoals: 4.5,
        confidenceLevelPTG: 78,
        confidenceLevelReasoningPTG: "Both teams known for high-scoring encounters",
        aiModel: { name: "Gemini", isActive: true }
      },
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 3,
        confidenceLevel: 68,
        confidenceLevelReasoning: "Liverpool's counter-attacking style suits away games",
        predictedTotalGoals: 5.5,
        confidenceLevelPTG: 65,
        confidenceLevelReasoningPTG: "Expecting an open, entertaining match with multiple goals",
        aiModel: { name: "ChatGPT", isActive: true }
      },
      {
        predictedHomeGoal: 1,
        predictedAwayGoal: 1,
        confidenceLevel: 58,
        confidenceLevelReasoning: "Tight defensive battle expected between top teams",
        predictedTotalGoals: 2.5,
        confidenceLevelPTG: 45,
        confidenceLevelReasoningPTG: "Both defenses have been solid recently",
        aiModel: { name: "Grok", isActive: true }
      },
      {
        predictedHomeGoal: 4,
        predictedAwayGoal: 1,
        confidenceLevel: 85,
        confidenceLevelReasoning: "Machine learning model strongly favors City's home dominance",
        predictedTotalGoals: 4.5,
        confidenceLevelPTG: 82,
        confidenceLevelReasoningPTG: "High-confidence prediction for over 4.5 goals",
        aiModel: { name: "ML", isActive: true }
      }
    ]
  },
  {
    id: "x3c456d7-8901-2345-6789-012345678901",
    country: "Spain",
    league: "LaLiga",
    hometeam: "Atletico Madrid",
    hometeamlogo: "https://logos-world.net/wp-content/uploads/2020/06/atletico-madrid-Logo.png",
    awayteam: "Sevilla",
    awayteamlogo: "https://logos-world.net/wp-content/uploads/2020/06/Sevilla-Logo.png",
    time: "2025-08-29T22:00:00",
    hometeamRecentForm: "win,draw,win,win,lose",
    awayteamRecentForm: "draw,lose,win,draw,win",
    modelPredictions: [
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 0,
        confidenceLevel: 74,
        confidenceLevelReasoning: "Atletico's defensive solidity at home",
        predictedTotalGoals: 2.5,
        confidenceLevelPTG: 68,
        confidenceLevelReasoningPTG: "Typical Atletico low-scoring win expected",
        aiModel: { name: "Gemini", isActive: true }
      },
      {
        predictedHomeGoal: 1,
        predictedAwayGoal: 1,
        confidenceLevel: 62,
        confidenceLevelReasoning: "Evenly matched Spanish sides",
        predictedTotalGoals: 2.0,
        confidenceLevelPTG: 55,
        confidenceLevelReasoningPTG: "Conservative tactical approach anticipated",
        aiModel: { name: "ChatGPT", isActive: true }
      },
      {
        predictedHomeGoal: 3,
        predictedAwayGoal: 1,
        confidenceLevel: 79,
        confidenceLevelReasoning: "Atletico's home form against struggling Sevilla",
        predictedTotalGoals: 3.5,
        confidenceLevelPTG: 73,
        confidenceLevelReasoningPTG: "Home advantage should prove decisive",
        aiModel: { name: "Grok", isActive: true }
      },
      {
        predictedHomeGoal: 1,
        predictedAwayGoal: 0,
        confidenceLevel: 71,
        confidenceLevelReasoning: "Statistical model favors Atletico clean sheet",
        predictedTotalGoals: 1.5,
        confidenceLevelPTG: 64,
        confidenceLevelReasoningPTG: "Defensive masterclass expected",
        aiModel: { name: "ML", isActive: true }
      }
    ]
  },
  {
    id: "c5g106h5-3068-6d56-7h57-20ffg8gccig4",
    country: "Germany",
    league: "Bundesliga",
    hometeam: "Bayern Munich",
    hometeamlogo: "https://logos-world.net/wp-content/uploads/2020/06/FC-Bayern-Munchen-Logo.png",
    awayteam: "Borussia Dortmund",
    awayteamlogo: "https://logos-world.net/wp-content/uploads/2020/11/Borussia-Dortmund-Logo.png",
    time: "2025-08-29T15:30:00",
    hometeamRecentForm: "win,win,win,win,draw",
    awayteamRecentForm: "draw,win,win,lose,win",
    modelPredictions: [
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 0,
        confidenceLevel: 77,
        confidenceLevelReasoning: "Bayern's strong home record against Dortmund",
        predictedTotalGoals: 2.5,
        confidenceLevelPTG: 52,
        confidenceLevelReasoningPTG: "Bayern likely to control the match defensively",
        aiModel: { name: "Gemini", isActive: true }
      },
      {
        predictedHomeGoal: 3,
        predictedAwayGoal: 2,
        confidenceLevel: 71,
        confidenceLevelReasoning: "Der Klassiker always delivers exciting football",
        predictedTotalGoals: 5.5,
        confidenceLevelPTG: 74,
        confidenceLevelReasoningPTG: "Both teams' attacking quality suggests high-scoring affair",
        aiModel: { name: "ChatGPT", isActive: true }
      },
      {
        predictedHomeGoal: 1,
        predictedAwayGoal: 3,
        confidenceLevel: 62,
        confidenceLevelReasoning: "Dortmund's young talents could surprise Bayern",
        predictedTotalGoals: 3.5,
        confidenceLevelPTG: 59,
        confidenceLevelReasoningPTG: "Moderate confidence in over 3.5 goals",
        aiModel: { name: "Grok", isActive: true }
      },
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 1,
        confidenceLevel: 73,
        confidenceLevelReasoning: "Statistical analysis favors Bayern's experience",
        predictedTotalGoals: 3.5,
        confidenceLevelPTG: 67,
        confidenceLevelReasoningPTG: "Expected goals model suggests over 3.5",
        aiModel: { name: "ML", isActive: true }
      }
    ]
  },
  {
    id: "d6h217i6-4179-7e67-8i68-31ggh9hddji5",
    country: "Italy",
    league: "Serie A",
    hometeam: "Juventus",
    hometeamlogo: "https://logos-world.net/wp-content/uploads/2020/06/Juventus-Logo.png",
    awayteam: "AC Milan",
    awayteamlogo: "https://logos-world.net/wp-content/uploads/2020/06/AC-Milan-Logo.png",
    time: "2025-08-30T20:45:00",
    hometeamRecentForm: "draw,win,win,draw,lose",
    awayteamRecentForm: "win,draw,win,win,draw",
    modelPredictions: [
      {
        predictedHomeGoal: 1,
        predictedAwayGoal: 1,
        confidenceLevel: 64,
        confidenceLevelReasoning: "Evenly matched teams with solid defensive records",
        predictedTotalGoals: 2.5,
        confidenceLevelPTG: 48,
        confidenceLevelReasoningPTG: "Italian football tends to be more defensive",
        aiModel: { name: "Gemini", isActive: true }
      },
      {
        predictedHomeGoal: 0,
        predictedAwayGoal: 2,
        confidenceLevel: 69,
        confidenceLevelReasoning: "Milan's recent form suggests away win capability",
        predictedTotalGoals: 1.5,
        confidenceLevelPTG: 55,
        confidenceLevelReasoningPTG: "Low-scoring match expected in Serie A style",
        aiModel: { name: "ChatGPT", isActive: true }
      },
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 0,
        confidenceLevel: 66,
        confidenceLevelReasoning: "Juventus home advantage in Turin",
        predictedTotalGoals: 2.5,
        confidenceLevelPTG: 51,
        confidenceLevelReasoningPTG: "Expecting a tight, tactical affair",
        aiModel: { name: "Grok", isActive: true }
      },
      {
        predictedHomeGoal: 1,
        predictedAwayGoal: 0,
        confidenceLevel: 71,
        confidenceLevelReasoning: "Home advantage and defensive solidity favor Juventus",
        predictedTotalGoals: 1.5,
        confidenceLevelPTG: 63,
        confidenceLevelReasoningPTG: "Low expected goals in defensive matchup",
        aiModel: { name: "ML", isActive: true }
      }
    ]
  },
  {
    id: "e7i328j7-5280-8f78-9j79-42hhi0ieeik6",
    country: "France",
    league: "Ligue 1",
    hometeam: "Paris Saint-Germain",
    hometeamlogo: "https://logos-world.net/wp-content/uploads/2020/06/Paris-Saint-Germain-Logo.png",
    awayteam: "Olympique Marseille",
    awayteamlogo: "https://logos-world.net/wp-content/uploads/2020/06/Olympique-Marseille-Logo.png",
    time: "2025-08-30T21:00:00",
    hometeamRecentForm: "win,win,win,win,win",
    awayteamRecentForm: "lose,draw,win,lose,draw",
    modelPredictions: [
      {
        predictedHomeGoal: 3,
        predictedAwayGoal: 0,
        confidenceLevel: 82,
        confidenceLevelReasoning: "PSG's dominant form and home advantage",
        predictedTotalGoals: 3.5,
        confidenceLevelPTG: 75,
        confidenceLevelReasoningPTG: "PSG's attacking power likely to produce goals",
        aiModel: { name: "Gemini", isActive: true }
      },
      {
        predictedHomeGoal: 2,
        predictedAwayGoal: 1,
        confidenceLevel: 78,
        confidenceLevelReasoning: "Le Classique always competitive despite form differences",
        predictedTotalGoals: 2.5,
        confidenceLevelPTG: 66,
        confidenceLevelReasoningPTG: "Marseille will likely score but PSG favored",
        aiModel: { name: "ChatGPT", isActive: true }
      },
      {
        predictedHomeGoal: 4,
        predictedAwayGoal: 1,
        confidenceLevel: 79,
        confidenceLevelReasoning: "PSG's perfect recent form against struggling Marseille",
        predictedTotalGoals: 4.5,
        confidenceLevelPTG: 72,
        confidenceLevelReasoningPTG: "High-scoring match expected with PSG dominance",
        aiModel: { name: "Grok", isActive: true }
      },
      {
        predictedHomeGoal: 3,
        predictedAwayGoal: 1,
        confidenceLevel: 85,
        confidenceLevelReasoning: "Statistical model strongly favors PSG based on current form",
        predictedTotalGoals: 4.5,
        confidenceLevelPTG: 80,
        confidenceLevelReasoningPTG: "High probability of over 4.5 goals",
        aiModel: { name: "ML", isActive: true }
      }
    ]
  }
];

// Mock countries and leagues data
export const mockCountries = [
  "England", "Spain", "Germany", "Italy", "France", "Portugal", "Netherlands", 
  "Argentina", "Brazil", "Mexico", "United States", "Belgium", "Turkey"
];

export const mockTopLeagues = [
  { name: "Premier League", country: "England" },
  { name: "LaLiga", country: "Spain" },
  { name: "Bundesliga", country: "Germany" },
  { name: "Serie A", country: "Italy" },
  { name: "Ligue 1", country: "France" },
  { name: "Primeira Liga", country: "Portugal" }
];

// Mock markets
export const mockMarkets = [
  { key: "over2_5", name: "Over 2.5", description: "Over 2.5 Goals" },
  { key: "over1_5", name: "Over 1.5", description: "Over 1.5 Goals" },
  { key: "under2_5", name: "Under 2.5", description: "Under 2.5 Goals" },
  { key: "under1_5", name: "Under 1.5", description: "Under 1.5 Goals" },
  { key: "GG", name: "BTTS (Yes)", description: "Both Teams to Score (Yes)" },
  { key: "NG", name: "BTTS (No)", description: "Both Teams to Score (No)" },
  { key: "home_win", name: "Home Win", description: "Home Team Win" },
  { key: "away_win", name: "Away Win", description: "Away Team Win" },
  { key: "draw", name: "Draw", description: "Match Draw" }
];

// Helper functions to extract data from fixtures
export function getUniqueLeagues(fixtures: Fixture[]): Array<{country: string, league: string}> {
  const leagues = new Map<string, {country: string, league: string}>();
  
  fixtures.forEach(fixture => {
    const key = `${fixture.country}-${fixture.league}`;
    if (!leagues.has(key)) {
      leagues.set(key, {
        country: fixture.country,
        league: fixture.league
      });
    }
  });
  
  return Array.from(leagues.values());
}

export function getUniqueCountries(fixtures: Fixture[]): string[] {
  const countries = new Set<string>();
  fixtures.forEach(fixture => countries.add(fixture.country));
  return Array.from(countries).sort();
}
