import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://lzslmygyajaexkrxxyjm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_X3Sjwiacch57Gl_-G2zk9w_dXFqFx97';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export async function getCurrentUserId(): Promise<string | null> {
    console.log('[supabaseClient] getCurrentUserId called');
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.log('[supabaseClient] getCurrentUserId error:', error.message);
        return null;
    }
    console.log('[supabaseClient] getCurrentUserId result:', user?.id || null);
    return user?.id ?? null;
}

export async function getCurrentUser() {
    console.log('[supabaseClient] getCurrentUser called');
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
        console.log('[supabaseClient] getCurrentUser error:', error.message);
        return null;
    }
    console.log('[supabaseClient] getCurrentUser result:', user ? user.email : null);
    return user;
}

export function onAuthStateChange(callback: (userId: string | null) => void) {
    console.log('[supabaseClient] onAuthStateChange registered');
    return supabase.auth.onAuthStateChange((event, session) => {
        console.log('[supabaseClient] Auth state changed:', event, 'userId:', session?.user?.id || null);
        callback(session?.user?.id ?? null);
    });
}