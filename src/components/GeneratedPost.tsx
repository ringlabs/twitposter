import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Twitter, Copy, Trash2, X } from "lucide-react";
import { postToTwitter } from "@/services/postGeneratorService";
import { Skeleton } from "@/components/ui/skeleton";

interface GeneratedPostProps {
  content: string;
  onRequestAnother?: () => void;
  isLoading?: boolean;
  onDelete?: () => void;
}

const GeneratedPost = ({
  content,
  onRequestAnother,
  isLoading = false,
  onDelete
}: GeneratedPostProps) => {
  const [copied, setCopied] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

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

  const handleDelete = () => {
    if (deleteConfirm && onDelete) {
      onDelete();
      toast.success("Post deleted");
      setDeleteConfirm(false); // Reset state after deletion
    } else {
      setDeleteConfirm(true);
    }
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm(false);
  };

  if (isLoading) {
    return <Card className="w-full border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl dark:bg-gray-800 card-modern">
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
            </div>
            
            <div className="mt-4">
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 dark:bg-gray-800 rounded-b-xl py-3 px-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex gap-2 w-full justify-between">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </CardFooter>
      </Card>;
  }

  return <Card className="w-full border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl dark:bg-gray-800 card-modern">
      <CardContent className="p-1">
        <div className="rounded-xl p-5 border border-white dark:border-gray-800 min-h-[120px] relative bg-gray-200 dark:bg-gray-900">
          <div className="flex mb-3">
            <div className="flex-shrink-0 w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-twitter-blue text-white font-bold">
                TP
              </div>
            </div>
            <div className="ml-3">
              <p className="font-bold text-gray-900 dark:text-white">TwitPoster AI</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">@twitposter_ai</p>
            </div>
          </div>
          
          <p className="text-gray-800 whitespace-pre-wrap dark:text-white text-[15px] leading-relaxed">
            {content}
          </p>
          
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            {new Date().toLocaleTimeString()} · TwitPoster Creator
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="rounded-b-xl flex flex-wrap gap-2 justify-between py-2 px-2 border-t border-gray-100 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={copied} className="bg-gray-100 text-gray-600 hover:text-twitter-blue hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:text-white dark:border-gray-600 rounded-lg button-modern">
            {copied ? "Copied!" : "Copy"}
            <Copy className="ml-2 h-4 w-4" />
          </Button>
          
          <Button onClick={handlePostToTwitter} size="sm" className="bg-twitter-blue hover:bg-twitter-darkBlue text-white rounded-lg button-modern">
            Share
            <Twitter className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center">
          {deleteConfirm && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={cancelDelete}
              className="mr-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"
            >
              <X className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDelete}
            className={`${deleteConfirm ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'} rounded-lg button-modern`}
          >
            <Trash2 className={`h-4 w-4 ${deleteConfirm ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`} />
          </Button>
        </div>
      </CardFooter>
    </Card>;
};

export default GeneratedPost;
