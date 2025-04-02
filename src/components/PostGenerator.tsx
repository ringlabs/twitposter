import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LOCAL_STORAGE_NICHE_KEY } from "@/constants/niches";
import { generatePost, isFreeTrialExhausted, getFreeTrialUsage, getApiKey } from "@/services/postGeneratorService";
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
  const hasFreeTrialPosts = !isFreeTrialExhausted();
  const freeTrialRemaining = 5 - getFreeTrialUsage();
  const userHasApiKey = !!getApiKey();
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
      window.location.reload();
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
  return <div className="w-full max-w-2xl mx-auto md:px-0 px-2">
      <div className="sticky top-0 bg-white dark:bg-gray-900 z-10 h-0">
        <Header onGeneratePost={handleGeneratePost} />
      </div>
      
      {!isMobile && <div className="animate-fade-in">
          <div className="flex items-center mb-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700">
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

      {showSpecifyForm && <Card className="mb-6 border-twitter-blue/30 shadow-md dark:bg-gray-800 dark:border-twitter-blue/50 rounded-xl animate-fade-in card-modern">
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
          <Card className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader className="pb-0">
              <Skeleton noPulse className="h-6 w-1/3 mb-2" />
              <Skeleton noPulse className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <Skeleton noPulse className="h-4 w-full" />
                <Skeleton noPulse className="h-4 w-full" />
                <Skeleton noPulse className="h-4 w-5/6" />
                <Skeleton noPulse className="h-4 w-4/6" />
              </div>
            </CardContent>
            <CardFooter className="border-t bg-gray-50 dark:bg-gray-800 dark:border-gray-700 pt-3">
              <div className="flex justify-between w-full">
                <Skeleton noPulse className="h-9 w-24" />
                <Skeleton noPulse className="h-9 w-24" />
              </div>
            </CardFooter>
          </Card>
        </div>}

      {postHistory.length > 0 && <div className="space-y-6">
          {postHistory.map((post, index) => <div key={post.id} className="animate-fade-in" style={{
        animationDelay: `${index * 0.1}s`
      }}>
              <GeneratedPost content={post.content} isLoading={false} />
            </div>)}
        </div>}
    </div>;
};
export default PostGenerator;