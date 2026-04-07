// processes/exercises/exercisesProcesses.ts
import { Exercise, ExerciseStats, ExerciseHistory } from '@/app/entities/exercises.types';

// Mock data for exercises list
const mockExercisesList: Exercise[] = [
    {
        id: '1',
        name: 'Жим лежа',
        muscleGroup: 'chest',
        type: 'strength',
        description: 'Базовое упражнение для развития грудных мышц',
        photo: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '2',
        name: 'Приседания со штангой',
        muscleGroup: 'legs',
        type: 'strength',
        description: 'Базовое упражнение для ног',
        photo: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '3',
        name: 'Тяга штанги в наклоне',
        muscleGroup: 'back',
        type: 'strength',
        description: 'Упражнение для развития широчайших мышц спины',
        photo: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: '4',
        name: 'Бег на беговой дорожке',
        muscleGroup: 'cardio',
        type: 'cardio',
        description: 'Кардио нагрузка для выносливости',
        photo: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];

// Mock data for single exercise
const mockExerciseDetail: Exercise = {
    id: '1',
    name: 'Жим лежа',
    muscleGroup: 'chest',
    type: 'strength',
    description: 'Базовое упражнение для развития грудных мышц. Лягте на скамью, возьмитесь за гриф шире плеч, опустите штангу к груди и выжмите вверх.',
    tips: 'Держите лопатки сведенными, не отрывайте таз от скамьи.',
    photo: null,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
};

// Mock data for stats
const mockStatsData: ExerciseStats = {
    exerciseId: '1',
    bestWeight: 120,
    bestOneRM: 135,
    totalVolume: 12500,
    totalSets: 48,
    lastPerformed: new Date('2024-11-29'),
    frequency: 2,
};

// Mock data for chart
const mockChartData: Record<string, { date: string; weight: number }[]> = {
    '30d': [
        { date: '01.11', weight: 100 },
        { date: '08.11', weight: 105 },
        { date: '15.11', weight: 110 },
        { date: '22.11', weight: 115 },
        { date: '29.11', weight: 120 },
    ],
    '3m': [
        { date: '01.09', weight: 85 },
        { date: '15.09', weight: 90 },
        { date: '01.10', weight: 95 },
        { date: '15.10', weight: 100 },
        { date: '01.11', weight: 105 },
        { date: '15.11', weight: 110 },
        { date: '29.11', weight: 120 },
    ],
    '1y': [
        { date: '01.01', weight: 70 },
        { date: '01.03', weight: 80 },
        { date: '01.06', weight: 90 },
        { date: '01.09', weight: 100 },
        { date: '01.11', weight: 120 },
    ],
    'all': [
        { date: '01.01', weight: 70 },
        { date: '01.03', weight: 80 },
        { date: '01.06', weight: 90 },
        { date: '01.09', weight: 100 },
        { date: '01.11', weight: 120 },
    ],
};

// Mock data for history
const mockHistoryData: Record<string, ExerciseHistory[]> = {
    '30d': [
        {
            id: '1',
            exerciseId: '1',
            workoutId: 'w1',
            workoutDate: new Date('2024-11-29'),
            sets: [
                { id: 's1', weight: 100, reps: 8 },
                { id: 's2', weight: 110, reps: 6 },
                { id: 's3', weight: 120, reps: 4 },
            ],
            maxWeight: 120,
            oneRM: 135,
        },
        {
            id: '2',
            exerciseId: '1',
            workoutId: 'w2',
            workoutDate: new Date('2024-11-22'),
            sets: [
                { id: 's1', weight: 90, reps: 10 },
                { id: 's2', weight: 100, reps: 8 },
                { id: 's3', weight: 110, reps: 6 },
            ],
            maxWeight: 110,
            oneRM: 125,
        },
        {
            id: '3',
            exerciseId: '1',
            workoutId: 'w3',
            workoutDate: new Date('2024-11-15'),
            sets: [
                { id: 's1', weight: 80, reps: 10 },
                { id: 's2', weight: 90, reps: 8 },
                { id: 's3', weight: 100, reps: 6 },
            ],
            maxWeight: 100,
            oneRM: 115,
        },
    ],
    '3m': [
        {
            id: '1',
            exerciseId: '1',
            workoutId: 'w1',
            workoutDate: new Date('2024-11-29'),
            sets: [
                { id: 's1', weight: 100, reps: 8 },
                { id: 's2', weight: 110, reps: 6 },
                { id: 's3', weight: 120, reps: 4 },
            ],
            maxWeight: 120,
            oneRM: 135,
        },
        {
            id: '2',
            exerciseId: '1',
            workoutId: 'w2',
            workoutDate: new Date('2024-10-22'),
            sets: [
                { id: 's1', weight: 90, reps: 10 },
                { id: 's2', weight: 100, reps: 8 },
                { id: 's3', weight: 110, reps: 6 },
            ],
            maxWeight: 110,
            oneRM: 125,
        },
        {
            id: '3',
            exerciseId: '1',
            workoutId: 'w3',
            workoutDate: new Date('2024-09-15'),
            sets: [
                { id: 's1', weight: 80, reps: 10 },
                { id: 's2', weight: 85, reps: 8 },
                { id: 's3', weight: 90, reps: 6 },
            ],
            maxWeight: 90,
            oneRM: 105,
        },
    ],
    '1y': [
        {
            id: '1',
            exerciseId: '1',
            workoutId: 'w1',
            workoutDate: new Date('2024-11-29'),
            sets: [
                { id: 's1', weight: 100, reps: 8 },
                { id: 's2', weight: 110, reps: 6 },
                { id: 's3', weight: 120, reps: 4 },
            ],
            maxWeight: 120,
            oneRM: 135,
        },
        {
            id: '2',
            exerciseId: '1',
            workoutId: 'w2',
            workoutDate: new Date('2024-08-22'),
            sets: [
                { id: 's1', weight: 90, reps: 10 },
                { id: 's2', weight: 100, reps: 8 },
                { id: 's3', weight: 110, reps: 6 },
            ],
            maxWeight: 110,
            oneRM: 125,
        },
        {
            id: '3',
            exerciseId: '1',
            workoutId: 'w3',
            workoutDate: new Date('2024-05-15'),
            sets: [
                { id: 's1', weight: 80, reps: 10 },
                { id: 's2', weight: 85, reps: 8 },
                { id: 's3', weight: 90, reps: 6 },
            ],
            maxWeight: 90,
            oneRM: 105,
        },
    ],
    'all': [
        {
            id: '1',
            exerciseId: '1',
            workoutId: 'w1',
            workoutDate: new Date('2024-11-29'),
            sets: [
                { id: 's1', weight: 100, reps: 8 },
                { id: 's2', weight: 110, reps: 6 },
                { id: 's3', weight: 120, reps: 4 },
            ],
            maxWeight: 120,
            oneRM: 135,
        },
        {
            id: '2',
            exerciseId: '1',
            workoutId: 'w2',
            workoutDate: new Date('2024-08-22'),
            sets: [
                { id: 's1', weight: 90, reps: 10 },
                { id: 's2', weight: 100, reps: 8 },
                { id: 's3', weight: 110, reps: 6 },
            ],
            maxWeight: 110,
            oneRM: 125,
        },
        {
            id: '3',
            exerciseId: '1',
            workoutId: 'w3',
            workoutDate: new Date('2024-05-15'),
            sets: [
                { id: 's1', weight: 80, reps: 10 },
                { id: 's2', weight: 85, reps: 8 },
                { id: 's3', weight: 90, reps: 6 },
            ],
            maxWeight: 90,
            oneRM: 105,
        },
    ],
};

// Mock form data for editing
const mockFormData = {
    name: 'Жим лежа',
    muscleGroup: 'chest',
    type: 'strength',
    photo: null,
    description: 'Базовое упражнение для развития грудных мышц',
    tips: 'Держите лопатки сведенными',
};

// Delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const exercisesApi = {
    // Get all exercises
    getExercises: async (): Promise<Exercise[]> => {
        await delay(500);
        return [...mockExercisesList];
    },

    // Get exercise by id
    getExerciseById: async (id: string): Promise<Exercise | null> => {
        await delay(500);
        if (id === '1') {
            return { ...mockExerciseDetail, id };
        }

        const exercise = mockExercisesList.find(ex => ex.id === id);
        return exercise ? { ...exercise } : null;
    },

    // Get exercise stats
    getExerciseStats: async (exerciseId: string): Promise<ExerciseStats | null> => {
        await delay(300);
        if (exerciseId === '1') {
            return { ...mockStatsData, exerciseId };
        }
        return null;
    },

    // Get exercise chart data by period
    getExerciseChartData: async (exerciseId: string, period: string): Promise<{ date: string; weight: number }[]> => {
        await delay(300);
        return [...(mockChartData[period] || mockChartData['30d'])];
    },

    // Get exercise history by period
    getExerciseHistory: async (exerciseId: string, period: string): Promise<ExerciseHistory[]> => {
        await delay(300);
        return [...(mockHistoryData[period] || mockHistoryData['30d'])];
    },

    // Create new exercise
    createExercise: async (data: any): Promise<Exercise> => {
        await delay(500);
        const newExercise: Exercise = {
            id: Date.now().toString(),
            ...data,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return newExercise;
    },

    // Update exercise
    updateExercise: async (id: string, data: any): Promise<Exercise> => {
        await delay(500);
        return {
            id,
            ...data,
            updatedAt: new Date(),
        } as Exercise;
    },

    // Get exercise form data for editing
    getExerciseFormData: async (id: string): Promise<any> => {
        await delay(500);
        return { ...mockFormData };
    },
};