import { GoogleGenerativeAI } from "@google/generative-ai";
import { toast } from "sonner";

// For security reasons, we'll create a component to let users enter their own API key
// In a production app, this should be stored in a backend service
let userApiKey: string | null = localStorage.getItem("gemini_api_key");

// Free trial API key and usage tracking
const FREE_TRIAL_KEY = "AIzaSyCETmVzAEQdD5lFpql415j06FjJlah59Gk";
const FREE_TRIAL_LIMIT = 5;
const FREE_TRIAL_USAGE_KEY = "free_trial_usage";

// Initialize the Google Generative AI client
let genAI: GoogleGenerativeAI | null = null;

if (userApiKey) {
  genAI = new GoogleGenerativeAI(userApiKey);
} else {
  // Use free trial key when no user key is provided
  genAI = new GoogleGenerativeAI(FREE_TRIAL_KEY);
}

// Mock responses as fallback if API key is not provided
const MOCK_RESPONSES: Record<string, string[]> = {
  history: [
    "On this day in 1969, humans first set foot on the Moon. Neil Armstrong's 'one small step' represented a giant leap for scientific achievement and human exploration. #SpaceHistory #Apollo11 #MoonLanding",
    "The Roman Empire lasted for over 1,000 years, but did you know it was actually larger in 117 AD under Emperor Trajan than at any other point? His military campaigns expanded Roman territory to 5 million square kilometers! #AncientHistory #RomanEmpire #HistoricalFacts",
  ],
  science: [
    "Scientists have discovered that octopuses actually edit their own RNA, allowing them to adapt to environmental changes without waiting for evolution to catch up. These incredible creatures are redefining what we know about genetic adaptation! #Science #Octopus #MarineBiology",
    "The James Webb Space Telescope just captured images of the most distant galaxy ever observed - light that has been traveling for 13.4 billion years! We're literally looking back to when the universe was only 300 million years old. #Astronomy #JWST #CosmicDiscovery",
  ],
  tech: [
    "AI can now write code better than most human programmers according to new benchmarks. The question isn't if AI will transform software development, but how quickly. Are we prepared for this shift? #AI #TechTrends #SoftwareDevelopment",
    "Quantum computers just hit a new milestone: 1,000 qubits. While still experimental, this brings us closer to solving problems that classical computers would take billions of years to calculate. The computing revolution continues! #QuantumComputing #FutureTech #Innovation",
  ],
  // Default fallback for all other niches
  default: [
    "The best time to start was yesterday. The second best time is now. Whatever you've been putting off, take the first small step today. Progress compounds faster than you think. #Motivation #Growth #TakeAction",
    "Did you know giraffes only sleep about 30 minutes per day? Talk about making the most of your waking hours! Nature's ultimate productivity hackers. #InterestingFacts #Wildlife #NatureFacts",
  ]
};

// Get a random response from the array (used as fallback)
const getRandomResponse = (responses: string[]) => {
  const randomIndex = Math.floor(Math.random() * responses.length);
  return responses[randomIndex];
};

export const getFreeTrialUsage = (): number => {
  const usage = localStorage.getItem(FREE_TRIAL_USAGE_KEY);
  return usage ? parseInt(usage, 10) : 0;
};

export const incrementFreeTrialUsage = (): void => {
  const currentUsage = getFreeTrialUsage();
  localStorage.setItem(FREE_TRIAL_USAGE_KEY, (currentUsage + 1).toString());
};

export const isFreeTrialExhausted = (): boolean => {
  return getFreeTrialUsage() >= FREE_TRIAL_LIMIT;
};

export const isUsingFreeTrial = (): boolean => {
  return !userApiKey && !isFreeTrialExhausted();
}

export const setApiKey = (key: string): void => {
  userApiKey = key;
  localStorage.setItem("gemini_api_key", key);
  genAI = new GoogleGenerativeAI(key);
  toast.success("API key saved successfully!");
};

export const getApiKey = (): string | null => {
  return userApiKey;
};

export const clearApiKey = (): void => {
  userApiKey = null;
  localStorage.removeItem("gemini_api_key");
  genAI = null;
  toast.success("API key removed");
};

export const generatePost = async (
  niche: string,
  specificTopic?: string
): Promise<string> => {
  try {
    // Check if we should use the free trial key
    if (!userApiKey && !isFreeTrialExhausted()) {
      // Use the free trial key
      genAI = new GoogleGenerativeAI(FREE_TRIAL_KEY);
      
      // Track free trial usage
      incrementFreeTrialUsage();
    } else if (!userApiKey && isFreeTrialExhausted()) {
      // Free trial exhausted, but no user API key
      throw new Error("Free trial exhausted. Please enter your API key.");
    } else if (userApiKey) {
      // Use user's API key
      genAI = new GoogleGenerativeAI(userApiKey);
    } else {
      // Use mock responses as fallback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (specificTopic) {
        return `Here's a post about ${specificTopic}: ${getRandomResponse(MOCK_RESPONSES.default)}`;
      }
      
      const nicheResponses = MOCK_RESPONSES[niche] || MOCK_RESPONSES.default;
      return getRandomResponse(nicheResponses);
    }

    // Use Gemini if we have an API key
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    let prompt = "";
    if (specificTopic) {
      prompt = `Create a Twitter post about ${specificTopic}. The post must be engaging, informative, and include relevant hashtags. Keep it under Twitter's character limit. Respond with just the text of the post, nothing else.`;
    } else {
      prompt = `Create a Twitter post about a topic in the ${niche} niche. The post must be engaging, informative, and include relevant hashtags. Keep it under Twitter's character limit. Respond with just the text of the post, nothing else.`;
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 280, // Twitter's character limit
      },
    });
    
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating post with Gemini:", error);
    
    if (error instanceof Error && error.message === "Free trial exhausted. Please enter your API key.") {
      toast.error("Free trial exhausted. Please enter your API key.");
      throw error;
    }
    
    toast.error("Failed to generate post with Gemini API");
    
    // Fallback to mock responses
    if (specificTopic) {
      return `Here's a post about ${specificTopic}: ${getRandomResponse(MOCK_RESPONSES.default)}`;
    }
    
    const nicheResponses = MOCK_RESPONSES[niche] || MOCK_RESPONSES.default;
    return getRandomResponse(nicheResponses);
  }
};

export const generateAlternativePost = async (
  niche: string,
  specificTopic?: string
): Promise<string> => {
  try {
    // If we don't have an API key, use the original generatePost function
    if (!genAI || !userApiKey) {
      return generatePost(niche, specificTopic);
    }

    // Use Gemini if we have an API key
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    let prompt = "";
    if (specificTopic) {
      prompt = `Create a different Twitter post about ${specificTopic}. The previous one wasn't quite right. Make this one more engaging, informative, and include relevant hashtags. Keep it under Twitter's character limit. Respond with just the text of the post, nothing else.`;
    } else {
      prompt = `Create a different Twitter post about a topic in the ${niche} niche. The previous one wasn't quite right. Make this one more engaging, informative, and include relevant hashtags. Keep it under Twitter's character limit. Respond with just the text of the post, nothing else.`;
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 280, // Twitter's character limit
      },
    });
    
    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error generating alternative post with Gemini:", error);
    toast.error("Failed to generate alternative post with Gemini API");
    
    // Fallback to the original generatePost function
    return generatePost(niche, specificTopic);
  }
};

// Helper function to open Twitter with pre-populated post
export const postToTwitter = (text: string): void => {
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(twitterIntentUrl, '_blank');
};
