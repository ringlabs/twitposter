import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users2, Trophy, Globe, Heart } from "lucide-react";
import Navigation from "@/components/Navigation";

const About = () => {
  const teamMembers = [
    {
      name: "Alex Thompson",
      title: "Founder & CEO",
      bio: "Social media expert with a passion for AI and automation. Previously led marketing at Twitter.",
      image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      name: "Sarah Chen",
      title: "CTO",
      bio: "AI researcher and engineer with expertise in natural language processing and machine learning.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop"
    },
    {
      name: "Michael Okafor",
      title: "Head of Content",
      bio: "Content strategist who's grown multiple Twitter accounts to 100K+ followers with engaging content.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&h=200&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="container mx-auto py-8 px-4 flex-1">
        <Helmet>
          <title>About TwitPoster | AI-Powered Twitter Content Creation</title>
          <meta name="description" content="Learn about TwitPoster, the team behind our AI-powered Twitter post generator, and our mission to help creators and businesses grow their social media presence." />
          <meta name="keywords" content="about twitposter, twitter ai tool company, social media content creation team" />
          <link rel="canonical" href="https://twitposter.app/about" />
        </Helmet>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            About <span className="text-twitter-blue">TwitPoster</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We're on a mission to help creators, marketers, and businesses build a powerful Twitter presence through AI-powered content creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                TwitPoster was founded in 2023 by a team of social media experts and AI engineers who recognized the challenges of consistently creating engaging content on Twitter (now X).
              </p>
              <p>
                We saw that many creators and businesses struggled to maintain a consistent Twitter presence, often spending hours crafting posts that didn't drive engagement or growth.
              </p>
              <p>
                Our solution combines cutting-edge AI technology with deep social media expertise to generate highly engaging, niche-specific Twitter content in seconds.
              </p>
              <p>
                Today, TwitPoster helps thousands of users save time while growing their Twitter following through more engaging, consistent content.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-twitter-extraLightGray dark:bg-gray-800 border-none p-6 flex flex-col items-center justify-center text-center">
              <Users2 className="h-12 w-12 text-twitter-blue mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">10,000+</h3>
              <p className="text-gray-600 dark:text-gray-300">Active Users</p>
            </Card>
            <Card className="bg-twitter-extraLightGray dark:bg-gray-800 border-none p-6 flex flex-col items-center justify-center text-center">
              <Trophy className="h-12 w-12 text-twitter-blue mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">500K+</h3>
              <p className="text-gray-600 dark:text-gray-300">Posts Generated</p>
            </Card>
            <Card className="bg-twitter-extraLightGray dark:bg-gray-800 border-none p-6 flex flex-col items-center justify-center text-center">
              <Globe className="h-12 w-12 text-twitter-blue mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">30+</h3>
              <p className="text-gray-600 dark:text-gray-300">Supported Niches</p>
            </Card>
            <Card className="bg-twitter-extraLightGray dark:bg-gray-800 border-none p-6 flex flex-col items-center justify-center text-center">
              <Heart className="h-12 w-12 text-twitter-blue mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">4.8/5</h3>
              <p className="text-gray-600 dark:text-gray-300">User Rating</p>
            </Card>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-twitter-blue font-medium mb-2">{member.title}</p>
                  <p className="text-gray-600 dark:text-gray-300">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-twitter-extraLightGray dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Twitter Content?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Try TwitPoster today and see why thousands of creators trust us for their Twitter content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-twitter-blue hover:bg-twitter-darkBlue text-white px-8 py-6 rounded-full text-lg">
              <Link to="/twitter_post_generator">
                Try for Free
              </Link>
            </Button>
            <Button asChild variant="outline" className="px-8 py-6 rounded-full text-lg border-twitter-blue text-twitter-blue hover:bg-twitter-blue/10">
              <Link to="/features">
                See Features
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
