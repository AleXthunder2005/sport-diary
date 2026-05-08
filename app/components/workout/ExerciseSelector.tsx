import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Pressable, Image, Modal, ActivityIndicator } from 'react-native';
import { Search, X, Dumbbell, TrendingUp } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { useTranslation } from 'react-i18next';
import { exercisesApi } from '@/app/services/exercises/exerciseService';
import { getMuscleGroupById } from '@/app/entities/exercisesMetadata';

export const ExerciseSelector = ({ visible, onClose, onSelectExercise, isDark }) => {
    const { t } = useTranslation();
    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showWeightHistory, setShowWeightHistory] = useState(false);
    const [selectedExerciseForHistory, setSelectedExerciseForHistory] = useState(null);

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        background: getColor(isDark ? 'dark' : 'light', 'background'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
    };

    const muscleGroups = [
        { id: 'all', label: t('exercises.filters.all') },
        { id: 'chest', label: t('exercises.muscleGroups.chest') },
        { id: 'back', label: t('exercises.muscleGroups.back') },
        { id: 'legs', label: t('exercises.muscleGroups.legs') },
        { id: 'shoulders', label: t('exercises.muscleGroups.shoulders') },
        { id: 'arms', label: t('exercises.muscleGroups.arms') },
        { id: 'core', label: t('exercises.muscleGroups.core') },
        { id: 'cardio', label: t('exercises.muscleGroups.cardio') },
        { id: 'stretching', label: t('exercises.muscleGroups.stretching') },
    ];

    useEffect(() => {
        if (visible) {
            loadExercises();
        }
    }, [visible]);

    useEffect(() => {
        filterExercises();
    }, [searchQuery, selectedMuscle, exercises]);

    const loadExercises = async () => {
        setLoading(true);
        const data = await exercisesApi.getExercises();
        setExercises(data);
        setLoading(false);
    };

    const filterExercises = () => {
        let filtered = [...exercises];

        if (searchQuery) {
            filtered = filtered.filter(ex =>
                ex.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedMuscle && selectedMuscle !== 'all') {
            filtered = filtered.filter(ex => ex.muscleGroup === selectedMuscle);
        }

        setFilteredExercises(filtered);
    };

    const handleExercisePress = (exercise) => {
        onSelectExercise(exercise);
        onClose();
    };

    const handleWeightHistory = (exercise) => {
        setSelectedExerciseForHistory(exercise);
        setShowWeightHistory(true);
    };

    return (
        <>
            <Modal
                visible={visible}
                animationType="slide"
                presentationStyle="fullScreen"
            >
                <View className="flex-1" style={{ backgroundColor: colors.background }}>
                    {/* Header */}
                    <View className="flex-row justify-between items-center p-4 border-b border-border">
                        <Text className="text-foreground text-xl font-bold">
                            {t('workouts.selectExercise')}
                        </Text>
                        <Pressable onPress={onClose} className="p-2">
                            <X size={24} color={colors.primary} />
                        </Pressable>
                    </View>

                    {/* Search Bar */}
                    <View className="p-4">
                        <View className="flex-row items-center bg-input-background rounded-xl border border-border px-3">
                            <Search size={20} color={colors.primary} />
                            <TextInput
                                className="flex-1 py-3 px-2 text-foreground"
                                placeholder={t('workouts.searchExercises')}
                                placeholderTextColor={colors.border}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                            {searchQuery.length > 0 && (
                                <Pressable onPress={() => setSearchQuery('')}>
                                    <X size={18} color={colors.border} />
                                </Pressable>
                            )}
                        </View>
                    </View>

                    {/* Muscle Groups Filter - Fixed height */}
                    <View className="mb-4">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="px-4"
                            contentContainerStyle={{ paddingRight: 16 }}
                        >
                            <View className="flex-row gap-2">
                                {muscleGroups.map((group) => (
                                    <Pressable
                                        key={group.id}
                                        onPress={() => setSelectedMuscle(group.id === 'all' ? null : group.id)}
                                        className={`px-4 py-2 rounded-full ${
                                            (selectedMuscle === group.id || (group.id === 'all' && !selectedMuscle))
                                                ? 'bg-primary'
                                                : 'bg-input-background border border-border'
                                        }`}
                                    >
                                        <Text className={selectedMuscle === group.id || (group.id === 'all' && !selectedMuscle)
                                            ? 'text-primary-foreground'
                                            : 'text-foreground'
                                        }>
                                            {group.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Exercises List */}
                    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                        {loading ? (
                            <View className="py-20">
                                <ActivityIndicator size="large" color={colors.primary} />
                            </View>
                        ) : filteredExercises.length > 0 ? (
                            filteredExercises.map((exercise) => {
                                const muscleGroup = getMuscleGroupById(exercise.muscleGroup);
                                return (
                                    <Pressable
                                        key={exercise.id}
                                        onPress={() => handleExercisePress(exercise)}
                                        className="bg-card rounded-xl mb-3 p-4 border border-border/50"
                                    >
                                        <View className="flex-row items-center">
                                            {/* Photo */}
                                            <View className="w-14 h-14 rounded-lg bg-primary/10 mr-3 overflow-hidden justify-center items-center">
                                                {exercise.photo ? (
                                                    <Image source={{ uri: exercise.photo }} className="w-full h-full" />
                                                ) : (
                                                    <Dumbbell size={28} color={colors.primary} />
                                                )}
                                            </View>

                                            {/* Info */}
                                            <View className="flex-1">
                                                <Text className="text-foreground font-semibold text-base">
                                                    {exercise.name}
                                                </Text>
                                                <Text className="text-muted-foreground text-xs mt-0.5">
                                                    {t(muscleGroup.labelKey)}
                                                </Text>
                                            </View>

                                            {/* Weight History Button - Fixed size */}
                                            <Pressable
                                                onPress={() => handleWeightHistory(exercise)}
                                                className="bg-primary/10 px-3 py-2 rounded-full"
                                                style={{ maxWidth: 70 }}
                                            >
                                                <Text className="text-primary text-xs font-medium text-center">
                                                    {t('workouts.weightHistory')}
                                                </Text>
                                            </Pressable>
                                        </View>
                                    </Pressable>
                                );
                            })
                        ) : (
                            <View className="py-20 items-center">
                                <Text className="text-muted-foreground text-center mb-4">
                                    {t('workouts.noExercises')}
                                </Text>
                                <Pressable
                                    onPress={() => {
                                        onClose();
                                        // Navigate to create exercise
                                    }}
                                    className="bg-primary px-6 py-3 rounded-full"
                                >
                                    <Text className="text-primary-foreground font-semibold">
                                        {t('workouts.createNewExercise')}
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Modal>

            {/* Weight History Modal */}
            <Modal
                visible={showWeightHistory}
                animationType="slide"
                transparent
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-card rounded-t-3xl h-2/3" style={{ backgroundColor: colors.card }}>
                        <View className="flex-row justify-between items-center p-4 border-b border-border">
                            <Text className="text-foreground text-lg font-semibold flex-1" numberOfLines={1}>
                                {selectedExerciseForHistory?.name} - {t('workouts.weightHistory')}
                            </Text>
                            <Pressable onPress={() => setShowWeightHistory(false)} className="p-2 ml-2">
                                <X size={24} color={colors.primary} />
                            </Pressable>
                        </View>
                        <ScrollView className="p-4">
                            <Text className="text-muted-foreground text-center">
                                История последних подходов будет здесь
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};