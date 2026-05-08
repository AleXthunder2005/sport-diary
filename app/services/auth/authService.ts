import { Alert } from 'react-native';
import { authApi } from '@/app/api/auth/authApi';

class AuthService {
    async signUp(email: string, password: string, name: string): Promise<boolean> {
        console.log('[AuthService] signUp called, email:', email, 'name:', name);

        if (!email || !password || !name) {
            console.log('[AuthService] signUp: missing fields');
            Alert.alert('Ошибка', 'Заполните все поля');
            return false;
        }

        if (password.length < 6) {
            console.log('[AuthService] signUp: password too short');
            Alert.alert('Ошибка', 'Пароль должен быть не менее 6 символов');
            return false;
        }

        try {
            const data = await authApi.signUp(email, password, name);
            console.log('[AuthService] signUp success');

            if (data.user && data.session) {
                Alert.alert('Успех', 'Регистрация прошла успешно! Проверьте почту для подтверждения.');
                return true;
            }

            return false;
        } catch (error: any) {
            console.error('[AuthService] signUp error:', error);

            if (error.message.includes('already registered')) {
                Alert.alert('Ошибка', 'Пользователь с такой почтой уже существует');
            } else {
                Alert.alert('Ошибка', error.message || 'Не удалось зарегистрироваться');
            }
            return false;
        }
    }

    async signIn(email: string, password: string): Promise<boolean> {
        console.log('[AuthService] signIn called, email:', email);

        if (!email || !password) {
            console.log('[AuthService] signIn: missing fields');
            Alert.alert('Ошибка', 'Заполните все поля');
            return false;
        }

        try {
            await authApi.signIn(email, password);
            console.log('[AuthService] signIn success');
            return true;
        } catch (error: any) {
            console.error('[AuthService] signIn error:', error);

            if (error.message.includes('Invalid login credentials')) {
                Alert.alert('Ошибка', 'Неверный email или пароль');
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
            console.log('[AuthService] resetPassword: no email');
            Alert.alert('Ошибка', 'Введите email');
            return false;
        }

        try {
            await authApi.resetPassword(email);
            console.log('[AuthService] resetPassword success');
            Alert.alert('Успех', 'Инструкция по восстановлению пароля отправлена на почту');
            return true;
        } catch (error: any) {
            console.error('[AuthService] resetPassword error:', error);
            Alert.alert('Ошибка', error.message || 'Не удалось отправить инструкцию');
            return false;
        }
    }
}

export const authService = new AuthService();