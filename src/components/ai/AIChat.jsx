import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Cpu, Gamepad2, Monitor, Loader2, Bot, User } from 'lucide-react';
import { useAIStore, useCartStore } from '@/stores';
import { cn } from '@/utils';
import { Button, Card } from '../ui';

const QUICK_PROMPTS = [
  {
    icon: Cpu,
    label: 'PC Upgrade',
    prompt: 'I want to upgrade my PC. Can you help me find compatible parts?',
  },
  {
    icon: Gamepad2,
    label: 'Gaming Build',
    prompt: 'I want to build a gaming PC. What components do you recommend?',
  },
  {
    icon: Monitor,
    label: 'Productivity',
    prompt: 'I need a PC for video editing and productivity work. What should I get?',
  },
];

export default function AIChat() {
  const { isOpen, closeChat, messages, sendMessage, isLoading, clearMessages } = useAIStore();
  const { items: cartItems } = useCartStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');

    const context = {
      cartItems: cartItems.map((item) => ({
        name: item.product.name,
        category: item.product.category,
        price: item.product.price,
      })),
    };

    try {
      await sendMessage(message, context);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 md:w-[28rem] z-50 flex flex-col bg-white dark:bg-surface-900 shadow-2xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700 bg-gradient-to-r from-primary-600 to-accent-500 text-white">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h2 className="font-semibold">AI Shopping Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={clearMessages}
              className="text-sm opacity-80 hover:opacity-100 transition-opacity"
            >
              Clear
            </button>
          )}
          <button
            onClick={closeChat}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">
              How can I help you today?
            </h3>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              I can help you find compatible PC parts, suggest builds, or answer questions about products.
            </p>

            {/* Quick Prompts */}
            <div className="space-y-2">
              {QUICK_PROMPTS.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPrompt(prompt.prompt)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-left"
                >
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    <prompt.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{prompt.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] p-3 rounded-2xl',
                  message.role === 'user'
                    ? 'bg-primary-600 text-white rounded-br-sm'
                    : 'bg-surface-100 dark:bg-surface-800 rounded-bl-sm'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>

                {/* Product Recommendations */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm font-medium opacity-80">
                      Recommended Products:
                    </p>
                    {message.products.map((product, idx) => (
                      <Card key={idx} padding="sm" className="!bg-white/10 dark:!bg-surface-700">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm opacity-80">{product.price} KD</p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-surface-100 dark:bg-surface-800 p-3 rounded-2xl rounded-bl-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-surface-200 dark:border-surface-700">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            className="flex-1 resize-none px-4 py-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-surface-400 mt-2 text-center">
          Powered by AI • Responses may vary
        </p>
      </div>
    </div>
  );
}
