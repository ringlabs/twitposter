import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Twitter, Copy } from "lucide-react";
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
  };
  return <Card className="w-full border-twitter-blue/30 shadow-md mb-6 dark:bg-gray-800 dark:border-twitter-blue/50">
      <CardContent className="p-6 py-px px-0">
        <div className="bg-white rounded-xl p-4 border border-twitter-extraLightGray min-h-[120px] dark:bg-gray-900 dark:border-gray-700">
          <p className="text-twitter-black whitespace-pre-wrap dark:text-white">{content}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-twitter-extraLightGray flex flex-wrap gap-2 justify-between dark:bg-gray-800 dark:border-t dark:border-gray-700 py-[5px]">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="bg-white text-twitter-darkGray hover:text-twitter-blue dark:bg-gray-700 dark:text-gray-300 dark:hover:text-white dark:border-gray-600" disabled={copied}>
            {copied ? "Copied!" : "Copy"}
            <Copy className="ml-2 h-4 w-4" />
          </Button>
          <Button onClick={handlePostToTwitter} size="sm" className="bg-twitter-blue hover:bg-twitter-darkBlue text-white">
            Post It
            <Twitter className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>;
};
export default GeneratedPost;