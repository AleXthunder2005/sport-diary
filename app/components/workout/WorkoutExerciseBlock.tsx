// components/workout/WorkoutExerciseBlock.jsx
import React from 'react';
import { View, Text, Pressable, Image, Alert } from 'react-native';
import { Plus, Trash2, ChevronUp, ChevronDown, Dumbbell } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { useTranslation } from 'react-i18next';
import { WorkoutSetRow } from './WorkoutSetRow';

export const WorkoutExerciseBlock = ({
                                         exercise,
                                         exerciseIndex,
                                         onAddSet,
                                         onUpdateSet,
                                         onDeleteSet,
                                         onDeleteExercise,
                                         onMoveExercise,
                                         isDark,
                                         isEditing = true
                                     }) => {
    const { t } = useTranslation();
    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        destructive: getColor(isDark ? 'dark' : 'light', 'destructive'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
    };

    const showExerciseMenu = () => {
        Alert.alert(
            exercise.exerciseName,
            '',
            [
                { text: t('workouts.deleteExercise'), onPress: () => onDeleteExercise(), style: 'destructive' },
                { text: t('workouts.moveUp'), onPress: () => onMoveExercise('up') },
                { text: t('workouts.moveDown'), onPress: () => onMoveExercise('down') },
                { text: t('workouts.cancel'), style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    return (
        <View className="bg-card rounded-xl mb-4 overflow-hidden border border-border/50">
            {/* Header */}
            <Pressable onLongPress={showExerciseMenu} delayLongPress={500}>
                <View className="flex-row p-4 bg-input-background">
                    {/* Photo */}
                    <View className="w-12 h-12 rounded-lg bg-primary/10 mr-3 overflow-hidden justify-center items-center">
                        {exercise.exercisePhoto ? (
                            <Image source={{ uri: exercise.exercisePhoto }} className="w-full h-full" />
                        ) : (
                            <Dumbbell size={24} color={colors.primary} />
                        )}
                    </View>

                    {/* Info */}
                    <View className="flex-1">
                        <Text className="text-foreground font-semibold text-base">
                            {exercise.exerciseName}
                        </Text>
                        <Text className="text-muted-foreground text-xs">
                            {t(`exercises.muscleGroups.${exercise.muscleGroup}`)}
                        </Text>
                    </View>

                    {/* Menu Button */}
                    {isEditing && (
                        <Pressable onPress={showExerciseMenu} className="p-1">
                            <Trash2 size={18} color={colors.destructive} />
                        </Pressable>
                    )}
                </View>
            </Pressable>

            {/* Sets List */}
            <View className="p-4">
                {exercise.sets.map((set, setIndex) => (
                    <WorkoutSetRow
                        key={set.id}
                        set={set}
                        setIndex={setIndex}
                        onUpdate={(data) => onUpdateSet(set.id, data)}
                        onDelete={() => onDeleteSet(set.id)}
                        isDark={isDark}
                        isEditing={isEditing}
                    />
                ))}

                {/* Add Set Button */}
                {isEditing && (
                    <Pressable
                        onPress={onAddSet}
                        className="flex-row items-center justify-center gap-2 mt-2 py-2 rounded-lg border border-dashed border-border"
                    >
                        <Plus size={18} color={colors.primary} />
                        <Text className="text-primary font-medium">{t('workouts.addSet')}</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};