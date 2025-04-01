
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

const Index = () => {
  const navigate = useNavigate();
  
  // Try-catch to handle any potential theme errors 
  let themeValue = 'light';
  try {
    const { theme } = useTheme();
    themeValue = theme;
  } catch (error) {
    console.error("Error using theme in Index:", error);
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/twitter_post_generator');
    }, 1500); // Short delay for animation
    
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-twitter-extraLightGray to-white dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      <div className="text-center transform animate-fade-in">
        <div className="mb-6 flex justify-center">
          <div className="relative w-16 h-16 bg-twitter-blue rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">TW</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full animate-pulse"></span>
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-3 text-twitter-blue dark:text-twitter-blue">
          <span className="inline-block animate-fade-in" style={{ animationDelay: '0.3s' }}>Twit</span>
          <span className="inline-block animate-fade-in" style={{ animationDelay: '0.5s' }}>Wise</span>
        </h1>
        <p className="text-xl text-twitter-darkGray dark:text-gray-300 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          Creating intelligent posts for social media
        </p>
        <div className="mt-6 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="w-32 h-1 mx-auto bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-twitter-blue animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
