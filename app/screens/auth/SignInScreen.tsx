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
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { authService } from '@/app/services/auth/authService';

export default function SignInScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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

    const handleSignIn = async () => {
        console.log('[SignInScreen] handleSignIn called');
        setLoading(true);
        await authService.signIn(email, password);
        setLoading(false);
        // После успешного входа onAuthStateChange в App.tsx автоматически переключит навигацию
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
                            <LogIn size={36} color={colors.primaryForeground} />
                        </View>
                        <Text className="text-2xl font-bold mb-1" style={{ color: colors.foreground }}>
                            SportDiary
                        </Text>
                        <Text className="text-center" style={{ color: colors.mutedForeground }}>
                            Войдите в аккаунт чтобы продолжить
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="gap-4 mb-6">
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
                                    placeholder="••••••••"
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
                    </View>

                    {/* Sign In Button */}
                    <Pressable
                        onPress={handleSignIn}
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
                                    Войти
                                </Text>
                                <ArrowRight size={20} color={colors.primaryForeground} />
                            </View>
                        )}
                    </Pressable>

                    {/* Sign Up Link */}
                    <View className="flex-row justify-center items-center gap-1">
                        <Text style={{ color: colors.mutedForeground }}>
                            Нет аккаунта?
                        </Text>
                        <Pressable onPress={() => navigation.navigate('SignUp')}>
                            <Text style={{ color: colors.primary }} className="font-semibold">
                                Зарегистрироваться
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}