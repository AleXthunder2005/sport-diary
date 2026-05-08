import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Clock, Dumbbell, TrendingUp } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { useTranslation } from 'react-i18next';

export const WorkoutCard = ({ workout, onPress, isDark }) => {
    const { t } = useTranslation();
    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}ч ${minutes}м`;
        return `${minutes}м`;
    };

    return (
        <Pressable onPress={() => onPress(workout)}>
            <View className="bg-card rounded-xl mb-3 p-4 border border-border/50 shadow-soft-1">
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-foreground text-lg font-semibold flex-1">
                        {workout.name}
                    </Text>
                    <Text className="text-muted-foreground text-xs">
                        {formatDate(workout.date)}
                    </Text>
                </View>

                <View className="flex-row gap-4 mt-2">
                    <View className="flex-row items-center gap-1">
                        <Clock size={14} color={colors.mutedForeground} />
                        <Text className="text-muted-foreground text-xs">
                            {formatDuration(workout.duration)}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <Dumbbell size={14} color={colors.mutedForeground} />
                        <Text className="text-muted-foreground text-xs">
                            {workout.totalExercises} {t('workouts.exercises')}
                        </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                        <TrendingUp size={14} color={colors.mutedForeground} />
                        <Text className="text-muted-foreground text-xs">
                            {workout.totalSets} {t('workouts.sets')}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};