import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, UserPlus } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { authService } from '@/app/services/auth/authService';

export default function SignUpScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const isDark = false;
    const currentTheme = 'light';

    const colors = {
        primary: getColor(currentTheme, 'primary'),
        primaryForeground: getColor(currentTheme, 'primary-foreground'),
        foreground: getColor(currentTheme, 'foreground'),
        background: getColor(currentTheme, 'background'),
        card: getColor(currentTheme, 'card'),
        border: getColor(currentTheme, 'border'),
        mutedForeground: getColor(currentTheme, 'muted-foreground'),
        muted: getColor(currentTheme, 'muted'),
        inputBackground: getColor(currentTheme, 'input-background'),
    };

    const handleSignUp = async () => {
        console.log('[SignUpScreen] handleSignUp called');

        if (password !== confirmPassword) {
            Alert.alert('Ошибка', 'Пароли не совпадают');
            return;
        }

        setLoading(true);
        await authService.signUp(email, password, name);
        setLoading(false);
        // После успешной регистрации onAuthStateChange в App.tsx переключит навигацию
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                style={{ backgroundColor: colors.background }}
            >
                <View className="px-6 py-8">
                    {/* Logo */}
                    <View className="items-center mb-8">
                        <View
                            className="w-20 h-20 rounded-2xl justify-center items-center mb-4 shadow-lg"
                            style={{ backgroundColor: colors.primary }}
                        >
                            <UserPlus size={36} color={colors.primaryForeground} />
                        </View>
                        <Text className="text-2xl font-bold mb-1" style={{ color: colors.foreground }}>
                            SportDiary
                        </Text>
                        <Text className="text-center" style={{ color: colors.mutedForeground }}>
                            Создайте аккаунт чтобы начать
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="gap-4 mb-6">
                        {/* Name */}
                        <View>
                            <Text className="font-medium mb-2" style={{ color: colors.foreground }}>
                                Имя
                            </Text>
                            <View
                                className="flex-row items-center rounded-xl px-4 border"
                                style={{
                                    backgroundColor: colors.inputBackground,
                                    borderColor: colors.border,
                                }}
                            >
                                <User size={20} color={colors.mutedForeground} />
                                <TextInput
                                    className="flex-1 py-4 px-3"
                                    style={{ color: colors.foreground }}
                                    placeholder="Ваше имя"
                                    placeholderTextColor={colors.muted}
                                    autoCapitalize="words"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        {/* Email */}
                        <View>
                            <Text className="font-medium mb-2" style={{ color: colors.foreground }}>
                                Email
                            </Text>
                            <View
                                className="flex-row items-center rounded-xl px-4 border"
                                style={{
                                    backgroundColor: colors.inputBackground,
                                    borderColor: colors.border,
                                }}
                            >
                                <Mail size={20} color={colors.mutedForeground} />
                                <TextInput
                                    className="flex-1 py-4 px-3"
                                    style={{ color: colors.foreground }}
                                    placeholder="your@email.com"
                                    placeholderTextColor={colors.muted}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View>
                            <Text className="font-medium mb-2" style={{ color: colors.foreground }}>
                                Пароль
                            </Text>
                            <View
                                className="flex-row items-center rounded-xl px-4 border"
                                style={{
                                    backgroundColor: colors.inputBackground,
                                    borderColor: colors.border,
                                }}
                            >
                                <Lock size={20} color={colors.mutedForeground} />
                                <TextInput
                                    className="flex-1 py-4 px-3"
                                    style={{ color: colors.foreground }}
                                    placeholder="Минимум 6 символов"
                                    placeholderTextColor={colors.muted}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <Pressable onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff size={20} color={colors.mutedForeground} />
                                    ) : (
                                        <Eye size={20} color={colors.mutedForeground} />
                                    )}
                                </Pressable>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View>
                            <Text className="font-medium mb-2" style={{ color: colors.foreground }}>
                                Подтвердите пароль
                            </Text>
                            <View
                                className="flex-row items-center rounded-xl px-4 border"
                                style={{
                                    backgroundColor: colors.inputBackground,
                                    borderColor: colors.border,
                                }}
                            >
                                <Lock size={20} color={colors.mutedForeground} />
                                <TextInput
                                    className="flex-1 py-4 px-3"
                                    style={{ color: colors.foreground }}
                                    placeholder="Повторите пароль"
                                    placeholderTextColor={colors.muted}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Sign Up Button */}
                    <Pressable
                        onPress={handleSignUp}
                        disabled={loading}
                        className="py-4 rounded-xl mb-6 shadow-lg"
                        style={{
                            backgroundColor: loading ? colors.muted : colors.primary,
                        }}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={colors.primaryForeground} />
                        ) : (
                            <View className="flex-row items-center justify-center gap-2">
                                <Text
                                    className="font-semibold text-lg"
                                    style={{ color: colors.primaryForeground }}
                                >
                                    Зарегистрироваться
                                </Text>
                                <ArrowRight size={20} color={colors.primaryForeground} />
                            </View>
                        )}
                    </Pressable>

                    {/* Sign In Link */}
                    <View className="flex-row justify-center items-center gap-1">
                        <Text style={{ color: colors.mutedForeground }}>
                            Уже есть аккаунт?
                        </Text>
                        <Pressable onPress={() => navigation.navigate('SignIn')}>
                            <Text style={{ color: colors.primary }} className="font-semibold">
                                Войти
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}