import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { Dumbbell, Heart, Zap, Activity } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';

const muscleGroupIcons = {
    chest: '💪',
    back: '🔙',
    legs: '🦵',
    shoulders: '🎯',
    arms: '💪',
    core: '🎯',
    cardio: '❤️',
    stretching: '🧘',
};

const muscleGroupLabels = {
    chest: 'Грудь',
    back: 'Спина',
    legs: 'Ноги',
    shoulders: 'Плечи',
    arms: 'Руки',
    core: 'Кор',
    cardio: 'Кардио',
    stretching: 'Растяжка',
};

const typeIcons = {
    strength: Dumbbell,
    cardio: Heart,
    stretching: Activity,
};

export const ExerciseCard = ({ exercise, onPress, isDark }) => {
    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
    };

    const TypeIcon = typeIcons[exercise.type];

    return (
        <Pressable onPress={() => onPress(exercise)}>
            <View className="bg-card rounded-xl mb-3 overflow-hidden border border-border/50 shadow-soft-1">
                <View className="flex-row p-4">
                    {/* Photo */}
                    <View className="w-20 h-20 rounded-lg bg-primary/10 mr-4 overflow-hidden">
                        {exercise.photo ? (
                            <Image source={{ uri: exercise.photo }} className="w-full h-full" />
                        ) : (
                            <View className="w-full h-full justify-center items-center">
                                <Text className="text-3xl">{muscleGroupIcons[exercise.muscleGroup]}</Text>
                            </View>
                        )}
                    </View>

                    {/* Info */}
                    <View className="flex-1">
                        <Text className="text-foreground text-lg font-semibold mb-1">
                            {exercise.name}
                        </Text>
                        <View className="flex-row items-center gap-3 mb-2">
                            <View className="flex-row items-center gap-1">
                                <TypeIcon size={14} color={colors.mutedForeground} />
                                <Text className="text-muted-foreground text-xs">
                                    {exercise.type === 'strength' ? 'Силовое' : exercise.type === 'cardio' ? 'Кардио' : 'Растяжка'}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <Text className="text-muted-foreground text-xs">
                                    {muscleGroupLabels[exercise.muscleGroup]}
                                </Text>
                            </View>
                        </View>
                        {exercise.description && (
                            <Text className="text-muted-foreground text-xs" numberOfLines={2}>
                                {exercise.description}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </Pressable>
    );
};