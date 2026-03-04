import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dnwmfmrujyykdlvsjilm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRud21mbXJ1anl5a2RsdnNqaWxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1ODQ2MTcsImV4cCI6MjA4ODE2MDYxN30.nYFlevpwtieKvQrrbvSeTwCHh2dS-txKOUUswDIb1iY';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
