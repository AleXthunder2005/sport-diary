import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/app/theme/theme';
import { useTranslation } from 'react-i18next';
import { Edit3, TrendingUp, History as HistoryIcon, ArrowLeft } from 'lucide-react-native';
import { ExerciseStatsChart, ExerciseHistoryList } from '@/app/components/excersise';
import { getColor } from '@/app/colors/colors';

// Mock data for stats
const mockStatsData = {
    bestWeight: 120,
    bestOneRM: 135,
    totalVolume: 12500,
    totalSets: 48,
    lastPerformed: new Date('2024-11-29'),
    frequency: 2,
};

const mockChartData = [
    { date: '01.11', weight: 100 },
    { date: '08.11', weight: 105 },
    { date: '15.11', weight: 110 },
    { date: '22.11', weight: 115 },
    { date: '29.11', weight: 120 },
];

const mockHistory = [
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
];

export default function ExerciseDetail({ navigation, route }) {
    const { colorScheme } = useAppTheme();
    const { t } = useTranslation();
    const isDark = colorScheme === 'dark';
    const { id } = route.params;

    const [exercise, setExercise] = useState(null);
    const [stats, setStats] = useState(null);
    const [chartData, setChartData] = useState([]);
    const [history, setHistory] = useState([]);
    const [period, setPeriod] = useState('30d');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExerciseData();
    }, [id, period]);

    const loadExerciseData = async () => {
        setLoading(true);
        // TODO: Загрузить из хранилища
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

            // Фильтруем данные по периоду
            let filteredHistory = [...mockHistory];
            if (period === '30d') {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                filteredHistory = filteredHistory.filter(h => h.workoutDate >= thirtyDaysAgo);
            } else if (period === '3m') {
                const threeMonthsAgo = new Date();
                threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
                filteredHistory = filteredHistory.filter(h => h.workoutDate >= threeMonthsAgo);
            } else if (period === '1y') {
                const oneYearAgo = new Date();
                oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
                filteredHistory = filteredHistory.filter(h => h.workoutDate >= oneYearAgo);
            }

            setHistory(filteredHistory);

            // Обновляем данные для графика
            const filteredChartData = mockChartData.slice(-(period === '30d' ? 5 : period === '3m' ? 10 : mockChartData.length));
            setChartData(filteredChartData);

            setLoading(false);
        }, 500);
    };

    const handleEdit = () => {
        navigation.navigate('ExerciseForm', { id: id });
    };

    const handleWorkoutPress = (workoutId) => {
        navigation.navigate('WorkoutDetail', { id: workoutId });
    };

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    };

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

                <View className="flex-row justify-between items-start mb-4">
                    <View className="flex-1">
                        <Text className="text-2xl font-bold text-foreground mb-2">
                            {exercise?.name}
                        </Text>
                        <Text className="text-muted-foreground">
                            {exercise?.muscleGroup} • {exercise?.type === 'strength' ? 'Силовое' : exercise?.type === 'cardio' ? 'Кардио' : 'Растяжка'}
                        </Text>
                    </View>
                </View>

                {/* Stats Cards */}
                <View className="flex-row gap-3 mb-4">
                    <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                        <Text className="text-muted-foreground text-xs mb-1">Лучший вес</Text>
                        <Text className="text-foreground text-xl font-bold">{stats?.bestWeight} кг</Text>
                    </View>
                    <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                        <Text className="text-muted-foreground text-xs mb-1">1ПМ (расчет)</Text>
                        <Text className="text-foreground text-xl font-bold">{stats?.bestOneRM} кг</Text>
                    </View>
                </View>

                <View className="flex-row gap-3 mb-4">
                    <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                        <Text className="text-muted-foreground text-xs mb-1">Всего подходов</Text>
                        <Text className="text-foreground text-xl font-bold">{stats?.totalSets}</Text>
                    </View>
                    <View className="flex-1 bg-card rounded-xl p-3 border border-border/50">
                        <Text className="text-muted-foreground text-xs mb-1">Объем (кг)</Text>
                        <Text className="text-foreground text-xl font-bold">{stats?.totalVolume}</Text>
                    </View>
                </View>

                {/* Description */}
                {exercise?.description && (
                    <View className="bg-card rounded-xl p-4 border border-border/50 mb-4">
                        <Text className="text-foreground font-semibold mb-2">Описание</Text>
                        <Text className="text-muted-foreground">{exercise.description}</Text>
                    </View>
                )}

                {/* Tips */}
                {exercise?.tips && (
                    <View className="bg-card rounded-xl p-4 border border-border/50 mb-4">
                        <Text className="text-foreground font-semibold mb-2">Подсказки</Text>
                        <Text className="text-muted-foreground">{exercise.tips}</Text>
                    </View>
                )}

                {/* Chart */}
                <ExerciseStatsChart
                    data={chartData}
                    period={period}
                    onPeriodChange={setPeriod}
                    isDark={isDark}
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
                        Последнее выполнение: {formatDate(stats?.lastPerformed)}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}