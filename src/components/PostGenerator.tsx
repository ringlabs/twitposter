
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LOCAL_STORAGE_NICHE_KEY } from "@/constants/niches";
import { 
  generatePost, 
  isFreeTrialExhausted, 
  getFreeTrialUsage, 
  getApiKey, 
  getChatHistory, 
  saveChatMessage, 
  clearChatHistory,
  deleteChatMessage
} from "@/services/postGeneratorService";
import GeneratedPost from "./GeneratedPost";
import { NICHES } from "@/constants/niches";
import { Sparkles, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  content: string;
  timestamp: number;
  nicheId: string;
  topic?: string;
}

const POSTS_STORAGE_KEY = "twitter_generated_posts";

const PostGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSpecifyForm, setShowSpecifyForm] = useState(false);
  const [specificTopic, setSpecificTopic] = useState("");
  const [postHistory, setPostHistory] = useState<Post[]>([]);
  const isMobile = useIsMobile();
  
  const selectedNicheId = localStorage.getItem(LOCAL_STORAGE_NICHE_KEY) || "general";
  const selectedNiche = NICHES.find(niche => niche.id === selectedNicheId) || {
    id: "general",
    name: "General"
  };

  const [freeTrialRemaining, setFreeTrialRemaining] = useState(0);
  const [hasFreeTrialPosts, setHasFreeTrialPosts] = useState(false);
  const [userHasApiKey, setUserHasApiKey] = useState(false);

  useEffect(() => {
    const loadUserStatus = async () => {
      const freeTrialExhausted = await isFreeTrialExhausted();
      const freeTrialUsage = await getFreeTrialUsage();
      const apiKey = await getApiKey();
      
      setHasFreeTrialPosts(!freeTrialExhausted);
      setFreeTrialRemaining(10 - freeTrialUsage);
      setUserHasApiKey(!!apiKey);
    };
    
    loadUserStatus();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      // Try to load from localStorage first for fast loading
      const savedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
      if (savedPosts) {
        try {
          const parsedPosts = JSON.parse(savedPosts) as Post[];
          if (parsedPosts && parsedPosts.length > 0) {
            console.log("Loaded saved posts from localStorage:", parsedPosts);
            setPostHistory(parsedPosts);
            
            // Still load from chat history to ensure we have the latest
            reconstructPostsFromChatHistory();
            return;
          }
        } catch (error) {
          console.error("Error parsing saved posts:", error);
        }
      }
      
      reconstructPostsFromChatHistory();
    };
    
    loadPosts();
  }, []);

  useEffect(() => {
    if (postHistory.length > 0) {
      console.log("Saving posts to localStorage:", postHistory);
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(postHistory));
    }
  }, [postHistory]);

  const reconstructPostsFromChatHistory = async () => {
    try {
      const chatHistory = await getChatHistory(selectedNicheId);
      const modelMessages = chatHistory.filter(msg => msg.role === "model");
      
      if (modelMessages.length > 0) {
        const reconstructedPosts = modelMessages.map(msg => ({
          id: msg.timestamp.toString(),
          content: msg.parts,
          timestamp: msg.timestamp,
          nicheId: msg.nicheId,
          topic: msg.topic
        }));
        
        setPostHistory(reconstructedPosts);
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(reconstructedPosts));
        console.log("Reconstructed posts from chat history:", reconstructedPosts);
      }
    } catch (error) {
      console.error("Error reconstructing posts from chat history:", error);
    }
  };

  const addPostToHistory = (content: string, topic?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
      nicheId: selectedNicheId,
      topic
    };
    
    setPostHistory(prevPosts => {
      const updatedPosts = [newPost, ...prevPosts];
      return updatedPosts;
    });
  };

  const deletePost = async (postId: string) => {
    const postToDelete = postHistory.find(post => post.id === postId);
    
    if (postToDelete) {
      setPostHistory(prevPosts => prevPosts.filter(post => post.id !== postId));
      
      // Delete from database/localStorage
      try {
        const timestamp = parseInt(postId, 10);
        
        // First, find and delete the model message
        await deleteChatMessage(timestamp, selectedNicheId);
        
        // Second, try to find and delete the related user message (usually right before this one)
        // This is a bit tricky without having exact timestamps, so we get chat history again
        const chatHistory = await getChatHistory(selectedNicheId);
        const modelIndex = chatHistory.findIndex(msg => 
          msg.role === "model" && msg.timestamp === timestamp
        );
        
        if (modelIndex > 0) {
          // User message is typically right before the model message
          const userMessage = chatHistory[modelIndex - 1];
          if (userMessage && userMessage.role === "user") {
            await deleteChatMessage(userMessage.timestamp, selectedNicheId);
          }
        }
        
        // Update localStorage cache too
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(
          postHistory.filter(post => post.id !== postId)
        ));
        
      } catch (error) {
        console.error("Error deleting messages:", error);
        toast.error("Error deleting post");
      }
    }
  };

  const handleAutoGenerate = async () => {
    if (!userHasApiKey && !hasFreeTrialPosts) {
      window.location.reload();
      return;
    }
    setIsGenerating(true);
    try {
      const post = await generatePost(selectedNicheId);
      addPostToHistory(post);
      if (!userHasApiKey && hasFreeTrialPosts) {
        const remainingPosts = freeTrialRemaining - 1;
        setFreeTrialRemaining(remainingPosts);
        toast.info(`You have ${remainingPosts} free trial posts remaining`);
      }
    } catch (error) {
      console.error("Error generating post:", error);
      if (error instanceof Error && error.message === "Free trial exhausted. Please enter your API key.") {
        window.location.reload();
      } else {
        toast.error("Failed to generate post");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSpecificGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userHasApiKey && !hasFreeTrialPosts) {
      window.location.reload();
      return;
    }
    setIsGenerating(true);
    setShowSpecifyForm(false);
    try {
      const post = await generatePost(selectedNicheId, specificTopic);
      addPostToHistory(post, specificTopic);
      setSpecificTopic("");
      if (!userHasApiKey && hasFreeTrialPosts) {
        const remainingPosts = freeTrialRemaining - 1;
        setFreeTrialRemaining(remainingPosts);
        toast.info(`You have ${remainingPosts} free trial posts remaining`);
      }
    } catch (error) {
      console.error("Error generating post:", error);
      if (error instanceof Error && error.message === "Free trial exhausted. Please enter your API key.") {
        window.location.reload();
      } else {
        toast.error("Failed to generate post");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGeneratePost = (specifyTopic = false) => {
    if (specifyTopic) {
      setShowSpecifyForm(true);
    } else {
      handleAutoGenerate();
    }
  };

  return <div className="w-full max-w-2xl mx-auto p-0">
      <div className="sticky top-0 bg-transparent z-10 p-0 mb-6 w-full">
        <Header onGeneratePost={handleGeneratePost} />
      </div>
      
      {!isMobile && <div className="animate-fade-in">
          <div className="flex items-center mb-6 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700 mx-[16px] bg-gray-100 dark:bg-gray-800">
            <div className="flex-1">
              <p className="text-twitter-darkGray dark:text-gray-300 mb-1">
                Currently generating posts for <span className="font-medium text-twitter-blue">{selectedNiche.name}</span>
              </p>
              {!userHasApiKey && hasFreeTrialPosts && <p className="text-sm text-blue-700 dark:text-blue-300">
                  <span className="font-medium">Free Trial: </span> 
                  You have {freeTrialRemaining} posts remaining
                </p>}
            </div>
            <div>
              <Button className="bg-twitter-blue hover:bg-twitter-darkBlue text-white rounded-full button-modern shadow-sm" size="sm" onClick={() => handleGeneratePost(false)}>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </div>}

      {showSpecifyForm && <Card className="mb-6 border-twitter-blue/30 shadow-md dark:bg-gray-800 dark:border-twitter-blue/50 rounded-xl animate-fade-in card-modern mx-4">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white flex items-center">
              <MessageCircle className="mr-2 h-5 w-5 text-twitter-blue" />
              Create a Post on a Specific Topic
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSpecificGenerate}>
            <CardContent>
              <Textarea placeholder="What would you like to post about?" value={specificTopic} onChange={e => setSpecificTopic(e.target.value)} className="resize-none border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white input-modern h-24" required />
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800 rounded-b-xl flex justify-between">
              <Button type="button" variant="ghost" className="dark:text-white dark:hover:bg-gray-700" onClick={() => setShowSpecifyForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!specificTopic.trim() || isGenerating} className="bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white button-modern">
                {isGenerating ? "Generating..." : "Generate Post"}
              </Button>
            </CardFooter>
          </form>
        </Card>}

      {isGenerating && <div className="mb-6 animate-fade-in">
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
            <CardContent className="p-5">
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 min-h-[120px]">
                <div className="flex mb-3">
                  <Skeleton className="flex-shrink-0 w-10 h-10 rounded-full" />
                  <div className="ml-3 space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                
                <div className="mt-4">
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="bg-gray-50 dark:bg-gray-800 rounded-b-xl py-3 px-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex gap-2 w-full justify-between">
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </CardFooter>
          </Card>
        </div>}

      {postHistory.length > 0 && <div className="space-y-6 px-4 pb-12">
          {postHistory.map((post, index) => <div key={post.id} className="animate-fade-in" style={{
        animationDelay: `${index * 0.1}s`
      }}>
              <GeneratedPost content={post.content} isLoading={false} onDelete={() => deletePost(post.id)} />
            </div>)}
        </div>}
    </div>;
};

export default PostGenerator;
