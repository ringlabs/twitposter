import { supabase } from "@/integrations/supabase/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Constants
const LOCAL_STORAGE_API_KEY = "gemini_api_key";
const LOCAL_STORAGE_NICHE_KEY = "selected_niche";
const LOCAL_STORAGE_FREE_TRIAL_KEY = "free_trial_used";
const LOCAL_STORAGE_CHAT_HISTORY_KEY = "chat_history";
const GEMINI_MODEL = "gemini-1.5-flash";
const FREE_TRIAL_API_KEY = "AIzaSyCETmVzAEQdD5lFpql415j06FjJlah59Gk";
const MAX_FREE_TRIAL_POSTS = 10;

// Types
interface ChatMessage {
  role: "user" | "model";
  parts: string;
  timestamp: number;
  nicheId: string;
  topic?: string;
}

// Supabase functions for user settings
async function getUserSettings() {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('id', session.session.user.id)
    .single();

  if (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }

  return data;
}

async function updateUserSettings(settings: Partial<{
  niche_preference: string;
  gemini_api_key: string;
  free_trial_used: number;
}>) {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from('user_settings')
    .update(settings)
    .eq('id', session.session.user.id);

  if (error) {
    console.error("Error updating user settings:", error);
    throw error;
  }
}

// API Key functions
export async function getApiKey(): Promise<string | null> {
  // Try to get from Supabase first
  const settings = await getUserSettings();
  if (settings?.gemini_api_key) {
    return settings.gemini_api_key;
  }
  
  // Fallback to localStorage
  return localStorage.getItem(LOCAL_STORAGE_API_KEY);
}

export async function setApiKey(apiKey: string): Promise<void> {
  // Save to Supabase if authenticated
  try {
    await updateUserSettings({ gemini_api_key: apiKey });
  } catch (error) {
    console.error("Error saving API key to Supabase:", error);
    // Fallback to localStorage if Supabase fails
    localStorage.setItem(LOCAL_STORAGE_API_KEY, apiKey);
  }
}

export async function clearApiKey(): Promise<void> {
  try {
    await updateUserSettings({ gemini_api_key: null });
  } catch (error) {
    console.error("Error clearing API key from Supabase:", error);
  }
  
  // Also clear from localStorage
  localStorage.removeItem(LOCAL_STORAGE_API_KEY);
}

// Niche preference functions
export async function getNichePreference(): Promise<string | null> {
  // Try to get from Supabase first
  const settings = await getUserSettings();
  if (settings?.niche_preference) {
    // Also update localStorage to keep in sync
    localStorage.setItem(LOCAL_STORAGE_NICHE_KEY, settings.niche_preference);
    return settings.niche_preference;
  }
  
  // Fallback to localStorage
  return localStorage.getItem(LOCAL_STORAGE_NICHE_KEY);
}

export async function setNichePreference(nicheId: string): Promise<void> {
  // Save to localStorage first for immediate use
  localStorage.setItem(LOCAL_STORAGE_NICHE_KEY, nicheId);
  
  // Then save to Supabase if authenticated
  try {
    await updateUserSettings({ niche_preference: nicheId });
  } catch (error) {
    console.error("Error saving niche preference to Supabase:", error);
  }
}

// Free trial functions
export async function getFreeTrialUsage(): Promise<number> {
  // Try to get from Supabase first
  const settings = await getUserSettings();
  if (settings) {
    // Update localStorage to keep in sync
    localStorage.setItem(LOCAL_STORAGE_FREE_TRIAL_KEY, settings.free_trial_used.toString());
    return settings.free_trial_used;
  }
  
  // Fallback to localStorage
  const usageStr = localStorage.getItem(LOCAL_STORAGE_FREE_TRIAL_KEY);
  return usageStr ? parseInt(usageStr, 10) : 0;
}

