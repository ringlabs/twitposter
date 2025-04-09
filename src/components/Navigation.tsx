
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { name: "Home", path: "/" },
    { name: "Features", path: "/features" },
    { name: "About", path: "/about" },
    { name: "Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
  ];

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 bg-white dark:bg-gray-900 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="relative mr-2">
            <div className="w-10 h-10 bg-twitter-blue rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold">TP</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white ml-2">
            TwitPoster
          </h1>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <Link to={item.path}>
                      <NavigationMenuLink 
                        className={cn(
                          navigationMenuTriggerStyle(), 
                          isActive(item.path) && "bg-accent text-accent-foreground"
                        )}
                      >
                        {item.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
                <NavigationMenuItem>
                  <Button asChild className="bg-twitter-blue hover:bg-twitter-darkBlue text-white ml-2">
                    <Link to="/twitter_post_generator">
                      Twitter Generator
                    </Link>
                  </Button>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        )}

        {/* Mobile Navigation Menu Button */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full py-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-twitter-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-bold">TP</span>
                      </div>
                      <h2 className="text-xl font-bold ml-2">TwitPoster</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="flex flex-col space-y-4">
                    {navigationItems.map((item) => (
                      <Button
                        key={item.path}
                        variant={isActive(item.path) ? "default" : "ghost"}
                        className={cn(
                          "justify-start",
                          isActive(item.path) ? "bg-twitter-blue text-white" : ""
                        )}
                        asChild
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link to={item.path}>
                          {item.name}
                        </Link>
                      </Button>
                    ))}
                  </div>
                  <div className="mt-auto pt-6">
                    <Button asChild className="w-full bg-twitter-blue hover:bg-twitter-darkBlue">
                      <Link to="/twitter_post_generator" onClick={() => setIsMenuOpen(false)}>
                        Try Twitter Generator
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {!isMobile && (
            <Button asChild className="bg-twitter-blue hover:bg-twitter-darkBlue text-white md:hidden">
              <Link to="/twitter_post_generator">
                Generator
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;
