import { create } from 'zustand';
import { aiService } from '@/services/aiService';

export const useAIStore = create((set, get) => ({
  messages: [],
  isOpen: false,
  isLoading: false,
  error: null,

  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set({ isOpen: !get().isOpen }),

  addMessage: (message) => {
    set({ messages: [...get().messages, message] });
  },

  sendMessage: async (content, context) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    set({ 
      messages: [...get().messages, userMessage],
      isLoading: true,
      error: null,
    });

    try {
      const response = await aiService.chat({
        message: content,
        context: context || {},
        history: get().messages.slice(-10),
      });

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message || response.response || 'Sorry, I could not process your request.',
        timestamp: new Date().toISOString(),
        products: response.products || [],
      };

      set({ 
        messages: [...get().messages, aiMessage],
        isLoading: false,
      });

      return aiMessage;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to get AI response';
      set({ error: errorMessage, isLoading: false });
      
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      
      set({ messages: [...get().messages, errorResponse] });
      throw error;
    }
  },

  clearMessages: () => {
    set({ messages: [], error: null });
  },
}));
