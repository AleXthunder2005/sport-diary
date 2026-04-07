import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { getColor } from '@/app/colors/colors';
import { getMuscleGroupById, getExerciseTypeById } from '@/app/entities/exercisesMetadata';
import { useTranslation } from 'react-i18next';

export const ExerciseCard = ({ exercise, onPress, isDark }) => {
    const { t } = useTranslation();
    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
    };

    const muscleGroup = getMuscleGroupById(exercise.muscleGroup);
    const exerciseType = getExerciseTypeById(exercise.type);
    const TypeIcon = exerciseType.icon;

    return (
        <Pressable onPress={() => onPress(exercise)}>
            <View className="bg-card rounded-xl mb-3 overflow-hidden border border-border/50 shadow-soft-1">
                <View className="flex-row p-4">
                    {/* Photo */}
                    <View className="w-20 h-20 rounded-lg bg-primary/10 mr-4 overflow-hidden justify-center items-center">
                        {exercise.photo ? (
                            <Image source={{ uri: exercise.photo }} className="w-full h-full" />
                        ) : (
                            <TypeIcon size={32} color={colors.primary} />
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
                                    {t(exerciseType.labelKey)}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <Text className="text-muted-foreground text-xs">
                                    {t(muscleGroup.labelKey)}
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