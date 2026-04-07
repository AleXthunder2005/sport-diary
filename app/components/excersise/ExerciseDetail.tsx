// app/screens/excersise/ExerciseDetail.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/app/theme/theme';
import { useTranslation } from 'react-i18next';
import { Edit3, ArrowLeft } from 'lucide-react-native';
import { ExerciseStatsChart, ExerciseHistoryList } from '@/app/components/excersise';
import { getColor } from '@/app/colors/colors';
import { getMuscleGroupById, getExerciseTypeById } from '@/app/entities/exercisesMetadata';
import { exercisesApi } from '@/app/services/exercises/exerciseService';

export default function ExerciseDetail({ navigation, route }) {
    const { colorScheme } = useAppTheme();
    const { t, i18n } = useTranslation();
    const isDark = colorScheme === 'dark';
    const { id } = route.params;

    const [exercise, setExercise] = useState(null);
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [history, setHistory] = useState([]);
    const [period, setPeriod] = useState('30d');
    const [loading, setLoading] = useState(true);
    const [chartLoading, setChartLoading] = useState(false);

    useEffect(() => {
        loadExerciseData();
    }, [id]);

    useEffect(() => {
        if (exercise) {
            loadPeriodData();
        }
    }, [period, exercise]);

    const loadExerciseData = async () => {
        setLoading(true);
        const [exerciseData, statsData] = await Promise.all([
            exercisesApi.getExerciseById(id),
            exercisesApi.getExerciseStats(id),
        ]);
        setExercise(exerciseData);
        setStats(statsData);
        setLoading(false);
    };

    const loadPeriodData = async () => {
        setChartLoading(true);
        const [chartData, historyData] = await Promise.all([
            exercisesApi.getExerciseChartData(id, period),
            exercisesApi.getExerciseHistory(id, period),
        ]);
        setChartData(chartData);
        setHistory(historyData);
        setChartLoading(false);
    };

    const handleEdit = () => {
        navigation.navigate('ExerciseForm', { id: id });
    };

    const handleWorkoutPress = (workoutId) => {
        navigation.navigate('WorkoutDetail', { id: workoutId });
    };

    const handlePeriodChange = (newPeriod) => {
        setPeriod(newPeriod);
    };

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString(i18n.language === 'ru' ? 'ru-RU' : 'en-US',
            { day: 'numeric', month: 'long', year: 'numeric' }
        );
    };

    const muscleGroup = exercise ? getMuscleGroupById(exercise.muscleGroup) : null;
    const exerciseType = exercise ? getExerciseTypeById(exercise.type) : null;

    if (loading) {
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
                <View className="flex-row justify-between items-start mb-4">
                    <Pressable onPress={() => navigation.goBack()} className="p-1">
                        <ArrowLeft size={24} color={colors.primary} />
                    </Pressable>
                    <Pressable onPress={handleEdit} className="bg-primary p-2 rounded-full">
                        <Edit3 size={20} color={colors.primaryForeground} />
                    </Pressable>
                </View>

                <View className="mb-4">
                    <Text className="text-2xl font-bold text-foreground mb-2">
                        {exercise?.name}
                    </Text>
                    <Text className="text-muted-foreground">
                        {t(muscleGroup?.labelKey)} • {t(exerciseType?.labelKey)}
                    </Text>
                </View>

                {/* Stats Cards */}
                <View className="flex-row gap-3 mb-4">
                    <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                        <Text className="text-muted-foreground text-xs mb-1">{t('exercises.bestWeight')}</Text>
                        <Text className="text-foreground text-xl font-bold">{stats?.bestWeight} {t("units.kg")}</Text>
                    </View>
                    <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                        <Text className="text-muted-foreground text-xs mb-1">{t('exercises.oneRM')}</Text>
                        <Text className="text-foreground text-xl font-bold">{stats?.bestOneRM} {t("units.kg")}</Text>
                    </View>
                </View>

                <View className="flex-row gap-3 mb-4">
                    <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                        <Text className="text-muted-foreground text-xs mb-1">{t('exercises.totalSets')}</Text>
                        <Text className="text-foreground text-xl font-bold">{stats?.totalSets}</Text>
                    </View>
                    <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                        <Text className="text-muted-foreground text-xs mb-1">{t('exercises.totalVolume')}</Text>
                        <Text className="text-foreground text-xl font-bold">{stats?.totalVolume}</Text>
                    </View>
                </View>

                {/* Description */}
                {exercise?.description && (
                    <View className="bg-card rounded-xl p-4 border border-border/50 mb-4">
                        <Text className="text-foreground font-semibold mb-2">{t('exercises.description')}</Text>
                        <Text className="text-muted-foreground">{exercise.description}</Text>
                    </View>
                )}

                {/* Tips */}
                {exercise?.tips && (
                    <View className="bg-card rounded-xl p-4 border border-border/50 mb-4">
                        <Text className="text-foreground font-semibold mb-2">{t('exercises.tips')}</Text>
                        <Text className="text-muted-foreground">{exercise.tips}</Text>
                    </View>
                )}

                {/* Chart */}
                <ExerciseStatsChart
                    data={chartData}
                    period={period}
                    onPeriodChange={handlePeriodChange}
                    isDark={isDark}
                    isLoading={chartLoading}
                />

                {/* History */}
                <ExerciseHistoryList
                    history={history}
                    onWorkoutPress={handleWorkoutPress}
                    isDark={isDark}
                />

                {/* Last performed */}
                <View className="mt-4 items-center">
                    <Text className="text-muted-foreground text-xs">
                        {t('exercises.lastPerformed')}: {formatDate(stats?.lastPerformed)}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}