import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/app/theme/theme';
import { useTranslation } from 'react-i18next';
import { Edit3, ArrowLeft } from 'lucide-react-native';
import { ExerciseStatsChart, ExerciseHistoryList } from '@/app/components/excersise';
import { getColor } from '@/app/colors/colors';
import { getMuscleGroupById, getExerciseTypeById } from '@/app/entities/exercisesMetadata';

// Mock data for stats
const mockStatsData = {
    bestWeight: 120,
    bestOneRM: 135,
    totalVolume: 12500,
    totalSets: 48,
    lastPerformed: new Date('2024-11-29'),
    frequency: 2,
};

const mockChartData = {
    '30d': [
        { date: '01.11', weight: 100 },
        { date: '08.11', weight: 105 },
        { date: '15.11', weight: 110 },
        { date: '22.11', weight: 115 },
        { date: '29.11', weight: 120 },
    ],
    '3m': [
        { date: '01.09', weight: 85 },
        { date: '15.09', weight: 90 },
        { date: '01.10', weight: 95 },
        { date: '15.10', weight: 100 },
        { date: '01.11', weight: 105 },
        { date: '15.11', weight: 110 },
        { date: '29.11', weight: 120 },
    ],
    '1y': [
        { date: '01.01', weight: 70 },
        { date: '01.03', weight: 80 },
        { date: '01.06', weight: 90 },
        { date: '01.09', weight: 100 },
        { date: '01.11', weight: 120 },
    ],
    'all': [
        { date: '01.01', weight: 70 },
        { date: '01.03', weight: 80 },
        { date: '01.06', weight: 90 },
        { date: '01.09', weight: 100 },
        { date: '01.11', weight: 120 },
    ],
};

const mockHistory = {
    '30d': [
        {
            id: '1',
            workoutId: 'w1',
            workoutDate: new Date('2024-11-29'),
            sets: [
                { weight: 100, reps: 8 },
                { weight: 110, reps: 6 },
                { weight: 120, reps: 4 },
            ],
            maxWeight: 120,
        },
        {
            id: '2',
            workoutId: 'w2',
            workoutDate: new Date('2024-11-22'),
            sets: [
                { weight: 90, reps: 10 },
                { weight: 100, reps: 8 },
                { weight: 110, reps: 6 },
            ],
            maxWeight: 110,
        },
        {
            id: '3',
            workoutId: 'w3',
            workoutDate: new Date('2024-11-15'),
            sets: [
                { weight: 80, reps: 10 },
                { weight: 90, reps: 8 },
                { weight: 100, reps: 6 },
            ],
            maxWeight: 100,
        },
    ],
    '3m': [
        {
            id: '1',
            workoutId: 'w1',
            workoutDate: new Date('2024-11-29'),
            sets: [
                { weight: 100, reps: 8 },
                { weight: 110, reps: 6 },
                { weight: 120, reps: 4 },
            ],
            maxWeight: 120,
        },
        {
            id: '2',
            workoutId: 'w2',
            workoutDate: new Date('2024-10-22'),
            sets: [
                { weight: 90, reps: 10 },
                { weight: 100, reps: 8 },
                { weight: 110, reps: 6 },
            ],
            maxWeight: 110,
        },
        {
            id: '3',
            workoutId: 'w3',
            workoutDate: new Date('2024-09-15'),
            sets: [
                { weight: 80, reps: 10 },
                { weight: 85, reps: 8 },
                { weight: 90, reps: 6 },
            ],
            maxWeight: 90,
        },
    ],
    '1y': [
        {
            id: '1',
            workoutId: 'w1',
            workoutDate: new Date('2024-11-29'),
            sets: [
                { weight: 100, reps: 8 },
                { weight: 110, reps: 6 },
                { weight: 120, reps: 4 },
            ],
            maxWeight: 120,
        },
        {
            id: '2',
            workoutId: 'w2',
            workoutDate: new Date('2024-08-22'),
            sets: [
                { weight: 90, reps: 10 },
                { weight: 100, reps: 8 },
                { weight: 110, reps: 6 },
            ],
            maxWeight: 110,
        },
        {
            id: '3',
            workoutId: 'w3',
            workoutDate: new Date('2024-05-15'),
            sets: [
                { weight: 80, reps: 10 },
                { weight: 85, reps: 8 },
                { weight: 90, reps: 6 },
            ],
            maxWeight: 90,
        },
    ],
    'all': [
        {
            id: '1',
            workoutId: 'w1',
            workoutDate: new Date('2024-11-29'),
            sets: [
                { weight: 100, reps: 8 },
                { weight: 110, reps: 6 },
                { weight: 120, reps: 4 },
            ],
            maxWeight: 120,
        },
        {
            id: '2',
            workoutId: 'w2',
            workoutDate: new Date('2024-08-22'),
            sets: [
                { weight: 90, reps: 10 },
                { weight: 100, reps: 8 },
                { weight: 110, reps: 6 },
            ],
            maxWeight: 110,
        },
        {
            id: '3',
            workoutId: 'w3',
            workoutDate: new Date('2024-05-15'),
            sets: [
                { weight: 80, reps: 10 },
                { weight: 85, reps: 8 },
                { weight: 90, reps: 6 },
            ],
            maxWeight: 90,
        },
    ],
};

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
        setTimeout(() => {
            setExercise({
                id: id,
                name: 'Жим лежа',
                muscleGroup: 'chest',
                type: 'strength',
                description: 'Базовое упражнение для развития грудных мышц. Лягте на скамью, возьмитесь за гриф шире плеч, опустите штангу к груди и выжмите вверх.',
                tips: 'Держите лопатки сведенными, не отрывайте таз от скамьи.',
                photo: null,
            });
            setStats(mockStatsData);
            setLoading(false);
        }, 500);
    };

    const loadPeriodData = () => {
        setChartLoading(true);
        setTimeout(() => {
            setChartData(mockChartData[period] || mockChartData['30d']);
            setHistory(mockHistory[period] || mockHistory['30d']);
            setChartLoading(false);
        }, 300);
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