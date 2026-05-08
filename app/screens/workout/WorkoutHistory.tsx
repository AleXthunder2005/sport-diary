import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useAppTheme } from '@/app/theme/theme';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Calendar, Filter, Trash2, TrendingUp } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { workoutService } from '@/app/services/workout/workoutService';
import { WorkoutCard } from '@/app/components/workout/WorkoutCard';

export default function WorkoutHistory({ navigation }) {
    const { colorScheme } = useAppTheme();
    const { t } = useTranslation();
    const isDark = colorScheme === 'dark';

    const [workouts, setWorkouts] = useState([]);
    const [filteredWorkouts, setFilteredWorkouts] = useState([]);
    const [period, setPeriod] = useState('all');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        background: getColor(isDark ? 'dark' : 'light', 'background'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
        destructive: getColor(isDark ? 'dark' : 'light', 'destructive'),
    };

    const periods = [
        { id: 'all', label: t('workouts.allTime') },
        { id: 'week', label: t('workouts.week') },
        { id: 'month', label: t('workouts.month') },
        { id: 'year', label: t('workouts.year') },
    ];

    useEffect(() => {
        loadWorkouts();
    }, [period]);

    const loadWorkouts = async () => {
        setLoading(true);
        const data = await workoutService.getWorkoutHistory(period);
        setWorkouts(data);
        setFilteredWorkouts(data);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadWorkouts();
        setRefreshing(false);
    };

    const handleWorkoutPress = (workout) => {
        navigation.navigate('WorkoutDetail', { workoutId: workout.id });
    };

    const handleDeleteWorkout = (workoutId) => {
        Alert.alert(
            t('workouts.deleteWorkout'),
            t('workouts.confirmDelete'),
            [
                { text: t('workouts.cancel'), style: 'cancel' },
                {
                    text: t('workouts.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        await workoutService.deleteWorkout(workoutId);
                        await loadWorkouts();
                    }
                }
            ]
        );
    };

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
        setShowFilters(false);
    };

    if (loading && !refreshing) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="flex-row justify-between items-center p-4 border-b border-border">
                <Pressable onPress={() => navigation.goBack()} className="p-1">
                    <ArrowLeft size={24} color={colors.primary} />
                </Pressable>
                <Text className="text-foreground text-xl font-bold">{t('workouts.history')}</Text>
                <Pressable onPress={() => setShowFilters(!showFilters)} className="p-1">
                    <Filter size={24} color={colors.primary} />
                </Pressable>
            </View>

            {/* Filters */}
            {showFilters && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="p-4 border-b border-border">
                    <View className="flex-row gap-2">
                        {periods.map((p) => (
                            <Pressable
                                key={p.id}
                                onPress={() => handlePeriodChange(p.id)}
                                className={`px-4 py-2 rounded-full ${
                                    period === p.id ? 'bg-primary' : 'bg-input-background border border-border'
                                }`}
                            >
                                <Text className={period === p.id ? 'text-primary-foreground' : 'text-foreground'}>
                                    {p.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            )}

            {/* Stats Summary */}
            <View className="flex-row gap-3 p-4 border-b border-border">
                <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                    <Text className="text-muted-foreground text-xs mb-1">{t('workouts.totalWorkouts')}</Text>
                    <Text className="text-foreground text-lg font-bold">{workouts.length}</Text>
                </View>
                <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                    <Text className="text-muted-foreground text-xs mb-1">{t('workouts.totalVolume')}</Text>
                    <Text className="text-foreground text-lg font-bold">
                        {workouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0)} {t('units.kg')}
                    </Text>
                </View>
                <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                    <Text className="text-muted-foreground text-xs mb-1">{t('workouts.totalSets')}</Text>
                    <Text className="text-foreground text-lg font-bold">
                        {workouts.reduce((sum, w) => sum + (w.totalSets || 0), 0)}
                    </Text>
                </View>
            </View>

            {/* Workouts List */}
            <ScrollView
                className="flex-1 p-4"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
                }
            >
                {filteredWorkouts.length > 0 ? (
                    filteredWorkouts.map((workout) => (
                        <View key={workout.id} className="relative">
                            <WorkoutCard
                                workout={workout}
                                onPress={handleWorkoutPress}
                                isDark={isDark}
                            />
                            <Pressable
                                onPress={() => handleDeleteWorkout(workout.id)}
                                className="absolute top-3 right-3 p-2 bg-destructive/10 rounded-full"
                            >
                                <Trash2 size={16} color={colors.destructive} />
                            </Pressable>
                        </View>
                    ))
                ) : (
                    <View className="py-20 items-center">
                        <Calendar size={48} color={colors.mutedForeground} />
                        <Text className="text-muted-foreground text-center mt-4">
                            {t('workouts.noHistory')}
                        </Text>
                        <Pressable
                            onPress={() => navigation.navigate('WorkoutHome')}
                            className="bg-primary px-6 py-3 rounded-full mt-4"
                        >
                            <Text className="text-primary-foreground font-semibold">
                                {t('workouts.startFirst')}
                            </Text>
                        </Pressable>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}