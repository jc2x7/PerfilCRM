import { Platform } from 'react-native';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dnwmfmrujyykdlvsjilm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRud21mbXJ1anl5a2RsdnNqaWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1ODQ2MTcsImV4cCI6MjA4ODE2MDYxN30.nYFlevpwtieKvQrrbvSeTwCHh2dS-txKOUUswDIb1iY';

// Storage adapter that works on both web (localStorage) and native (AsyncStorage)
const memoryStore = {};

const storage = Platform.OS === 'web'
  ? {
      getItem: (key) => {
        try { return globalThis.localStorage.getItem(key); }
        catch { return null; }
      },
      setItem: (key, value) => {
        try { globalThis.localStorage.setItem(key, value); }
        catch {}
      },
      removeItem: (key) => {
        try { globalThis.localStorage.removeItem(key); }
        catch {}
      },
    }
  : {
      getItem: async (key) => {
        try {
          const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
          return await AsyncStorage.getItem(key);
        } catch {
          return memoryStore[key] ?? null;
        }
      },
      setItem: async (key, value) => {
        try {
          const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
          await AsyncStorage.setItem(key, value);
        } catch {
          memoryStore[key] = value;
        }
      },
      removeItem: async (key) => {
        try {
          const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
          await AsyncStorage.removeItem(key);
        } catch {
          delete memoryStore[key];
        }
      },
    };

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
