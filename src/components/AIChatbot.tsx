import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform bg-primary hover:bg-primary/90"
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Chat Assistant"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}
        
        {/* Chat Window */}
        {isOpen && (
          <div className="bg-background border border-border rounded-lg shadow-2xl w-[350px] h-[500px] flex flex-col animate-scale-in">
            {/* Header */}
            <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto bg-muted/20">
              <div className="space-y-4">
                <div className="bg-background p-3 rounded-lg border border-border shadow-sm">
                  <p className="text-sm text-muted-foreground">
                    👋 Hello! I'm your AI assistant. How can I help you today?
                  </p>
                </div>
                <div className="bg-background p-3 rounded-lg border border-border shadow-sm">
                  <p className="text-sm text-muted-foreground mb-2">
                    I can help you with:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Finding the perfect cumpanion</li>
                    <li>• Understanding our services</li>
                    <li>• Answering questions about membership</li>
                    <li>• Booking and payment assistance</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                />
                <Button size="sm" disabled>
                  Send
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                AI chat coming soon!
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AIChatbot;
