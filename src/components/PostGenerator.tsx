import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LOCAL_STORAGE_NICHE_KEY } from "@/constants/niches";
import { generatePost, isFreeTrialExhausted, getFreeTrialUsage, getApiKey } from "@/services/postGeneratorService";
import GeneratedPost from "./GeneratedPost";
import { NICHES } from "@/constants/niches";
import { Sparkles, Pencil, KeyRound } from "lucide-react";
import { toast } from "sonner";
import Header from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";
import ApiKeyInput from "./ApiKeyInput";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const isMobile = useIsMobile();
  const selectedNicheId = localStorage.getItem(LOCAL_STORAGE_NICHE_KEY) || "general";
  const selectedNiche = NICHES.find(niche => niche.id === selectedNicheId) || {
    id: "general",
    name: "General"
  };
  const hasFreeTrialPosts = !isFreeTrialExhausted();
  const freeTrialRemaining = 5 - getFreeTrialUsage();
  const userHasApiKey = !!getApiKey();

  // Load post history from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts) as Post[];
        setPostHistory(parsedPosts);
      } catch (error) {
        console.error("Error parsing saved posts:", error);
      }
    }
  }, []);

  // Save post history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(postHistory));
  }, [postHistory]);
  const addPostToHistory = (content: string, topic?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      timestamp: Date.now(),
      nicheId: selectedNicheId,
      topic
    };
    setPostHistory(prevPosts => [newPost, ...prevPosts]);
  };
  const handleAutoGenerate = async () => {
    if (!userHasApiKey && !hasFreeTrialPosts) {
      setShowApiKeyModal(true);
      return;
    }
    setIsGenerating(true);
    try {
      const post = await generatePost(selectedNicheId);
      addPostToHistory(post);
      if (!userHasApiKey && hasFreeTrialPosts) {
        const remainingPosts = freeTrialRemaining - 1;
        toast.info(`You have ${remainingPosts} free trial posts remaining`);
      }
    } catch (error) {
      console.error("Error generating post:", error);
      if (error instanceof Error && error.message === "Free trial exhausted. Please enter your API key.") {
        setShowApiKeyModal(true);
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
      setShowApiKeyModal(true);
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
        toast.info(`You have ${remainingPosts} free trial posts remaining`);
      }
    } catch (error) {
      console.error("Error generating post:", error);
      if (error instanceof Error && error.message === "Free trial exhausted. Please enter your API key.") {
        setShowApiKeyModal(true);
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
  const handleApiKeySetup = () => {
    setShowApiKeyModal(false);
  };
  return <div className="w-full max-w-2xl mx-auto px-0">
      <Header onGeneratePost={handleGeneratePost} />
      
      {!isMobile && <div>
          <p className="text-twitter-darkGray dark:text-gray-300 mb-4">
            Currently generating posts for <span className="font-medium text-twitter-blue">{selectedNiche.name}</span>
          </p>
          {!userHasApiKey && hasFreeTrialPosts && <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3 mb-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <span className="font-medium">Free Trial: </span> 
                You have {freeTrialRemaining} posts remaining. Enter your API key in settings to continue generating posts after your trial ends.
              </p>
            </div>}
        </div>}

      {showSpecifyForm && <Card className="mb-6 border-twitter-blue/30 shadow-md dark:bg-gray-800 dark:border-twitter-blue/50">
          <CardHeader>
            <CardTitle className="text-lg dark:text-white">Create a Post on a Specific Topic</CardTitle>
          </CardHeader>
          <form onSubmit={handleSpecificGenerate}>
            <CardContent>
              <Textarea placeholder="What would you like to post about?" value={specificTopic} onChange={e => setSpecificTopic(e.target.value)} className="resize-none border-twitter-lightGray focus:border-twitter-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
            </CardContent>
            <CardFooter className="bg-twitter-extraLightGray dark:bg-gray-800 flex justify-between">
              <Button type="button" variant="ghost" className="dark:text-white dark:hover:bg-gray-700" onClick={() => setShowSpecifyForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!specificTopic.trim() || isGenerating} className="bg-twitter-blue hover:bg-twitter-darkBlue dark:text-white">
                {isGenerating ? "Generating..." : "Generate Post"}
              </Button>
            </CardFooter>
          </form>
        </Card>}

      {isGenerating && postHistory.length === 0 && <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <Sparkles className="h-10 w-10 text-twitter-blue mb-3" />
            <p className="text-twitter-darkGray dark:text-gray-300">Crafting your perfect tweet...</p>
          </div>
        </div>}

      {postHistory.length > 0 && <div className="space-y-6">
          {postHistory.map(post => <GeneratedPost key={post.id} content={post.content} isLoading={false} />)}
        </div>}
      
      <Dialog open={showApiKeyModal} onOpenChange={setShowApiKeyModal}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">API Key Required</DialogTitle>
            <DialogDescription className="dark:text-gray-300">
              Your free trial has ended. Please enter your Gemini API key to continue generating posts.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4">
            <ApiKeyInput onComplete={handleApiKeySetup} />
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default PostGenerator;