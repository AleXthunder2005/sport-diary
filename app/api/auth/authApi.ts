import { supabase } from '@/app/supabase/supabaseClient';

class AuthApi {
    async signUp(email: string, password: string, name: string) {
        console.log('[AuthApi] signUp called, email:', email, 'name:', name);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                },
            },
        });

        if (error) {
            console.error('[AuthApi] signUp error:', error);
            throw error;
        }

        console.log('[AuthApi] signUp success, userId:', data.user?.id);
        return data;
    }

    async signIn(email: string, password: string) {
        console.log('[AuthApi] signIn called, email:', email);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error('[AuthApi] signIn error:', error);
            throw error;
        }

        console.log('[AuthApi] signIn success, userId:', data.user?.id);
        return data;
    }

    async signOut() {
        console.log('[AuthApi] signOut called');
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('[AuthApi] signOut error:', error);
            throw error;
        }

        console.log('[AuthApi] signOut success');
    }

    async resetPassword(email: string) {
        console.log('[AuthApi] resetPassword called, email:', email);

        const { error } = await supabase.auth.resetPasswordForEmail(email);

        if (error) {
            console.error('[AuthApi] resetPassword error:', error);
            throw error;
        }

        console.log('[AuthApi] resetPassword success');
    }
}

export const authApi = new AuthApi();