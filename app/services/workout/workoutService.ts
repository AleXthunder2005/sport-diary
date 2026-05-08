// services/workout/workoutService.ts
import { Workout, WorkoutExercise, WorkoutSet, WorkoutSummary, WorkoutStats } from '@/app/entities/workout';

// Mock data for workouts history
const mockWorkouts: Workout[] = [
    {
        id: '1',
        name: 'Тренировка 08.04',
        startTime: new Date('2024-04-08T18:00:00'),
        endTime: new Date('2024-04-08T19:30:00'),
        duration: 5400,
        exercises: [
            {
                id: 'we1',
                exerciseId: '1',
                exerciseName: 'Жим лежа',
                muscleGroup: 'chest',
                sets: [
                    { id: 's1', exerciseId: '1', weight: 80, reps: 10, completed: true, order: 0 },
                    { id: 's2', exerciseId: '1', weight: 90, reps: 8, completed: true, order: 1 },
                    { id: 's3', exerciseId: '1', weight: 100, reps: 6, completed: true, order: 2 },
                ],
                order: 0,
            },
            {
                id: 'we2',
                exerciseId: '2',
                exerciseName: 'Приседания',
                muscleGroup: 'legs',
                sets: [
                    { id: 's4', exerciseId: '2', weight: 100, reps: 10, completed: true, order: 0 },
                    { id: 's5', exerciseId: '2', weight: 110, reps: 8, completed: true, order: 1 },
                    { id: 's6', exerciseId: '2', weight: 120, reps: 6, completed: true, order: 2 },
                ],
                order: 1,
            },
        ],
        isActive: false,
        totalVolume: 9900,
        totalSets: 6,
        totalExercises: 2,
        createdAt: new Date('2024-04-08'),
        updatedAt: new Date('2024-04-08'),
    },
    {
        id: '2',
        name: 'Тренировка 05.04',
        startTime: new Date('2024-04-05T17:30:00'),
        endTime: new Date('2024-04-05T18:45:00'),
        duration: 4500,
        exercises: [
            {
                id: 'we3',
                exerciseId: '1',
                exerciseName: 'Жим лежа',
                muscleGroup: 'chest',
                sets: [
                    { id: 's7', exerciseId: '1', weight: 70, reps: 12, completed: true, order: 0 },
                    { id: 's8', exerciseId: '1', weight: 80, reps: 10, completed: true, order: 1 },
                    { id: 's9', exerciseId: '1', weight: 90, reps: 8, completed: true, order: 2 },
                ],
                order: 0,
            },
        ],
        isActive: false,
        totalVolume: 2940,
        totalSets: 3,
        totalExercises: 1,
        createdAt: new Date('2024-04-05'),
        updatedAt: new Date('2024-04-05'),
    },
];

