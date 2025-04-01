
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/twitter_post_generator');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-twitter-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-twitter-blue">TwitWise Creator</h1>
        <p className="text-xl text-twitter-darkGray">Redirecting to Twitter Post Generator...</p>
      </div>
    </div>
  );
};

export default Index;
