import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navigation from "@/components/Navigation";

const FAQ = () => {
  const faqs = [
    {
      question: "What is TwitPoster?",
      answer: "TwitPoster is an AI-powered Twitter post generator that helps creators, marketers, and businesses create engaging content for Twitter (X). Our tool uses advanced AI to generate niche-specific tweets that drive engagement and grow your audience."
    },
    {
      question: "How does the free trial work?",
      answer: "Our free trial allows you to generate 10 Twitter posts without entering any payment information. This gives you a chance to experience the quality and relevance of our AI-generated content before committing to a subscription."
    },
    {
      question: "Do I need coding knowledge to use TwitPoster?",
      answer: "Not at all! TwitPoster is designed to be user-friendly with a simple interface. Just select your niche, click generate, and you'll have engaging Twitter posts ready to use in seconds."
    },
    {
      question: "What niches does TwitPoster support?",
      answer: "TwitPoster currently supports over 30 different niches including tech, finance, health & fitness, marketing, entrepreneurship, crypto, education, and many more. If you don't see your specific niche, you can select 'Other' and specify your topic."
    },
    {
      question: "How do I use my OpenAI API key with TwitPoster?",
      answer: "In the settings menu (gear icon), click on the API Key tab where you can enter your OpenAI API key. This allows you to use your own API credits instead of our built-in service. Your key is stored securely in your browser's local storage and is never sent to our servers."
    },
    {
      question: "Can I schedule posts with TwitPoster?",
      answer: "Currently, TwitPoster focuses on generating high-quality Twitter content. While we don't offer native scheduling, you can easily copy your generated posts and paste them into your favorite scheduling tool like Buffer, Hootsuite, or Twitter itself."
    },
    {
      question: "How is TwitPoster different from other Twitter tools?",
      answer: "TwitPoster specializes in niche-specific content generation using advanced AI models. Unlike general social media tools, we're focused exclusively on creating engaging Twitter content tailored to your specific audience and industry."
    },
    {
      question: "Is my data private and secure?",
      answer: "Yes! We take privacy seriously. When you use your own OpenAI API key, the content generation happens directly between your browser and OpenAI - we never see your API key or store your generated content on our servers."
    },
    {
      question: "Can I edit the generated posts?",
      answer: "Absolutely! After TwitPoster generates a post, you can edit it manually before using it. This gives you the flexibility to add your personal touch or make any necessary adjustments."
    },
    {
      question: "Do you offer customer support?",
      answer: "Yes, we provide customer support via email at support@twitposter.app. We aim to respond to all inquiries within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="container mx-auto py-8 px-4 flex-1">
        <Helmet>
          <title>Frequently Asked Questions | TwitPoster - AI Twitter Post Generator</title>
          <meta name="description" content="Find answers to commonly asked questions about TwitPoster, our AI-powered Twitter post generator, free trial, supported niches, and more." />
          <meta name="keywords" content="twitposter faq, twitter post generator questions, ai content creation help" />
          <link rel="canonical" href="https://twitposter.app/faq" />
        </Helmet>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to the most common questions about TwitPoster and our AI-powered Twitter post generator.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 text-left font-medium text-gray-900 dark:text-white">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 pt-2 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            We're here to help! Contact us at <a href="mailto:support@twitposter.app" className="text-twitter-blue hover:underline">support@twitposter.app</a>
          </p>
        </div>

        <div className="bg-twitter-extraLightGray dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to try TwitPoster?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Start creating engaging Twitter content in seconds with our free trial.
          </p>
          <Button asChild className="bg-twitter-blue hover:bg-twitter-darkBlue text-white px-8 py-6 rounded-full text-lg">
            <Link to="/twitter_post_generator">
              Try for Free
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
