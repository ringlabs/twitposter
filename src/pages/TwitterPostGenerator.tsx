import React from "react";
import Header from "@/components/Header";
import PostGenerator from "@/components/PostGenerator";
import { Helmet } from "react-helmet-async";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { getNicheValue } from "@/constants/niches";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const TwitterPostGenerator = () => {
  const isMobile = useIsMobile();
  const [niche] = useLocalStorage<string>("selectedNiche", "general");
  const nicheValue = getNicheValue(niche);

  const handleGeneratePost = (specifyTopic?: boolean) => {
    if (!niche) {
      toast.error("Please select a niche in settings before generating a post.");
      return;
    }

    if (specifyTopic) {
      const topic = prompt("Please specify a topic for the post:");
      if (topic) {
        toast.info(`Generating a post about "${topic}"...`);
      } else {
        toast.info("Generating a post with a random topic...");
      }
    } else {
      toast.info("Generating a post...");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 max-w-3xl mx-auto">
        <Helmet>
          <title>Twitter Post Generator | TwitPoster AI</title>
          <meta name="description" content={`Generate engaging Twitter posts for your ${nicheValue} niche with our AI tool. Create content that drives engagement and grows your audience.`} />
          <meta name="keywords" content={`twitter post generator, ${nicheValue} twitter content, AI tweet writer, social media content, engagement posts, ${nicheValue} social media`} />
          <meta property="og:title" content="Twitter Post Generator | TwitPoster AI" />
          <meta property="og:description" content={`Generate engaging Twitter posts for your ${nicheValue} niche with our AI tool.`} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://twitposter.app/twitter_post_generator" />
          <meta property="og:image" content="https://twitposter.app/twitter-card.png" />
          <link rel="canonical" href="https://twitposter.app/twitter_post_generator" />
          
          {/* Structured data for Twitter Post Generator */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "TwitPoster Twitter Post Generator",
              "applicationCategory": "SocialNetworkingApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": `AI-powered Twitter post generator for the ${nicheValue} niche. Create engaging content that drives traffic and increases followers.`,
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "127",
                "bestRating": "5",
                "worstRating": "1"
              }
            })}
          </script>
        </Helmet>
        <div className="h-full flex flex-col">
          <Header onGeneratePost={handleGeneratePost} />
          <div className="p-2 flex-1 overflow-y-auto">
            <PostGenerator />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterPostGenerator;
