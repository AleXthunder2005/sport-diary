import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useAppTheme } from '@/app/theme/theme';
import { useTranslation } from 'react-i18next';
import {ArrowLeft, Edit2, Save, X, Trash2, Clock, Dumbbell, TrendingUp, Calendar} from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { workoutService } from '@/app/services/workout/workoutService';
import { WorkoutExerciseBlock } from '@/app/components/workout/WorkoutExerciseBlock';

export default function WorkoutDetail({ navigation, route }) {
    const { colorScheme } = useAppTheme();
    const { t } = useTranslation();
    const isDark = colorScheme === 'dark';
    const { workoutId } = route.params;

    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
        destructive: getColor(isDark ? 'dark' : 'light', 'destructive'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        background: getColor(isDark ? 'dark' : 'light', 'background'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
        success: getColor(isDark ? 'dark' : 'light', 'success'),
    };

    useEffect(() => {
        loadWorkout();
    }, []);

    const loadWorkout = async () => {
        setLoading(true);
        const data = await workoutService.getWorkoutById(workoutId);
        setWorkout(data);
        setLoading(false);
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 0) return `${hours}${t('units.hoursShort')} ${minutes}${t('units.minutesShort')}`;
        return `${minutes}${t('units.minutesShort')}`;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString(t('locale'), { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handleUpdateSet = async (exerciseId, setId, data) => {
        const updatedExercises = workout.exercises.map(ex => {
            if (ex.id === exerciseId) {
                return {
                    ...ex,
                    sets: ex.sets.map(set => {
                        if (set.id === setId) {
                            return { ...set, ...data };
                        }
                        return set;
                    })
                };
            }
            return ex;
        });

        const updatedWorkout = { ...workout, exercises: updatedExercises };
        await workoutService.updateWorkout(workoutId, updatedWorkout);
        setWorkout(updatedWorkout);
    };

    const handleDeleteSet = async (exerciseId, setId) => {
        const updatedExercises = workout.exercises.map(ex => {
            if (ex.id === exerciseId) {
                return {
                    ...ex,
                    sets: ex.sets.filter(set => set.id !== setId)
                };
            }
            return ex;
        });

        const updatedWorkout = { ...workout, exercises: updatedExercises };
        await workoutService.updateWorkout(workoutId, updatedWorkout);
        setWorkout(updatedWorkout);
    };

    const handleDeleteWorkout = () => {
        Alert.alert(
            t('workouts.deleteWorkout'),
            t('workouts.confirmDelete'),
            [
                { text: t('workouts.cancel'), style: 'cancel' },
                {
                    text: t('workouts.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        await workoutService.deleteWorkout(workoutId);
                        navigation.goBack();
                    }
                }
            ]
        );
    };

    if (loading || !workout) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background">
            {/* Header */}
            <View className="flex-row justify-between items-center p-4 border-b border-border">
                <Pressable onPress={() => navigation.goBack()} className="p-1">
                    <ArrowLeft size={24} color={colors.primary} />
                </Pressable>
                <Text className="text-foreground text-lg font-semibold flex-1 text-center" numberOfLines={1}>
                    {workout.name}
                </Text>
                <View className="flex-row gap-2">
                    <Pressable onPress={() => setIsEditing(!isEditing)} className="p-2">
                        {isEditing ? <Save size={20} color={colors.success} /> : <Edit2 size={20} color={colors.primary} />}
                    </Pressable>
                    <Pressable onPress={handleDeleteWorkout} className="p-2">
                        <Trash2 size={20} color={colors.destructive} />
                    </Pressable>
                </View>
            </View>

            {/* Info */}
            <View className="flex-row gap-4 p-4 border-b border-border">
                <View className="flex-row items-center gap-2">
                    <Calendar size={16} color={colors.mutedForeground} />
                    <Text className="text-muted-foreground text-sm">{formatDate(workout.startTime)}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                    <Clock size={16} color={colors.mutedForeground} />
                    <Text className="text-muted-foreground text-sm">{formatDuration(workout.duration)}</Text>
                </View>
            </View>

            {/* Stats Summary */}
            <View className="flex-row gap-3 p-4 border-b border-border">
                <View className="flex-1 bg-card rounded-xl p-3 border border-border/50 items-center">
                    <Dumbbell size={20} color={colors.primary} />
                    <Text className="text-foreground font-bold mt-1">{workout.totalExercises || 0}</Text>
                    <Text className="text-muted-foreground text-xs">{t('workouts.exercises')}</Text>
                </View>
                <View className="flex-1 bg-card rounded-xl p-3 border border-border/50 items-center">
                    <TrendingUp size={20} color={colors.primary} />
                    <Text className="text-foreground font-bold mt-1">{workout.totalSets || 0}</Text>
                    <Text className="text-muted-foreground text-xs">{t('workouts.sets')}</Text>
                </View>
                <View className="flex-1 bg-card rounded-xl p-3 border border-border/50 items-center">
                    <TrendingUp size={20} color={colors.primary} />
                    <Text className="text-foreground font-bold mt-1">{workout.totalVolume || 0}</Text>
                    <Text className="text-muted-foreground text-xs">{t('workouts.volume')} ({t('units.kg')})</Text>
                </View>
            </View>

            {/* Exercises List */}
            <ScrollView className="flex-1 p-4">
                {workout.exercises.map((exercise, index) => (
                    <WorkoutExerciseBlock
                        key={exercise.id}
                        exercise={exercise}
                        exerciseIndex={index}
                        onAddSet={() => {}}
                        onUpdateSet={(setId, data) => handleUpdateSet(exercise.id, setId, data)}
                        onDeleteSet={(setId) => handleDeleteSet(exercise.id, setId)}
                        onDeleteExercise={() => {}}
                        onMoveExercise={() => {}}
                        isDark={isDark}
                        isEditing={isEditing}
                    />
                ))}
            </ScrollView>
        </View>
    );
}