let activeWorkout: Workout | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const workoutService = {
    // Get active workout
    getActiveWorkout: async (): Promise<Workout | null> => {
        await delay(300);
        return activeWorkout;
    },

    // Start new workout
    startWorkout: async (name?: string): Promise<Workout> => {
        await delay(500);
        const now = new Date();
        activeWorkout = {
            id: Date.now().toString(),
            name: name || `Тренировка ${now.toLocaleDateString('ru-RU')}`,
            startTime: now,
            exercises: [],
            isActive: true,
            createdAt: now,
            updatedAt: now,
        };
        return activeWorkout;
    },

    // Add exercise to workout
    addExerciseToWorkout: async (workoutId: string, exercise: any): Promise<Workout> => {
        await delay(300);
        if (activeWorkout && activeWorkout.id === workoutId) {
            const newExercise: WorkoutExercise = {
                id: Date.now().toString(),
                exerciseId: exercise.id,
                exerciseName: exercise.name,
                muscleGroup: exercise.muscleGroup,
                exercisePhoto: exercise.photo,
                sets: [],
                order: activeWorkout.exercises.length,
            };
            activeWorkout.exercises.push(newExercise);
            activeWorkout.updatedAt = new Date();
        }
        return activeWorkout!;
    },

    // Add set to exercise
    addSetToExercise: async (workoutId: string, exerciseId: string): Promise<Workout> => {
        await delay(200);
        if (activeWorkout && activeWorkout.id === workoutId) {
            const exercise = activeWorkout.exercises.find(e => e.id === exerciseId);
            if (exercise) {
                const newSet: WorkoutSet = {
                    id: Date.now().toString(),
                    exerciseId: exercise.exerciseId,
                    weight: null,
                    reps: null,
                    completed: false,
                    order: exercise.sets.length,
                };
                exercise.sets.push(newSet);
                activeWorkout.updatedAt = new Date();
            }
        }
        return activeWorkout!;
    },

    // Update set
    updateSet: async (workoutId: string, exerciseId: string, setId: string, data: Partial<WorkoutSet>): Promise<Workout> => {
        await delay(200);
        if (activeWorkout && activeWorkout.id === workoutId) {
            const exercise = activeWorkout.exercises.find(e => e.id === exerciseId);
            if (exercise) {
                const set = exercise.sets.find(s => s.id === setId);
                if (set) {
                    Object.assign(set, data);
                    if (set.completed && !set.completedAt) {
                        set.completedAt = new Date();
                    }
                    activeWorkout.updatedAt = new Date();
                }
            }
        }
        return activeWorkout!;
    },

    // Delete set
    deleteSet: async (workoutId: string, exerciseId: string, setId: string): Promise<Workout> => {
        await delay(200);
        if (activeWorkout && activeWorkout.id === workoutId) {
            const exercise = activeWorkout.exercises.find(e => e.id === exerciseId);
            if (exercise) {
                exercise.sets = exercise.sets.filter(s => s.id !== setId);
                exercise.sets.forEach((set, idx) => { set.order = idx; });
                activeWorkout.updatedAt = new Date();
            }
        }
        return activeWorkout!;
    },

    // Delete exercise from workout
    deleteExercise: async (workoutId: string, exerciseId: string): Promise<Workout> => {
        await delay(300);
        if (activeWorkout && activeWorkout.id === workoutId) {
            activeWorkout.exercises = activeWorkout.exercises.filter(e => e.id !== exerciseId);
            activeWorkout.exercises.forEach((ex, idx) => { ex.order = idx; });
            activeWorkout.updatedAt = new Date();
        }
        return activeWorkout!;
    },

    // Move exercise
    moveExercise: async (workoutId: string, exerciseId: string, direction: 'up' | 'down'): Promise<Workout> => {
        await delay(200);
        if (activeWorkout && activeWorkout.id === workoutId) {
            const index = activeWorkout.exercises.findIndex(e => e.id === exerciseId);
            if (direction === 'up' && index > 0) {
                [activeWorkout.exercises[index - 1], activeWorkout.exercises[index]] =
                    [activeWorkout.exercises[index], activeWorkout.exercises[index - 1]];
            } else if (direction === 'down' && index < activeWorkout.exercises.length - 1) {
                [activeWorkout.exercises[index + 1], activeWorkout.exercises[index]] =
                    [activeWorkout.exercises[index], activeWorkout.exercises[index + 1]];
            }
            activeWorkout.exercises.forEach((ex, idx) => { ex.order = idx; });
            activeWorkout.updatedAt = new Date();
        }
        return activeWorkout!;
    },

    // Update workout name
    updateWorkoutName: async (workoutId: string, name: string): Promise<Workout> => {
        await delay(200);
        if (activeWorkout && activeWorkout.id === workoutId) {
            activeWorkout.name = name;
            activeWorkout.updatedAt = new Date();
        }
        return activeWorkout!;
    },

    // Finish workout
    finishWorkout: async (workoutId: string): Promise<Workout> => {
        await delay(500);
        if (activeWorkout && activeWorkout.id === workoutId) {
            activeWorkout.endTime = new Date();
            activeWorkout.duration = Math.floor((activeWorkout.endTime.getTime() - activeWorkout.startTime.getTime()) / 1000);
            activeWorkout.isActive = false;

            // Calculate totals
            let totalVolume = 0;
            let totalSets = 0;
            activeWorkout.exercises.forEach(exercise => {
                exercise.sets.forEach(set => {
                    if (set.completed && set.weight && set.reps) {
                        totalVolume += set.weight * set.reps;
                        totalSets++;
                    }
                });
            });
            activeWorkout.totalVolume = totalVolume;
            activeWorkout.totalSets = totalSets;
            activeWorkout.totalExercises = activeWorkout.exercises.length;

            // Save to history
            mockWorkouts.unshift({ ...activeWorkout });
            const completedWorkout = activeWorkout;
            activeWorkout = null;
            return completedWorkout;
        }
        throw new Error('Workout not found');
    },

    // Get workout history
    getWorkoutHistory: async (period?: 'week' | 'month' | 'year' | 'all'): Promise<WorkoutSummary[]> => {
        await delay(300);
        let filtered = [...mockWorkouts];
        const now = new Date();

        if (period === 'week') {
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            filtered = filtered.filter(w => w.startTime >= weekAgo);
        } else if (period === 'month') {
            const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
            filtered = filtered.filter(w => w.startTime >= monthAgo);
        } else if (period === 'year') {
            const yearAgo = new Date(now.setFullYear(now.getFullYear() - 1));
            filtered = filtered.filter(w => w.startTime >= yearAgo);
        }

        return filtered.map(w => ({
            id: w.id,
            name: w.name,
            date: w.startTime,
            duration: w.duration || 0,
            totalExercises: w.totalExercises || 0,
            totalSets: w.totalSets || 0,
            totalVolume: w.totalVolume || 0,
        }));
    },

    // Get workout by id
    getWorkoutById: async (id: string): Promise<Workout | null> => {
        await delay(300);
        return mockWorkouts.find(w => w.id === id) || null;
    },

    // Update workout (for editing)
    updateWorkout: async (id: string, data: Partial<Workout>): Promise<Workout> => {
        await delay(500);
        const index = mockWorkouts.findIndex(w => w.id === id);
        if (index !== -1) {
            mockWorkouts[index] = { ...mockWorkouts[index], ...data, updatedAt: new Date() };
            return mockWorkouts[index];
        }
        throw new Error('Workout not found');
    },

    // Delete workout
    deleteWorkout: async (id: string): Promise<void> => {
        await delay(500);
        const index = mockWorkouts.findIndex(w => w.id === id);
        if (index !== -1) {
            mockWorkouts.splice(index, 1);
        }
    },

    // Get workout stats
    getWorkoutStats: async (): Promise<WorkoutStats> => {
        await delay(300);
        const totalWorkouts = mockWorkouts.length;
        const totalSets = mockWorkouts.reduce((sum, w) => sum + (w.totalSets || 0), 0);
        const totalVolume = mockWorkouts.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
        const averageDuration = totalWorkouts > 0
            ? mockWorkouts.reduce((sum, w) => sum + (w.duration || 0), 0) / totalWorkouts
            : 0;

        return {
            totalWorkouts,
            totalSets,
            totalVolume,
            averageDuration,
            mostFrequentExercise: 'Жим лежа', // Mock
        };
    },

    // Check if workout has incomplete sets
    hasIncompleteSets: (workout: Workout): boolean => {
        return workout.exercises.some(exercise =>
            exercise.sets.some(set => !set.completed || !set.weight || !set.reps)
        );
    },

    // Remove incomplete sets
    removeIncompleteSets: (workout: Workout): Workout => {
        workout.exercises.forEach(exercise => {
            exercise.sets = exercise.sets.filter(set => set.completed && set.weight && set.reps);
        });
        workout.exercises = workout.exercises.filter(exercise => exercise.sets.length > 0);
        return workout;
    },
};