export async function incrementFreeTrialUsage(): Promise<void> {
  const currentUsage = await getFreeTrialUsage();
  const newUsage = currentUsage + 1;
  
  // Update localStorage first
  localStorage.setItem(LOCAL_STORAGE_FREE_TRIAL_KEY, newUsage.toString());
  
  // Then update Supabase if authenticated
  try {
    await updateUserSettings({ free_trial_used: newUsage });
  } catch (error) {
    console.error("Error updating free trial usage in Supabase:", error);
  }
}

export async function isFreeTrialExhausted(): Promise<boolean> {
  const usage = await getFreeTrialUsage();
  return usage >= MAX_FREE_TRIAL_POSTS;
}

// Chat history functions
export function getChatHistory(nicheId: string): ChatMessage[] {
  // Try to get from localStorage first (for backward compatibility)
  const storedHistory = localStorage.getItem(
    `${LOCAL_STORAGE_CHAT_HISTORY_KEY}_${nicheId}`
  );
  
  if (storedHistory) {
    try {
      return JSON.parse(storedHistory);
    } catch (error) {
      console.error("Error parsing chat history:", error);
      return [];
    }
  }
  
  return [];
}

export async function saveChatMessage(message: ChatMessage): Promise<void> {
  // Save to localStorage first
  const history = getChatHistory(message.nicheId);
  history.push(message);
  localStorage.setItem(
    `${LOCAL_STORAGE_CHAT_HISTORY_KEY}_${message.nicheId}`,
    JSON.stringify(history)
  );

  // Then save to Supabase if authenticated
  try {
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      await supabase.from('chat_history').insert({
        user_id: session.session.user.id,
        role: message.role,
        content: message.parts,
        niche_id: message.nicheId,
        topic: message.topic || null,
        timestamp: new Date(message.timestamp)
      });
    }
  } catch (error) {
    console.error("Error saving chat message to Supabase:", error);
  }
}

export async function clearChatHistory(): Promise<void> {
  const nicheId = await getNichePreference() || "general";
  localStorage.removeItem(`${LOCAL_STORAGE_CHAT_HISTORY_KEY}_${nicheId}`);
  
  // Also clear from Supabase if authenticated
  try {
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      await supabase.from('chat_history')
        .delete()
        .eq('user_id', session.session.user.id)
        .eq('niche_id', nicheId);
    }
  } catch (error) {
    console.error("Error clearing chat history from Supabase:", error);
  }
}

// Post generation and related functions
export async function generatePost(nicheId: string, topic?: string): Promise<string> {
  // Check if free trial is exhausted and user doesn't have API key
  const userApiKey = await getApiKey();
  const freeTrialExhausted = await isFreeTrialExhausted();
  
  if (!userApiKey && freeTrialExhausted) {
    throw new Error("Free trial exhausted. Please enter your API key.");
  }

  // Use user's API key if available, otherwise use free trial API key
  const apiKey = userApiKey || FREE_TRIAL_API_KEY;
  
  // If using free trial API key, increment usage
  if (!userApiKey) {
    await incrementFreeTrialUsage();
  }

  // Create prompt based on niche and topic
  const userPrompt = topic 
    ? `Create a Twitter post about ${topic} for the ${nicheId} niche.`
    : `Create a Twitter post for the ${nicheId} niche.`;

  // Generate post using Gemini
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    
    // Record user message
    const userMessage: ChatMessage = {
      role: "user",
      parts: userPrompt,
      timestamp: Date.now(),
      nicheId,
      topic
    };
    await saveChatMessage(userMessage);
    
    // Generate content
    const result = await model.generateContent(userPrompt);
    const text = result.response.text();
    
    // Record model response
    const modelMessage: ChatMessage = {
      role: "model",
      parts: text,
      timestamp: Date.now(),
      nicheId,
      topic
    };
    await saveChatMessage(modelMessage);
    
    return text;
  } catch (error) {
    console.error("Error generating post:", error);
    throw error;
  }
}

// Mock function for sharing to Twitter (not implemented yet)
export async function postToTwitter(content: string): Promise<boolean> {
  // This would be implemented with Twitter API
  console.log("Sharing to Twitter:", content);
  return true;
}
