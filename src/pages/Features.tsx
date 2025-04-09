import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Clock, 
  BarChart3, 
  BrainCircuit,
  Share2, 
  Calendar, 
  Repeat, 
  Globe
} from "lucide-react";
import Navigation from "@/components/Navigation";

const Features = () => {
  const features = [
    {
      title: "AI-Powered Content Generation",
      description: "Our advanced algorithms create engaging Twitter posts tailored to your specific niche and audience.",
      icon: <BrainCircuit className="w-12 h-12 text-twitter-blue" />
    },
    {
      title: "Niche-Specific Content",
      description: "Choose from over 30 different niches to generate content that resonates with your specific audience.",
      icon: <Globe className="w-12 h-12 text-twitter-blue" />
    },
    {
      title: "Time-Saving Automation",
      description: "Generate weeks' worth of content in minutes instead of hours. Schedule your posts for optimal engagement.",
      icon: <Clock className="w-12 h-12 text-twitter-blue" />
    },
    {
      title: "Engagement Optimization",
      description: "Our AI analyzes what drives engagement in your niche to create posts that get more likes, retweets, and comments.",
      icon: <BarChart3 className="w-12 h-12 text-twitter-blue" />
    },
    {
      title: "Seamless Sharing",
      description: "Copy your generated posts with a single click and paste directly into Twitter or your favorite scheduling tool.",
      icon: <Share2 className="w-12 h-12 text-twitter-blue" />
    },
    {
      title: "Regular Content Updates",
      description: "Our AI continuously learns from the latest Twitter trends to keep your content fresh and relevant.",
      icon: <Repeat className="w-12 h-12 text-twitter-blue" />
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="container mx-auto py-8 px-4 flex-1">
        <Helmet>
          <title>Features | TwitPoster - AI Twitter Post Generator</title>
          <meta name="description" content="Discover all the powerful features of TwitPoster's AI Twitter post generator - niche-specific content, engagement optimization, and time-saving automation." />
          <meta name="keywords" content="twitter post generator features, AI twitter writer, social media content creation, tweet automation" />
          <link rel="canonical" href="https://twitposter.app/features" />
        </Helmet>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features to <span className="text-twitter-blue">Grow Your Twitter Presence</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            TwitPoster combines advanced AI technology with deep social media expertise to help you create engaging content that grows your audience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="mb-4">{feature.icon}</div>
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-twitter-extraLightGray dark:bg-gray-800 rounded-2xl p-8 text-center mb-12 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-16 h-16 text-twitter-blue" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Start Creating Engaging Twitter Posts Today
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Try TwitPoster for free with 10 generated posts. No credit card required.
          </p>
          <Button asChild className="bg-twitter-blue hover:bg-twitter-darkBlue text-white px-8 py-6 rounded-full text-lg">
            <Link to="/twitter_post_generator">
              Try TwitPoster Free
            </Link>
          </Button>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Questions about our features?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Check out our <Link to="/faq" className="text-twitter-blue hover:underline">FAQ page</Link> or <Link to="/about" className="text-twitter-blue hover:underline">learn more about us</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Features;
