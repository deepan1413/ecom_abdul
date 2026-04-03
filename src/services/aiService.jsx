import api from './api';
import { API_ENDPOINTS } from '@/constants';

export const aiService = {
  chat: async (request) => {
    const response = await api.post(API_ENDPOINTS.AI, request);
    return response.data;
  },

  getPCRecommendations: async (specs, budget, purpose) => {
    const message = `I need PC recommendations. Current specs: ${specs}. ${
      budget ? `Budget: ${budget} KWD.` : ''
    } ${purpose ? `Purpose: ${purpose}.` : ''} Please suggest compatible upgrades or a full build.`;

    return aiService.chat({ 
      message,
      context: {
        userPreferences: { budget, purpose }
      }
    });
  },

  getCompatibilityCheck: async (components) => {
    const message = `Check compatibility for these PC components: ${components.join(', ')}. Are they compatible? Any issues or recommendations?`;
    return aiService.chat({ message });
  },
};
