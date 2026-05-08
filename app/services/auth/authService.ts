import { Alert } from 'react-native';
import { authApi } from '@/app/api/auth/authApi';

class AuthService {
    async checkAndRestoreSession(): Promise<boolean> {
        console.log('[AuthService] checkAndRestoreSession called');
        try {
            const session = await authApi.getSession();
            if (session) {
                console.log('[AuthService] Session exists, refreshing...');
                const refreshed = await authApi.refreshSession();
                return !!refreshed;
            }
            console.log('[AuthService] No session found');
            return false;
        } catch (error: any) {
            console.error('[AuthService] checkAndRestoreSession error:', error);
            return false;
        }
    }

    async signUp(email: string, password: string, name: string): Promise<boolean> {
        console.log('[AuthService] signUp called, email:', email);

        if (!email || !password || !name) {
            Alert.alert('Ошибка', 'Заполните все поля');
            return false;
        }

        if (password.length < 6) {
            Alert.alert('Ошибка', 'Пароль должен быть не менее 6 символов');
            return false;
        }

        try {
            const data = await authApi.signUp(email, password, name);
            console.log('[AuthService] signUp result:', !!data.session);

            if (data.session) {
                Alert.alert('Успех', 'Регистрация прошла успешно!');
                return true;
            } else if (data.user) {
                Alert.alert('Успех', 'Регистрация прошла! Проверьте почту для подтверждения.');
                return true;
            }

            return false;
        } catch (error: any) {
            console.error('[AuthService] signUp error:', error);

            if (error.message?.includes('already registered')) {
                Alert.alert('Ошибка', 'Пользователь с такой почтой уже зарегистрирован');
            } else if (error.message?.includes('network')) {
                Alert.alert('Ошибка', 'Проблема с сетью. Проверьте подключение к интернету.');
            } else {
                Alert.alert('Ошибка', error.message || 'Не удалось зарегистрироваться');
            }
            return false;
        }
    }

    async signIn(email: string, password: string): Promise<boolean> {
        console.log('[AuthService] signIn called, email:', email);

        if (!email || !password) {
            Alert.alert('Ошибка', 'Заполните все поля');
            return false;
        }

        try {
            const data = await authApi.signIn(email, password);
            console.log('[AuthService] signIn result:', !!data.session);

            if (data.session) {
                return true;
            }

            Alert.alert('Ошибка', 'Не удалось войти');
            return false;
        } catch (error: any) {
            console.error('[AuthService] signIn error:', error);

            if (error.message?.includes('Invalid login credentials')) {
                Alert.alert('Ошибка', 'Неверный email или пароль');
            } else if (error.message?.includes('Email not confirmed')) {
                Alert.alert('Ошибка', 'Email не подтверждён. Проверьте почту.');
            } else {
                Alert.alert('Ошибка', error.message || 'Не удалось войти');
            }
            return false;
        }
    }

    async signOut(): Promise<void> {
        console.log('[AuthService] signOut called');
        try {
            await authApi.signOut();
            console.log('[AuthService] signOut success');
        } catch (error: any) {
            console.error('[AuthService] signOut error:', error);
            Alert.alert('Ошибка', 'Не удалось выйти');
        }
    }

    async resetPassword(email: string): Promise<boolean> {
        console.log('[AuthService] resetPassword called, email:', email);

        if (!email) {
            Alert.alert('Ошибка', 'Введите email');
            return false;
        }

        try {
            await authApi.resetPassword(email);
            Alert.alert('Успех', 'Инструкция по восстановлению пароля отправлена на почту');
            return true;
        } catch (error: any) {
            console.error('[AuthService] resetPassword error:', error);
            Alert.alert('Ошибка', error.message || 'Не удалось отправить инструкцию');
            return false;
        }
    }

    async getCurrentUserEmail(): Promise<string | null> {
        try {
            const session = await authApi.getSession();
            return session?.user?.email || null;
        } catch (error) {
            return null;
        }
    }
}

export const authService = new AuthService();