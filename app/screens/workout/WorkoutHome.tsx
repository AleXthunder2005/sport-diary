import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Play, TrendingUp, Clock, Dumbbell, Calendar as CalendarIcon, Zap, Activity, Sun, Moon, Database, CheckCircle, XCircle, BarChart3 } from 'lucide-react-native';
import { useAppTheme } from '@/app/theme/theme';
import { useTranslation } from 'react-i18next';
import { getColor } from '@/app/colors/colors';
import { workoutService } from '@/app/services/workout/workoutService';
import { exercisesApi } from '@/app/services/exercises/exerciseService';

export default function WorkoutHome({ navigation }) {
    const { colorScheme } = useAppTheme();
    const { t } = useTranslation();
    const isDark = colorScheme === 'dark';

    const [activeWorkout, setActiveWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [totalExercises, setTotalExercises] = useState(0);
    const [recentWorkouts, setRecentWorkouts] = useState([]);
    const [weeklyProgress, setWeeklyProgress] = useState([]);

    useEffect(() => {
        loadData();
        const unsubscribe = navigation.addListener('focus', loadData);
        return unsubscribe;
    }, [navigation]);

    const loadData = async () => {
        setLoading(true);
        const [active, workoutStats, history, exercises] = await Promise.all([
            workoutService.getActiveWorkout(),
            workoutService.getWorkoutStats(),
            workoutService.getWorkoutHistory('week'),
            exercisesApi.getExercises(),
        ]);
        setActiveWorkout(active);
        setStats(workoutStats);
        setTotalExercises(exercises.length);
        setRecentWorkouts(history.slice(0, 3));

        const weeklyData = generateWeeklyProgress(history);
        setWeeklyProgress(weeklyData);

        setLoading(false);
    };

    const generateWeeklyProgress = (history) => {
        const days = [t('weekdays.mon'), t('weekdays.tue'), t('weekdays.wed'), t('weekdays.thu'), t('weekdays.fri'), t('weekdays.sat'), t('weekdays.sun')];
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return days.map((day, index) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + index);
            const workoutOnDay = history.find(h =>
                new Date(h.date).toDateString() === date.toDateString()
            );
            const isFutureDate = date > today;

            return {
                day,
                hasWorkout: !!workoutOnDay,
                sets: workoutOnDay?.totalSets || 0,
                isFutureDate,
                isRestDay: !workoutOnDay && !isFutureDate,
            };
        });
    };

    const handleStartWorkout = async () => {
        if (activeWorkout) {
            navigation.navigate('WorkoutActive', { workoutId: activeWorkout.id });
        } else {
            const workout = await workoutService.startWorkout();
            navigation.navigate('WorkoutActive', { workoutId: workout.id });
        }
    };

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        background: getColor(isDark ? 'dark' : 'light', 'background'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
        success: getColor(isDark ? 'dark' : 'light', 'success'),
        accent: getColor(isDark ? 'dark' : 'light', 'accent'),
        secondary: getColor(isDark ? 'dark' : 'light', 'secondary'),
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}${t('units.hoursShort')} ${minutes}${t('units.minutesShort')}`;
        return `${minutes}${t('units.minutesShort')}`;
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('workouts.greetingMorning');
        if (hour < 18) return t('workouts.greetingAfternoon');
        return t('workouts.greetingEvening');
    };

    const GreetingIcon = () => {
        const hour = new Date().getHours();
        if (hour < 12) return <Sun size={24} color={colors.primary} />;
        if (hour < 18) return <Sun size={24} color={colors.primary} />;
        return <Moon size={24} color={colors.primary} />;
    };

    const workoutsThisWeek = weeklyProgress.filter(day => day.hasWorkout).length;
    const weekProgressText = t('workouts.workoutsThisWeek', { count: workoutsThisWeek });

    if (loading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            showsVerticalScrollIndicator={false}
        >
            <View className="px-4 pt-6 pb-8">
                {/* Header with Greeting */}
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-muted-foreground text-base mb-1">
                            {getGreeting()}
                        </Text>
                        <Text className="text-foreground text-2xl font-bold">
                            {t('workouts.readyForWorkout')}
                        </Text>
                    </View>
                    <View className="bg-primary/10 rounded-full p-3">
                        <GreetingIcon />
                    </View>
                </View>

                {/* Stats Cards Row - 3 columns with icons */}
                <View className="flex-row gap-3 mb-6">
                    <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Activity size={16} color={colors.primary} />
                            <Text className="text-muted-foreground text-xs uppercase tracking-wide">
                                {t('workouts.totalWorkoutsLabel')}
                            </Text>
                        </View>
                        <Text className="text-foreground text-3xl font-bold">{stats?.totalWorkouts || 0}</Text>
                        <Text className="text-muted-foreground text-xs mt-1">{t('workouts.totalWorkoutsLabel')}</Text>
                    </View>
                    <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Dumbbell size={16} color={colors.primary} />
                            <Text className="text-muted-foreground text-xs uppercase tracking-wide">
                                {t('workouts.totalExercisesLabel')}
                            </Text>
                        </View>
                        <Text className="text-foreground text-3xl font-bold">{totalExercises}</Text>
                        <Text className="text-muted-foreground text-xs mt-1">{t('workouts.totalExercisesLabel')}</Text>
                    </View>
                    <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                        <View className="flex-row items-center gap-2 mb-2">
                            <BarChart3 size={16} color={colors.primary} />
                            <Text className="text-muted-foreground text-xs uppercase tracking-wide">
                                {t('workouts.weekLabel')}
                            </Text>
                        </View>
                        <Text className="text-foreground text-3xl font-bold">{workoutsThisWeek}</Text>
                        <Text className="text-muted-foreground text-xs mt-1">{weekProgressText}</Text>
                    </View>
                </View>

                {/* Weekly Progress Calendar */}
                <View className="bg-card rounded-xl p-4 mb-6 border border-border/50 shadow-soft-1">
                    <View className="flex-row justify-between items-center mb-4">
                        <View className="flex-row items-center gap-2">
                            <CalendarIcon size={18} color={colors.primary} />
                            <Text className="text-foreground font-semibold text-base">
                                {t('workouts.activityWeek')}
                            </Text>
                        </View>
                        <Pressable onPress={() => navigation.navigate('WorkoutHistory')}>
                            <Text className="text-primary text-sm font-medium">{t('workouts.allHistory')}</Text>
                        </Pressable>
                    </View>

                    <View className="flex-row justify-around">
                        {weeklyProgress.map((day, index) => (
                            <View key={index} className="items-center">
                                <Text className="text-muted-foreground text-xs mb-2 font-medium">{day.day}</Text>
                                <View className={`w-10 h-10 rounded-xl justify-center items-center ${
                                    day.hasWorkout
                                        ? 'bg-primary'
                                        : 'border border-border bg-transparent'
                                }`}>
                                    {day.hasWorkout ? (
                                        <CheckCircle size={18} color={colors.primaryForeground} />
                                    ) : day.isRestDay ? (
                                        <XCircle size={16} color={colors.mutedForeground} />
                                    ) : (
                                        <Text className="text-muted-foreground text-xs">—</Text>
                                    )}
                                </View>
                                {day.sets > 0 && (
                                    <Text className="text-muted-foreground text-xs mt-1 font-medium">{day.sets}</Text>
                                )}
                            </View>
                        ))}
                    </View>

                    <View className="flex-row justify-center gap-4 mt-4 pt-3 border-t border-border">
                        <View className="flex-row items-center gap-2">
                            <View className="w-3 h-3 rounded-full bg-primary" />
                            <Text className="text-muted-foreground text-xs">{t('workouts.workout')}</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <View className="w-3 h-3 rounded-full border border-border bg-transparent" />
                            <Text className="text-muted-foreground text-xs">{t('workouts.rest')}</Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                            <Text className="text-muted-foreground text-xs">—</Text>
                            <Text className="text-muted-foreground text-xs">{t('workouts.future')}</Text>
                        </View>
                    </View>
                </View>

                {/* Start Workout Section */}
                {activeWorkout ? (
                    <View className="rounded-xl p-5 mb-6 border border-primary/30">
                        <View className="flex-row justify-between items-start mb-3">
                            <View className="bg-primary/10 rounded-full px-3 py-1">
                                <Text className="text-primary text-xs font-semibold">{t('workouts.activeNow')}</Text>
                            </View>
                            <Clock size={16} color={colors.mutedForeground} />
                        </View>
                        <Text className="text-foreground text-xl font-bold mb-1">
                            {activeWorkout.name}
                        </Text>
                        <Text className="text-muted-foreground text-sm mb-4">
                            {t('workouts.startedAt')} {new Date(activeWorkout.startTime).toLocaleTimeString()}
                        </Text>

                        <View className="flex-row gap-4 mb-4">
                            <View className="flex-row items-center gap-2 bg-input-background px-3 py-1.5 rounded-full">
                                <Dumbbell size={14} color={colors.primary} />
                                <Text className="text-foreground text-sm">
                                    {activeWorkout.exercises.length} {t('workouts.exercises')}
                                </Text>
                            </View>
                        </View>

                        <Pressable
                            onPress={handleStartWorkout}
                            className="bg-primary/10 py-3 rounded-xl flex-row items-center justify-center gap-2 shadow-lg"
                        >
                            <Play size={18} color={colors.primary} />
                            <Text className="text-primary font-semibold text-base">
                                {t('workouts.continueWorkout')}
                            </Text>
                        </Pressable>
                    </View>
                ) : (
                    <Pressable
                        onPress={handleStartWorkout}
                        className="border border-primary py-8 rounded-xl mb-6 items-center shadow-xl"
                    >
                        <View className="bg-primary rounded-full p-4 mb-3">
                            <Play size={40} color={colors.primaryForeground} />
                        </View>
                        <Text className="text-primary text-2xl font-bold mb-2">
                            {t('workouts.startWorkoutTitle')}
                        </Text>
                        <Text className="text-primary text-sm text-center px-6">
                            {t('workouts.startWorkoutDesc')}
                        </Text>
                    </Pressable>
                )}

                {/* Recent Workouts */}
                {recentWorkouts.length > 0 && (
                    <View className="mb-6">
                        <View className="flex-row justify-between items-center mb-3">
                            <View className="flex-row items-center gap-2">
                                <TrendingUp size={18} color={colors.primary} />
                                <Text className="text-foreground font-semibold text-base">
                                    {t('workouts.recentWorkouts')}
                                </Text>
                            </View>
                            <Pressable onPress={() => navigation.navigate('WorkoutHistory')}>
                                <Text className="text-primary text-sm font-medium">{t('workouts.viewAll')}</Text>
                            </Pressable>
                        </View>

                        {recentWorkouts.map((workout) => (
                            <Pressable
                                key={workout.id}
                                onPress={() => navigation.navigate('WorkoutDetail', { workoutId: workout.id })}
                                className="bg-card rounded-xl p-4 mb-3 border border-border/50"
                            >
                                <View className="flex-row justify-between items-start mb-2">
                                    <Text className="text-foreground font-semibold">{workout.name}</Text>
                                    <Text className="text-muted-foreground text-xs">
                                        {new Date(workout.date).toLocaleDateString(t('locale'), { day: 'numeric', month: 'short' })}
                                    </Text>
                                </View>
                                <View className="flex-row gap-4">
                                    <View className="flex-row items-center gap-1">
                                        <Clock size={12} color={colors.mutedForeground} />
                                        <Text className="text-muted-foreground text-xs">
                                            {formatDuration(workout.duration)}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center gap-1">
                                        <Dumbbell size={12} color={colors.mutedForeground} />
                                        <Text className="text-muted-foreground text-xs">
                                            {workout.totalExercises} {t('workouts.exercisesShort')}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center gap-1">
                                        <Zap size={12} color={colors.mutedForeground} />
                                        <Text className="text-muted-foreground text-xs">
                                            {workout.totalSets} {t('workouts.setsShort')}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}

                {/* Quick Action Button */}
                <Pressable
                    onPress={() => navigation.navigate('WorkoutHistory')}
                    className="flex-row items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-border"
                >
                    <CalendarIcon size={18} color={colors.primary} />
                    <Text className="text-primary font-medium">
                        {t('workouts.viewFullHistory')}
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}