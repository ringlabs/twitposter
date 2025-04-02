import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, Moon, Sun, MessageSquare, Sparkles } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ApiKeyManager from "./ApiKeyManager";
import NicheSelector from "./NicheSelector";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
interface HeaderProps {
  onGeneratePost: (specifyTopic?: boolean) => void;
}
const Header = ({
  onGeneratePost
}: HeaderProps) => {
  const {
    theme,
    setTheme
  } = useTheme();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<string>("niche");
  const isMobile = useIsMobile();
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} mode`);
  };
  return <div className="w-full border-b border-gray-200 dark:border-gray-800 pb-4 mb-6 pt-4 py-[10px] bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative mr-2">
            <div className="w-10 h-10 bg-twitter-blue rounded-full flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold">TW</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></span>
            </div>
          </div>
          {!isMobile && <h1 className="text-2xl font-bold text-gray-900 dark:text-white ml-2">
              TwitWise<span className="text-twitter-blue">Creator</span>
            </h1>}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 button-modern">
                <Settings className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="p-0 sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4 border-b dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <SheetTitle className="text-xl dark:text-white flex items-center">
                      <Settings className="mr-2 h-5 w-5" />
                      Settings
                    </SheetTitle>
                    <div className="flex space-x-2">
                      <Button variant={settingsTab === "niche" ? "default" : "outline"} size="sm" onClick={() => setSettingsTab("niche")} className={`rounded-lg ${settingsTab === "niche" ? "bg-twitter-blue text-white" : "dark:border-gray-700 dark:text-gray-300"}`}>
                        Niche
                      </Button>
                      <Button variant={settingsTab === "api-key" ? "default" : "outline"} size="sm" onClick={() => setSettingsTab("api-key")} className={`rounded-lg ${settingsTab === "api-key" ? "bg-twitter-blue text-white" : "dark:border-gray-700 dark:text-gray-300"}`}>
                        API Key
                      </Button>
                    </div>
                  </div>
                </SheetHeader>
                <ScrollArea className="flex-1 p-4">
                  {settingsTab === "niche" && <div className="animate-fade-in">
                    <NicheSelector onComplete={() => setSheetOpen(false)} inSettings={true} />
                  </div>}
                  {settingsTab === "api-key" && <div className="animate-fade-in">
                    <ApiKeyManager />
                  </div>}
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-twitter-blue hover:bg-twitter-darkBlue text-white rounded-full button-modern shadow-sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 p-2 mt-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg dark:bg-gray-800" align="end">
              <DropdownMenuItem className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white" onClick={() => onGeneratePost(false)}>
                <Sparkles className="mr-2 h-4 w-4 text-twitter-blue" />
                <span>Auto Generate</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white" onClick={() => onGeneratePost(true)}>
                <MessageSquare className="mr-2 h-4 w-4 text-twitter-blue" />
                <span>Specify Topic</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>;
};
export default Header;