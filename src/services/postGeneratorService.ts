
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

// Chat history functions - updated to use database
export async function getChatHistory(nicheId: string): Promise<ChatMessage[]> {
  // Try to get from Supabase first
  try {
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      const { data, error } = await supabase
        .from('chat_history')
        .select('role, content, timestamp, niche_id, topic')
        .eq('user_id', session.session.user.id)
        .eq('niche_id', nicheId)
        .order('timestamp', { ascending: false });
      
      if (error) {
        console.error("Error fetching chat history from database:", error);
      } else if (data && data.length > 0) {
        // Convert from database format to ChatMessage format
        const messages = data.map(item => ({
          role: item.role as "user" | "model",
          parts: item.content,
          timestamp: new Date(item.timestamp).getTime(),
          nicheId: item.niche_id,
          topic: item.topic || undefined
        }));
        
        // Clear local storage since we've migrated to database
        localStorage.removeItem(`${LOCAL_STORAGE_CHAT_HISTORY_KEY}_${nicheId}`);
        
        return messages;
      }
    }
  } catch (error) {
    console.error("Error accessing database for chat history:", error);
  }
  
  // Fallback to localStorage if database access fails or no data found
  const storedHistory = localStorage.getItem(`${LOCAL_STORAGE_CHAT_HISTORY_KEY}_${nicheId}`);
  if (storedHistory) {
    try {
      const localMessages = JSON.parse(storedHistory) as ChatMessage[];
      
      // If we have local messages but couldn't access database, attempt to migrate them
      const { data: session } = await supabase.auth.getSession();
      if (session.session && localMessages.length > 0) {
        console.log(`Migrating ${localMessages.length} local messages to database for niche ${nicheId}`);
        
        // Batch insert messages to database
        try {
          const messagesToInsert = localMessages.map(msg => ({
            user_id: session.session.user.id,
            role: msg.role,
            content: msg.parts,
            niche_id: msg.nicheId || nicheId,
            topic: msg.topic || null,
            timestamp: new Date(msg.timestamp).toISOString()
          }));
          
          const { error: insertError } = await supabase
            .from('chat_history')
            .insert(messagesToInsert);
            
          if (insertError) {
            console.error("Error migrating chat history to database:", insertError);
          } else {
            // Clear localStorage after successful migration
            localStorage.removeItem(`${LOCAL_STORAGE_CHAT_HISTORY_KEY}_${nicheId}`);
            console.log("Chat history successfully migrated to database");
          }
        } catch (migrationError) {
          console.error("Error during chat history migration:", migrationError);
        }
      }
      
      return localMessages;
    } catch (parseError) {
      console.error("Error parsing chat history from localStorage:", parseError);
      return [];
    }
  }
  
  return [];
}

export async function saveChatMessage(message: ChatMessage): Promise<void> {
  try {
    // Try to save to Supabase first
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      const { error } = await supabase.from('chat_history').insert({
        user_id: session.session.user.id,
        role: message.role,
        content: message.parts,
        niche_id: message.nicheId,
        topic: message.topic || null,
        timestamp: new Date(message.timestamp).toISOString()
      });
      
      if (error) {
        console.error("Error saving chat message to database:", error);
        // Fallback to localStorage if database save fails
        saveToLocalStorage(message);
      } else {
        console.log("Chat message saved to database:", message.parts.substring(0, 20) + "...");
        return; // Success - exit function
      }
    } else {
      // Not authenticated, use localStorage
      saveToLocalStorage(message);
    }
  } catch (error) {
    console.error("Error during chat message save:", error);
    // Fallback to localStorage
    saveToLocalStorage(message);
  }
  
  // Helper function to save to localStorage
  function saveToLocalStorage(msg: ChatMessage) {
    const history = getChatHistoryFromLocalStorage(msg.nicheId);
    history.push(msg);
    localStorage.setItem(
      `${LOCAL_STORAGE_CHAT_HISTORY_KEY}_${msg.nicheId}`,
      JSON.stringify(history)
    );
    console.log("Chat message saved to localStorage");
  }
  
  // Helper function to get chat history from localStorage only
  function getChatHistoryFromLocalStorage(nicheId: string): ChatMessage[] {
    const storedHistory = localStorage.getItem(`${LOCAL_STORAGE_CHAT_HISTORY_KEY}_${nicheId}`);
    if (storedHistory) {
      try {
        return JSON.parse(storedHistory);
      } catch (error) {
        console.error("Error parsing local chat history:", error);
        return [];
      }
    }
    return [];
  }
}

export async function deleteChatMessage(timestamp: number, nicheId: string): Promise<void> {
  try {
    // Try to delete from Supabase first
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      const timestampIso = new Date(timestamp).toISOString();
      
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', session.session.user.id)
        .eq('niche_id', nicheId)
        .eq('timestamp', timestampIso);
      
      if (error) {
        console.error("Error deleting chat message from database:", error);
      } else {
        console.log("Chat message deleted from database");
        return; // Success - exit function
      }
    }
  } catch (error) {
    console.error("Error during chat message deletion:", error);
  }
  
  // Fallback to deleting from localStorage
  try {
    const localStorageKey = `${LOCAL_STORAGE_CHAT_HISTORY_KEY}_${nicheId}`;
    const storedHistory = localStorage.getItem(localStorageKey);
    
    if (storedHistory) {
      const messages = JSON.parse(storedHistory) as ChatMessage[];
      const filteredMessages = messages.filter(msg => msg.timestamp !== timestamp);
      
      if (filteredMessages.length < messages.length) {
        localStorage.setItem(localStorageKey, JSON.stringify(filteredMessages));
        console.log("Chat message deleted from localStorage");
      }
    }
  } catch (localError) {
    console.error("Error deleting chat message from localStorage:", localError);
  }
}

export async function clearChatHistory(nicheId: string): Promise<void> {
  try {
    // Try to clear from Supabase first
    const { data: session } = await supabase.auth.getSession();
    if (session.session) {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('user_id', session.session.user.id)
        .eq('niche_id', nicheId);
      
      if (error) {
        console.error("Error clearing chat history from database:", error);
      } else {
        console.log("Chat history cleared from database");
      }
    }
  } catch (error) {
    console.error("Error during chat history clearing:", error);
  }
  
  // Also clear from localStorage for consistency
  localStorage.removeItem(`${LOCAL_STORAGE_CHAT_HISTORY_KEY}_${nicheId}`);
  console.log("Chat history cleared from localStorage");
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

// Export supabase for use in AuthContext
export { supabase };
