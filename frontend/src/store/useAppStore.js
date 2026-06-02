import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAppStore = create(
  persist(
    (set) => ({
      // --- Authentication State ---
      isAuthenticated: false,
      user: null, // { name: '', email: '' }
      login: (userData) => set({ isAuthenticated: true, user: userData }),
      logout: () => set({ isAuthenticated: false, user: null }),

      // --- Voice & Companion State ---
      companionName: 'Unfiltered Zone',
      wakeWordEnabled: true,
      wakeWord: 'Hey Unfiltered Zone',
      voicePersonality: 'warm',
      
      updateVoiceSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'safespace-storage', // key in localStorage
    }
  )
);

export default useAppStore;
