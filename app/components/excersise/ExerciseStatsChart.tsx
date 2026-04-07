// components/exercises/ExerciseStatsChart.jsx
import React from 'react';
import { View, Text, Dimensions, ScrollView, Pressable } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getColor } from '@/app/colors/colors';

export const ExerciseStatsChart = ({ data, period, onPeriodChange, isDark }) => {
    const screenWidth = Dimensions.get('window').width - 48;
    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
    };

    const periods = [
        { id: '30d', label: '30 дней' },
        { id: '3m', label: '3 месяца' },
        { id: '1y', label: 'Год' },
        { id: 'all', label: 'Всё время' },
    ];

    const chartData = {
        labels: data.map(d => d.date),
        datasets: [{
            data: data.map(d => d.weight),
            color: (opacity = 1) => colors.primary,
            strokeWidth: 2,
        }],
    };

    return (
        <View className="bg-card rounded-xl p-4 border border-border/50 mb-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-foreground font-semibold text-lg">
                    Динамика рабочего веса
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View className="flex-row gap-2">
                        {periods.map((p) => (
                            <Pressable
                                key={p.id}
                                onPress={() => onPeriodChange(p.id)}
                                className={`px-3 py-1 rounded-full ${
                                    period === p.id ? 'bg-primary' : 'bg-input-background border border-border'
                                }`}
                            >
                                <Text
                                    className={
                                        period === p.id ? 'text-primary-foreground' : 'text-foreground'
                                    }
                                >
                                    {p.label}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </ScrollView>
            </View>

            {data.length > 0 ? (
                <LineChart
                    data={chartData}
                    width={screenWidth - 32}
                    height={220}
                    chartConfig={{
                        backgroundColor: colors.card,
                        backgroundGradientFrom: colors.card,
                        backgroundGradientTo: colors.card,
                        decimalPlaces: 0,
                        color: (opacity = 1) => colors.primary,
                        labelColor: (opacity = 1) => colors.mutedForeground,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: colors.primary,
                        },
                    }}
                    bezier
                    style={{
                        marginLeft: -20,
                        borderRadius: 16,
                    }}
                />
            ) : (
                <View className="h-48 justify-center items-center">
                    <Text className="text-muted-foreground">Нет данных за выбранный период</Text>
                </View>
            )}
        </View>
    );
};