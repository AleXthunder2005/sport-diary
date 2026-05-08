import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
    TextInput,
    Modal
} from 'react-native';
import { useAppTheme } from '@/app/theme/theme';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Check, Clock, Edit2, Plus, X } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { workoutService } from '@/app/services/workout/workoutService';
import { WorkoutExerciseBlock } from '@/app/components/workout/WorkoutExerciseBlock';
import { ExerciseSelector } from '@/app/components/workout/ExerciseSelector';

export default function WorkoutActive({ navigation, route }) {
    const { colorScheme } = useAppTheme();
    const { t } = useTranslation();
    const isDark = colorScheme === 'dark';
    const { workoutId } = route.params || {};

    const [workout, setWorkout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [duration, setDuration] = useState(0);
    const [showExerciseSelector, setShowExerciseSelector] = useState(false);
    const [showNameEdit, setShowNameEdit] = useState(false);
    const [editName, setEditName] = useState('');

    const timerRef = useRef(null);

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
        startTimer();

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const loadWorkout = async () => {
        setLoading(true);
        const activeWorkout = await workoutService.getActiveWorkout();
        if (activeWorkout) {
            setWorkout(activeWorkout);
            setEditName(activeWorkout.name);
            const elapsed = Math.floor((new Date().getTime() - new Date(activeWorkout.startTime).getTime()) / 1000);
            setDuration(elapsed);
        } else {
            Alert.alert(t('workouts.error'), t('workouts.noActiveWorkout'), [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        }
        setLoading(false);
    };

    const startTimer = () => {
        timerRef.current = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddExercise = async (exercise) => {
        if (workout.exercises.some(e => e.exerciseId === exercise.id)) {
            Alert.alert(t('workouts.error'), t('workouts.exerciseAlreadyAdded'));
            return;
        }

        const updatedWorkout = await workoutService.addExerciseToWorkout(workout.id, exercise);
        setWorkout(updatedWorkout);
        setShowExerciseSelector(false);
    };

    const handleAddSet = async (exerciseId) => {
        const updatedWorkout = await workoutService.addSetToExercise(workout.id, exerciseId);
        setWorkout(updatedWorkout);
    };

    const handleUpdateSet = async (exerciseId, setId, data) => {
        const updatedWorkout = await workoutService.updateSet(workout.id, exerciseId, setId, data);
        setWorkout(updatedWorkout);
    };

    const handleDeleteSet = async (exerciseId, setId) => {
        const updatedWorkout = await workoutService.deleteSet(workout.id, exerciseId, setId);
        setWorkout(updatedWorkout);
    };

    const handleDeleteExercise = async (exerciseId) => {
        Alert.alert(
            t('workouts.deleteExercise'),
            t('workouts.confirmDeleteExercise'),
            [
                { text: t('workouts.cancel'), style: 'cancel' },
                {
                    text: t('workouts.delete'),
                    style: 'destructive',
                    onPress: async () => {
                        const updatedWorkout = await workoutService.deleteExercise(workout.id, exerciseId);
                        setWorkout(updatedWorkout);
                    }
                }
            ]
        );
    };

    const handleMoveExercise = async (exerciseId, direction) => {
        const updatedWorkout = await workoutService.moveExercise(workout.id, exerciseId, direction);
        setWorkout(updatedWorkout);
    };

    const handleUpdateName = async () => {
        if (editName.trim()) {
            const updatedWorkout = await workoutService.updateWorkoutName(workout.id, editName);
            setWorkout(updatedWorkout);
        }
        setShowNameEdit(false);
    };

    const handleFinishWorkout = async () => {
        const hasIncomplete = workoutService.hasIncompleteSets(workout);

        if (hasIncomplete) {
            Alert.alert(
                t('workouts.incompleteSets'),
                t('workouts.incompleteSetsMessage'),
                [
                    { text: t('workouts.cancel'), style: 'cancel' },
                    {
                        text: t('workouts.deleteEmptySets'),
                        onPress: async () => {
                            const cleanedWorkout = workoutService.removeIncompleteSets(workout);
                            const finishedWorkout = await workoutService.finishWorkout(workout.id);
                            if (timerRef.current) clearInterval(timerRef.current);
                            navigation.replace('WorkoutSummary', { workoutId: finishedWorkout.id });
                        }
                    }
                ]
            );
        } else {
            const finishedWorkout = await workoutService.finishWorkout(workout.id);
            if (timerRef.current) clearInterval(timerRef.current);
            navigation.replace('WorkoutSummary', { workoutId: finishedWorkout.id });
        }
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

                <View className="flex-1 items-center">
                    <Pressable onPress={() => setShowNameEdit(true)} className="flex-row items-center gap-2">
                        <Text className="text-foreground text-lg font-semibold">{workout.name}</Text>
                        <Edit2 size={16} color={colors.mutedForeground} />
                    </Pressable>
                    <View className="flex-row items-center gap-2 mt-1">
                        <Clock size={14} color={colors.mutedForeground} />
                        <Text className="text-muted-foreground text-sm">{formatDuration(duration)}</Text>
                    </View>
                </View>

                <Pressable onPress={handleFinishWorkout} className="bg-primary px-4 py-2 rounded-full">
                    <Text className="text-primary-foreground font-semibold">{t('workouts.finish')}</Text>
                </Pressable>
            </View>

            {/* Exercises List */}
            <ScrollView className="flex-1 p-4">
                {workout.exercises.map((exercise, index) => (
                    <WorkoutExerciseBlock
                        key={exercise.id}
                        exercise={exercise}
                        exerciseIndex={index}
                        onAddSet={() => handleAddSet(exercise.id)}
                        onUpdateSet={(setId, data) => handleUpdateSet(exercise.id, setId, data)}
                        onDeleteSet={(setId) => handleDeleteSet(exercise.id, setId)}
                        onDeleteExercise={() => handleDeleteExercise(exercise.id)}
                        onMoveExercise={(direction) => handleMoveExercise(exercise.id, direction)}
                        isDark={isDark}
                        isEditing={true}
                    />
                ))}

                {/* Add Exercise Button */}
                <Pressable
                    onPress={() => setShowExerciseSelector(true)}
                    className="flex-row items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-border mt-2"
                >
                    <Plus size={20} color={colors.primary} />
                    <Text className="text-primary font-semibold">{t('workouts.addExercise')}</Text>
                </Pressable>
            </ScrollView>

            {/* Name Edit Modal */}
            <Modal visible={showNameEdit} transparent animationType="fade">
                <View className="flex-1 bg-black/50 justify-center items-center">
                    <View className="bg-card rounded-2xl p-6 w-80" style={{ backgroundColor: colors.card }}>
                        <Text className="text-foreground text-lg font-semibold mb-4">
                            {t('workouts.editName')}
                        </Text>
                        <TextInput
                            className="bg-input-background rounded-xl p-3 text-foreground border border-border mb-4"
                            value={editName}
                            onChangeText={setEditName}
                            placeholder={t('workouts.enterName')}
                            placeholderTextColor={colors.border}
                            autoFocus
                        />
                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={() => setShowNameEdit(false)}
                                className="flex-1 py-3 rounded-xl border border-border"
                            >
                                <Text className="text-foreground text-center">{t('workouts.cancel')}</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleUpdateName}
                                className="flex-1 bg-primary py-3 rounded-xl"
                            >
                                <Text className="text-primary-foreground text-center font-semibold">
                                    {t('workouts.save')}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Exercise Selector */}
            <ExerciseSelector
                visible={showExerciseSelector}
                onClose={() => setShowExerciseSelector(false)}
                onSelectExercise={handleAddExercise}
                isDark={isDark}
            />
        </View>
    );
}