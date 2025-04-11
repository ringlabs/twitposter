
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Constants (must match those in postGeneratorService.ts)
const LOCAL_STORAGE_API_KEY = "gemini_api_key";
const LOCAL_STORAGE_NICHE_KEY = "selected_niche";
const LOCAL_STORAGE_FREE_TRIAL_KEY = "free_trial_used";
const LOCAL_STORAGE_CHAT_HISTORY_KEY = "chat_history";
const LOCAL_STORAGE_POSTS_KEY = "twitter_generated_posts";

/**
 * Migrates user data from localStorage to Supabase database after authentication
 * This includes API key, niche preference, free trial usage, and chat history
 */
export async function migrateLocalDataToDatabase(): Promise<void> {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) {
    console.log("No active session, skipping data migration");
    return;
  }

  console.log("Starting data migration from localStorage to Supabase");
  const userId = session.session.user.id;
  
  try {
    // First, check if user already has data in Supabase
    const { data: userSettings } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', userId)
      .single();
    
    // If user has no settings record yet, create one
    if (!userSettings) {
      await supabase.from('user_settings').insert({ id: userId });
    }
    
    // Prepare settings update with localStorage data
    const settingsToUpdate: Record<string, any> = {};
    
    // 1. Migrate API key if exists in localStorage and not in Supabase
    const localApiKey = localStorage.getItem(LOCAL_STORAGE_API_KEY);
    if (localApiKey && (!userSettings || !userSettings.gemini_api_key)) {
      settingsToUpdate.gemini_api_key = localApiKey;
    }
    
    // 2. Migrate niche preference if exists in localStorage and not in Supabase
    const localNiche = localStorage.getItem(LOCAL_STORAGE_NICHE_KEY);
    if (localNiche && (!userSettings || !userSettings.niche_preference)) {
      settingsToUpdate.niche_preference = localNiche;
    }
    
    // 3. Migrate free trial usage if exists in localStorage
    const localFreeTrialUsage = localStorage.getItem(LOCAL_STORAGE_FREE_TRIAL_KEY);
    if (localFreeTrialUsage) {
      const localUsageNum = parseInt(localFreeTrialUsage, 10);
      const currentUsage = userSettings?.free_trial_used || 0;
      // Use the higher value to avoid losing usage data
      if (localUsageNum > currentUsage) {
        settingsToUpdate.free_trial_used = localUsageNum;
      }
    }
    
    // Update user settings with migrated data if we have any
    if (Object.keys(settingsToUpdate).length > 0) {
      const { error: updateError } = await supabase
        .from('user_settings')
        .update(settingsToUpdate)
        .eq('id', userId);
        
      if (updateError) {
        console.error("Error updating user settings:", updateError);
      } else {
        console.log("Successfully migrated user settings", settingsToUpdate);
      }
    }
    
    // 4. Migrate chat history for each niche
    const allNiches = ["general", "tech", "business", "health", "education", 
                       "finance", "marketing", "travel", "food", "fashion", 
                       "sports", "entertainment", "science", "programming"];
    
    for (const niche of allNiches) {
      const chatHistoryKey = `${LOCAL_STORAGE_CHAT_HISTORY_KEY}_${niche}`;
      const localChatHistory = localStorage.getItem(chatHistoryKey);
      
      if (localChatHistory) {
        try {
          const chatMessages = JSON.parse(localChatHistory);
          if (Array.isArray(chatMessages) && chatMessages.length > 0) {
            // Check if these messages are already in Supabase by timestamp
            const timestamps = chatMessages.map(msg => msg.timestamp);
            
            const { data: existingMessages } = await supabase
              .from('chat_history')
              .select('timestamp')
              .eq('user_id', userId)
              .eq('niche_id', niche)
              .in('timestamp', timestamps.map(t => new Date(t).toISOString()));
            
            // Filter out messages that are already in the database
            const existingTimestamps = new Set(existingMessages?.map(msg => new Date(msg.timestamp).getTime()));
            const newMessages = chatMessages.filter(msg => !existingTimestamps.has(msg.timestamp));
            
            if (newMessages.length > 0) {
              // Batch insert new messages to Supabase
              const messagesToInsert = newMessages.map(msg => ({
                user_id: userId,
                role: msg.role,
                content: msg.parts,
                niche_id: msg.nicheId || niche,
                topic: msg.topic || null,
                timestamp: new Date(msg.timestamp).toISOString()
              }));
              
              // Insert in batches to avoid payload size limits
              const batchSize = 50;
              for (let i = 0; i < messagesToInsert.length; i += batchSize) {
                const batch = messagesToInsert.slice(i, i + batchSize);
                const { error: insertError } = await supabase
                  .from('chat_history')
                  .insert(batch);
                  
                if (insertError) {
                  console.error(`Error migrating chat history batch for niche ${niche}:`, insertError);
                } else {
                  console.log(`Migrated ${batch.length} chat messages for niche ${niche}`);
                }
              }
            }
          }
        } catch (error) {
          console.error(`Error parsing chat history for niche ${niche}:`, error);
        }
      }
    }
    
    toast.success("Local data successfully migrated to your account", {
      duration: 5000
    });
    
    console.log("Data migration complete");
  } catch (error) {
    console.error("Error during data migration:", error);
    toast.error("There was an issue migrating your local data");
  }
}
