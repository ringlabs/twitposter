
export const NICHES = [
  { id: 'history', name: 'History' },
  { id: 'science', name: 'Science' },
  { id: 'tech', name: 'Technology' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'business', name: 'Business & Entrepreneurship' },
  { id: 'finance', name: 'Finance & Investing' },
  { id: 'crypto', name: 'Cryptocurrency' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'social', name: 'Social Media' },
  { id: 'psychology', name: 'Psychology' },
  { id: 'education', name: 'Education' },
  { id: 'motivation', name: 'Motivation & Productivity' },
  { id: 'fun', name: 'Fun & Entertainment' },
  { id: 'facts', name: 'Interesting Facts' },
  { id: 'quotes', name: 'Quotes & Inspiration' },
  { id: 'art', name: 'Art & Design' },
  { id: 'travel', name: 'Travel & Adventure' },
  { id: 'food', name: 'Food & Cooking' },
  { id: 'sports', name: 'Sports & Fitness' },
  { id: 'books', name: 'Books & Literature' }
];

export const LOCAL_STORAGE_NICHE_KEY = 'twitwise-selected-niche';

/**
 * Get the display name of a niche by its ID
 * @param nicheId The ID of the niche
 * @returns The display name of the niche, or "General" if not found
 */
export const getNicheValue = (nicheId: string): string => {
  const niche = NICHES.find(n => n.id === nicheId);
  return niche ? niche.name : "General";
};
