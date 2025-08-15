// assets/js/supabase-client.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const SUPABASE_URL = 'https://frnzwjwdlymvxzjnbzfn.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZybnp3andkbHltdnh6am5iemZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNzY5MDksImV4cCI6MjA3MDg1MjkwOX0.HbfY-_PPhXYXccmqjqBrIQm4LGcItzDre3rbLQACb5o';



export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);