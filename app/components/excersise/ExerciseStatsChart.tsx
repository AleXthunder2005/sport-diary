import React from 'react';
import { View, Text, Dimensions, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getColor } from '@/app/colors/colors';
import { chartPeriods } from '@/app/entities/exercisesMetadata';
import { useTranslation } from 'react-i18next';

export const ExerciseStatsChart = ({ data, period, onPeriodChange, isDark, isLoading = false }) => {
    const { t } = useTranslation();
    const screenWidth = Dimensions.get('window').width - 48;
    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
    };

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
            <Text className="text-foreground font-semibold text-lg mb-3">
                {t('exercises.weightDynamics')}
            </Text>

            {/* Period Filter*/}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <View className="flex-row gap-2">
                    {chartPeriods.map((p) => (
                        <Pressable
                            key={p.id}
                            onPress={() => onPeriodChange(p.id)}
                            className={`px-3 py-1.5 rounded-full ${
                                period === p.id ? 'bg-primary' : 'bg-input-background border border-border'
                            }`}
                        >
                            <Text
                                className={
                                    period === p.id ? 'text-primary-foreground' : 'text-foreground'
                                }
                            >
                                {t(p.labelKey)}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>

            {/* Chart */}
            {isLoading ? (
                <View className="h-48 justify-center items-center">
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : data.length > 0 ? (
                <LineChart
                    data={chartData}
                    width={screenWidth - 12}
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
                            r: '4',
                            strokeWidth: '2',
                            stroke: colors.primary,
                        },
                    }}

                    style={{
                        marginLeft: -13,
                        borderRadius: 16,
                    }}
                />
            ) : (
                <View className="h-48 justify-center items-center">
                    <Text className="text-muted-foreground">{t('exercises.noData')}</Text>
                </View>
            )}
        </View>
    );
};