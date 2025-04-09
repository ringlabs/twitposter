
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center p-4">
        <Helmet>
          <title>Page Not Found | TwitPoster</title>
          <meta name="description" content="This page could not be found. Return to the TwitPoster homepage." />
        </Helmet>
        <div className="text-center">
          <h1 className="text-6xl font-bold text-twitter-blue mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button asChild className="bg-twitter-blue hover:bg-twitter-darkBlue text-white">
            <Link to="/">
              Return to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
