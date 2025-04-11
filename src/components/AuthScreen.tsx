
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthScreenProps {
  onComplete: () => void;
}

const AuthScreen = ({ onComplete }: AuthScreenProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/twitter_post_generator',
        }
      });

      if (error) {
        throw error;
      }
      
      // The redirect will happen automatically, no need for onComplete here
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast.error("Failed to sign in with Google. Please try again.");
      setIsLoading(false);
    }
  };

  // Check if user is already authenticated
  React.useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        onComplete();
      }
    };
    
    checkAuth();
  }, [onComplete]);

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <Card className="overflow-hidden border-twitter-blue/20 shadow-lg dark:bg-gray-800/90 dark:border-twitter-blue/30">
        <CardHeader className="bg-gradient-to-r from-twitter-blue to-twitter-darkBlue text-white py-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
              <span className="text-twitter-blue text-2xl font-bold">TW</span>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center">Welcome to TwitPoster</CardTitle>
          <CardDescription className="text-twitter-white text-center text-lg opacity-90 mt-2">
            Generate engaging Twitter posts with AI
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 dark:bg-gray-800">
          <div className="text-center mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to save your posts, track your usage, and customize your experience.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-6 bg-gray-50 dark:bg-gray-800/50 dark:border-t dark:border-gray-700">
          <Button 
            onClick={handleGoogleSignIn} 
            size="lg"
            className="w-full max-w-md bg-white hover:bg-gray-100 text-gray-800 font-medium text-lg py-6 border border-gray-300 flex items-center justify-center gap-3"
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="fill-current">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthScreen;
