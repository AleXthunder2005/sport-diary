import { Dumbbell, Heart, Activity, ChevronUp, Armchair, Bike, Sparkles, Target, Dumbbell as Biceps, Accessibility } from 'lucide-react-native';

export const muscleGroups = [
    { id: 'chest', label: 'Грудь', icon: Dumbbell, labelKey: 'exercises.muscleGroups.chest' },
    { id: 'back', label: 'Спина', icon: Armchair, labelKey: 'exercises.muscleGroups.back' },
    { id: 'legs', label: 'Ноги', icon: Bike, labelKey: 'exercises.muscleGroups.legs' },
    { id: 'shoulders', label: 'Плечи', icon: ChevronUp, labelKey: 'exercises.muscleGroups.shoulders' },
    { id: 'arms', label: 'Руки', icon: Biceps, labelKey: 'exercises.muscleGroups.arms' },
    { id: 'core', label: 'Кор', icon: Target, labelKey: 'exercises.muscleGroups.core' },
    { id: 'cardio', label: 'Кардио', icon: Heart, labelKey: 'exercises.muscleGroups.cardio' },
    { id: 'stretching', label: 'Растяжка', icon: Accessibility, labelKey: 'exercises.muscleGroups.stretching' },
];

export const exerciseTypes = [
    { id: 'strength', label: 'Силовое', icon: Dumbbell, labelKey: 'exercises.types.strength' },
    { id: 'cardio', label: 'Кардио', icon: Heart, labelKey: 'exercises.types.cardio' },
    { id: 'stretching', label: 'Растяжка', icon: Activity, labelKey: 'exercises.types.stretching' },
];

export const chartPeriods = [
    { id: '30d', label: '30 дней', labelKey: 'exercises.chart.30days' },
    { id: '3m', label: '3 месяца', labelKey: 'exercises.chart.3months' },
    { id: '1y', label: 'Год', labelKey: 'exercises.chart.1year' },
    { id: 'all', label: 'Всё время', labelKey: 'exercises.chart.allTime' },
];

export const filterMuscleGroups = [
    { id: 'all', label: 'Все', labelKey: 'exercises.filters.all' },
    ...muscleGroups,
];

export const getMuscleGroupById = (id: string) => {
    return muscleGroups.find(group => group.id === id) || muscleGroups[0];
};

export const getExerciseTypeById = (id: string) => {
    return exerciseTypes.find(type => type.id === id) || exerciseTypes[0];
};