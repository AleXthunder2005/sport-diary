// app/screens/excersise/ExercisesHome.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useAppTheme } from '@/app/theme/theme';
import { useTranslation } from 'react-i18next';
import { ExerciseCard, FilterBar } from '@/app/components/excersise';
import { getColor } from '@/app/colors/colors';
import { exercisesApi } from '@/app/services/exercises/exerciseService';

export default function ExercisesHome({ navigation }) {
    const { colorScheme } = useAppTheme();
    const { t } = useTranslation();
    const isDark = colorScheme === 'dark';

    const [exercises, setExercises] = useState([]);
    const [filteredExercises, setFilteredExercises] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMuscle, setSelectedMuscle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExercises();
    }, []);

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

        if (selectedMuscle) {
            filtered = filtered.filter(ex => ex.muscleGroup === selectedMuscle);
        }

        setFilteredExercises(filtered);
    };

    const handleExercisePress = (exercise) => {
        navigation.navigate('ExerciseDetail', { id: exercise.id });
    };

    const handleCreatePress = () => {
        navigation.navigate('ExerciseForm');
    };

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
    };

    return (
        <View className="flex-1 bg-background">
            <ScrollView className="flex-1 px-4 pt-4">
                {/* Filters with Create Button */}
                <FilterBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    selectedMuscle={selectedMuscle}
                    onMuscleChange={setSelectedMuscle}
                    isDark={isDark}
                    onCreatePress={handleCreatePress}
                />

                {/* Exercises List */}
                {loading ? (
                    <View className="py-20">
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : filteredExercises.length > 0 ? (
                    filteredExercises.map((exercise) => (
                        <ExerciseCard
                            key={exercise.id}
                            exercise={exercise}
                            onPress={handleExercisePress}
                            isDark={isDark}
                        />
                    ))
                ) : (
                    <View className="py-20 items-center">
                        <Text className="text-muted-foreground text-center">
                            {t('exercises.notFound')}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}