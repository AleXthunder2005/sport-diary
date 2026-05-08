import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useAppTheme } from '@/app/theme/theme';
import { useTranslation } from 'react-i18next';
import { Trophy, Clock, Dumbbell, TrendingUp, CheckCircle, ArrowRight, MessageCircle, Send } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { workoutService } from '@/app/services/workout/workoutService';
import { shareToTelegram, shareToWhatsApp, copyToShare } from '@/app/utils/shareWorkout';

export default function WorkoutSummary({ navigation, route }) {
    const { colorScheme } = useAppTheme();
    const { t } = useTranslation();
    const isDark = colorScheme === 'dark';
    const { workoutId } = route.params;

    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        background: getColor(isDark ? 'dark' : 'light', 'background'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
        success: getColor(isDark ? 'dark' : 'light', 'success'),
        telegram: '#0088cc',
        whatsapp: '#25D366',
        vk: '#0077FF',
        copy: getColor(isDark ? 'dark' : 'light', 'primary'),
    };

    useEffect(() => {
        loadWorkout();
    }, []);

    const loadWorkout = async () => {
        setLoading(true);
        const data = await workoutService.getWorkoutById(workoutId);
        setWorkout(data);
        setLoading(false);
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}${t('units.hoursShort')} ${minutes}${t('units.minutesShort')}`;
        return `${minutes}${t('units.minutesShort')}`;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString(t('locale'), { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handleShareTelegram = async () => {
        if (!workout) return;
        await shareToTelegram(workout, t);
    };

    const handleShareWhatsApp = async () => {
        if (!workout) return;
        await shareToWhatsApp(workout, t);
    };

    const handleCopy = async () => {
        if (!workout) return;
        await copyToShare(workout, t);
    };

    if (loading || !workout) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-background">
            <View className="p-4">
                {/* Header */}
                <View className="items-center mb-6">
                    <View className="bg-success/20 rounded-full p-4 mb-3">
                        <Trophy size={48} color={colors.success} />
                    </View>
                    <Text className="text-2xl font-bold text-foreground mb-2">
                        {t('workouts.workoutFinished')}
                    </Text>
                    <Text className="text-muted-foreground text-center">
                        {formatDate(workout.startTime)}
                    </Text>
                </View>

                {/* Stats Cards */}
                <View className="flex-row gap-3 mb-6">
                    <View className="flex-1 bg-card rounded-xl p-4 border border-border/50 items-center">
                        <Clock size={24} color={colors.primary} />
                        <Text className="text-foreground text-xl font-bold mt-2">{formatDuration(workout.duration)}</Text>
                        <Text className="text-muted-foreground text-xs">{t('workouts.duration')}</Text>
                    </View>
                    <View className="flex-1 bg-card rounded-xl p-4 border border-border/50 items-center">
                        <Dumbbell size={24} color={colors.primary} />
                        <Text className="text-foreground text-xl font-bold mt-2">{workout.totalSets || 0}</Text>
                        <Text className="text-muted-foreground text-xs">{t('workouts.sets')}</Text>
                    </View>
                </View>

                <View className="flex-row gap-3 mb-6">
                    <View className="flex-1 bg-card rounded-xl p-4 border border-border/50 items-center">
                        <CheckCircle size={24} color={colors.primary} />
                        <Text className="text-foreground text-xl font-bold mt-2">{workout.totalExercises || 0}</Text>
                        <Text className="text-muted-foreground text-xs">{t('workouts.exercises')}</Text>
                    </View>
                    <View className="flex-1 bg-card rounded-xl p-4 border border-border/50 items-center">
                        <TrendingUp size={24} color={colors.primary} />
                        <Text className="text-foreground text-xl font-bold mt-2">{workout.totalVolume || 0}</Text>
                        <Text className="text-muted-foreground text-xs">{t('workouts.volume')} ({t('units.kg')})</Text>
                    </View>
                </View>

                {/* Share Buttons */}
                <Text className="text-foreground font-semibold text-lg mb-3">Поделиться</Text>
                <View className="flex-row gap-3 mb-6">
                    {/* Telegram */}
                    <Pressable
                        onPress={handleShareTelegram}
                        className="flex-1 py-3 rounded-xl items-center justify-center"
                        style={{ backgroundColor: colors.telegram }}
                    >
                        <Send size={24} color="#fff" />
                        <Text className="text-white text-xs mt-1 font-medium">Telegram</Text>
                    </Pressable>

                    {/* WhatsApp */}
                    <Pressable
                        onPress={handleShareWhatsApp}
                        className="flex-1 py-3 rounded-xl items-center justify-center"
                        style={{ backgroundColor: colors.whatsapp }}
                    >
                        <MessageCircle size={24} color="#fff" />
                        <Text className="text-white text-xs mt-1 font-medium">WhatsApp</Text>
                    </Pressable>

                    {/* Copy / Share */}
                    <Pressable
                        onPress={handleCopy}
                        className="flex-1 py-3 rounded-xl items-center justify-center bg-card border border-border/50"
                    >
                        <Dumbbell size={24} color={colors.primary} />
                        <Text className="text-primary text-xs mt-1 font-medium">Ещё</Text>
                    </Pressable>
                </View>

                {/* Exercises Summary */}
                <Text className="text-foreground font-semibold text-lg mb-3">{t('workouts.exercisesDone')}</Text>
                {workout.exercises.map((exercise) => (
                    <View key={exercise.id} className="bg-card rounded-xl p-4 border border-border/50 mb-3">
                        <Text className="text-foreground font-semibold mb-2">{exercise.exerciseName}</Text>
                        {exercise.sets.filter(s => s.completed).map((set, idx) => (
                            <View key={set.id} className="flex-row justify-between items-center py-1">
                                <Text className="text-muted-foreground text-sm">{t('workouts.setNumber')} {idx + 1}</Text>
                                <Text className="text-foreground">{set.weight} {t('units.kg')} × {set.reps} {t('units.reps')}</Text>
                            </View>
                        ))}
                    </View>
                ))}

                {/* Actions */}
                <View className="flex-row gap-3 mt-4">
                    <Pressable
                        onPress={() => navigation.navigate('WorkoutDetail', { workoutId: workout.id })}
                        className="flex-1 bg-primary py-3 rounded-xl flex-row items-center justify-center gap-2"
                    >
                        <ArrowRight size={20} color={colors.primaryForeground} />
                        <Text className="text-primary-foreground font-semibold">{t('workouts.viewDetails')}</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => navigation.navigate('WorkoutHome')}
                        className="flex-1 border border-primary py-3 rounded-xl"
                    >
                        <Text className="text-primary text-center font-semibold">{t('workouts.close')}</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}