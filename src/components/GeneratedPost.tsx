
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Twitter, Copy, Share, ThumbsUp } from "lucide-react";
import { postToTwitter } from "@/services/postGeneratorService";

interface GeneratedPostProps {
  content: string;
  onRequestAnother?: () => void;
  isLoading?: boolean;
}

const GeneratedPost = ({
  content,
  onRequestAnother,
  isLoading
}: GeneratedPostProps) => {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      toast.success("Post copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error("Failed to copy post");
    });
  };
  
  const handlePostToTwitter = () => {
    postToTwitter(content);
    toast.success("Opening Twitter to share your post");
  };

  const handleLike = () => {
    setLiked(!liked);
    if (!liked) {
      toast.success("Post added to favorites");
    }
  };
  
  return (
    <Card className="w-full border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl dark:bg-gray-800 card-modern">
      <CardContent className="p-5">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 min-h-[120px] relative">
          {/* Twitter-like post format */}
          <div className="flex mb-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-twitter-blue text-white font-bold">
                T
              </div>
            </div>
            <div className="ml-3">
              <p className="font-bold text-gray-900 dark:text-white">TwitWise AI</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@twitwise_ai</p>
            </div>
          </div>
          
          <p className="text-gray-800 whitespace-pre-wrap dark:text-white text-[15px] leading-relaxed">
            {content}
          </p>
          
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            {new Date().toLocaleTimeString()} · TwitWise Creator
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 dark:bg-gray-800 rounded-b-xl flex flex-wrap gap-2 justify-between py-3 px-4 border-t border-gray-100 dark:border-gray-700">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopy} 
            className="bg-white text-gray-600 hover:text-twitter-blue hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-white dark:border-gray-600 rounded-lg button-modern" 
            disabled={copied}
          >
            {copied ? "Copied!" : "Copy"}
            <Copy className="ml-2 h-4 w-4" />
          </Button>
          
          <Button 
            onClick={handlePostToTwitter} 
            size="sm" 
            className="bg-twitter-blue hover:bg-twitter-darkBlue text-white rounded-lg button-modern"
          >
            Share
            <Twitter className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`text-gray-500 hover:text-pink-500 dark:text-gray-400 ${liked ? 'text-pink-500 bg-pink-50 dark:bg-pink-900/20 dark:text-pink-400' : ''}`}
          >
            <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default GeneratedPost;
