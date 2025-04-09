import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, User } from "lucide-react";
import Navigation from "@/components/Navigation";

const Blog = () => {
  const blogPosts = [
    {
      id: "how-to-create-viral-tweets",
      title: "How to Create Viral Tweets with AI",
      excerpt: "Learn the science behind viral tweets and how AI can help you craft content that resonates with your audience and increases engagement.",
      author: "Alex Thompson",
      date: "April 1, 2025",
      category: "Content Strategy",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "twitter-algorithm-2025",
      title: "Understanding Twitter's Algorithm in 2025",
      excerpt: "A deep dive into how Twitter's algorithm works in 2025 and actionable strategies to make it work in your favor.",
      author: "Sarah Chen",
      date: "March 24, 2025",
      category: "Social Media",
      readTime: "10 min read",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "ai-content-creation-guide",
      title: "The Complete Guide to AI Content Creation for Social Media",
      excerpt: "Explore how AI is transforming social media content creation and learn practical ways to incorporate it into your strategy.",
      author: "Michael Okafor",
      date: "March 15, 2025",
      category: "AI Technology",
      readTime: "12 min read",
      image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: "twitter-growth-strategies",
      title: "5 Proven Twitter Growth Strategies for 2025",
      excerpt: "Discover five battle-tested strategies that can help you grow your Twitter following and increase engagement this year.",
      author: "Alex Thompson",
      date: "March 8, 2025",
      category: "Growth",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const featuredPost = blogPosts[0]; // "How to Create Viral Tweets with AI"
  const otherPosts = blogPosts.slice(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="container mx-auto py-8 px-4 flex-1">
        <Helmet>
          <title>Blog | TwitPoster - Twitter Content Creation Insights & Strategies</title>
          <meta name="description" content="Explore the latest insights, strategies, and tips for Twitter content creation, growth hacking, and leveraging AI for social media success." />
          <meta name="keywords" content="twitter content creation, viral tweets, social media strategy, ai content, twitter growth" />
          <link rel="canonical" href="https://twitposter.app/blog" />
        </Helmet>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            TwitPoster Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Insights, strategies, and tips to help you master Twitter content creation and grow your audience.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Article</h2>
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-video md:aspect-auto md:h-full overflow-hidden">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-twitter-blue/10 text-twitter-blue px-3 py-1 rounded-full text-sm font-medium">
                      {featuredPost.category}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      {featuredPost.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {featuredPost.excerpt}
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-4">
                    <User className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">{featuredPost.author}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-500 dark:text-gray-400">{featuredPost.readTime}</span>
                  </div>
                  <Button asChild className="w-full md:w-auto bg-twitter-blue hover:bg-twitter-darkBlue text-white">
                    <Link to={`/blog/${featuredPost.id}`}>
                      Read Article
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Posts */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherPosts.map((post, index) => (
              <Card key={index} className="overflow-hidden border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all duration-300">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="bg-twitter-blue/10 text-twitter-blue px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{post.date}</span>
                  </div>
                  <Button asChild variant="outline" size="sm" className="border-twitter-blue text-twitter-blue hover:bg-twitter-blue/10">
                    <Link to={`/blog/${post.id}`}>
                      Read More
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <div className="bg-twitter-extraLightGray dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Create Engaging Twitter Content?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Put these insights into action with our AI-powered Twitter post generator.
          </p>
          <Button asChild className="bg-twitter-blue hover:bg-twitter-darkBlue text-white px-8 py-6 rounded-full text-lg">
            <Link to="/twitter_post_generator">
              Try TwitPoster Free
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
