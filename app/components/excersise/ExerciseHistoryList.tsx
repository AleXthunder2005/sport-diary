import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Calendar, ArrowRight } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';

export const ExerciseHistoryList = ({ history, onWorkoutPress, isDark }) => {
    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <View className="bg-card rounded-xl p-4 border border-border/50">
            <Text className="text-foreground font-semibold text-lg mb-4">
                История выполнения
            </Text>

            {history.length > 0 ? (
                history.map((item) => (
                    <Pressable
                        key={item.id}
                        onPress={() => onWorkoutPress(item.workoutId)}
                        className="mb-4 p-3 bg-input-background rounded-lg"
                    >
                        <View className="flex-row justify-between items-start mb-2">
                            <View className="flex-row items-center gap-2">
                                <Calendar size={16} color={colors.mutedForeground} />
                                <Text className="text-foreground font-medium">
                                    {formatDate(item.workoutDate)}
                                </Text>
                            </View>
                            <ArrowRight size={16} color={colors.primary} />
                        </View>

                        <View className="flex-row flex-wrap gap-2">
                            {item.sets.map((set, idx) => (
                                <View key={idx} className="bg-card px-2 py-1 rounded">
                                    <Text className="text-muted-foreground text-xs">
                                        {set.weight}кг × {set.reps}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text className="text-muted-foreground text-xs mt-2">
                            Макс. вес: {item.maxWeight}кг
                        </Text>
                    </Pressable>
                ))
            ) : (
                <View className="py-8 items-center">
                    <Text className="text-muted-foreground">Нет истории выполнения</Text>
                </View>
            )}
        </View>
    );
};