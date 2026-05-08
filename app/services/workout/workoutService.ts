import { Alert } from 'react-native';
import { workoutsApi } from '@/app/api/workouts/workoutsApi';
import { supabase, getCurrentUserId } from '@/app/supabase/supabaseClient';
import { Workout, WorkoutExercise, WorkoutSet, WorkoutSummary, WorkoutStats } from '@/app/entities/workout';

export const workoutService = {
    async getActiveWorkout(): Promise<Workout | null> {
        console.log('[WorkoutService] getActiveWorkout called');
        try {
            const userId = await getCurrentUserId();
            console.log('[WorkoutService] getActiveWorkout userId:', userId);
            if (!userId) return null;

            const workout = await workoutsApi.fetchActiveWorkout(userId);
            if (!workout) return null;

            return await buildWorkout(workout);
        } catch (error: any) {
            console.error('[WorkoutService] getActiveWorkout error:', error);
            return null;
        }
    },

    async startWorkout(name?: string): Promise<Workout> {
        console.log('[WorkoutService] startWorkout called, name:', name);
        const userId = await getCurrentUserId();
        if (!userId) {
            Alert.alert('Ошибка', 'Пользователь не авторизован');
            throw new Error('User not authenticated');
        }

        const now = new Date();
        const workoutName = name || `Тренировка ${now.toLocaleDateString('ru-RU')}`;
        const data = await workoutsApi.insertWorkout(userId, workoutName);
        console.log('[WorkoutService] startWorkout success, id:', data.id);

        return {
            id: data.id,
            name: data.name,
            startTime: new Date(data.start_time),
            exercises: [],
            isActive: true,
            createdAt: new Date(data.created_at),
            updatedAt: new Date(data.updated_at),
        };
    },

    async addExerciseToWorkout(workoutId: string, exercise: any): Promise<Workout> {
        console.log('[WorkoutService] addExerciseToWorkout called, workoutId:', workoutId, 'exercise:', exercise.name);
        const maxOrder = await workoutsApi.fetchMaxExerciseOrder(workoutId);
        const nextOrder = maxOrder + 1;
        await workoutsApi.insertWorkoutExercise(workoutId, exercise, nextOrder);
        return this.getWorkoutById(workoutId) as Promise<Workout>;
    },

    async addSetToExercise(workoutId: string, exerciseId: string): Promise<Workout> {
        console.log('[WorkoutService] addSetToExercise called, exerciseId:', exerciseId);
        const maxOrder = await workoutsApi.fetchMaxSetOrder(exerciseId);
        const nextOrder = maxOrder + 1;
        await workoutsApi.insertSet(exerciseId, nextOrder);
        return this.getWorkoutById(workoutId) as Promise<Workout>;
    },

    async updateSet(workoutId: string, exerciseId: string, setId: string, data: Partial<WorkoutSet>): Promise<Workout> {
        console.log('[WorkoutService] updateSet called, setId:', setId);
        const updateData: any = {};
        if (data.weight !== undefined) updateData.weight = data.weight;
        if (data.reps !== undefined) updateData.reps = data.reps;
        if (data.completed !== undefined) {
            updateData.completed = data.completed;
            if (data.completed) updateData.completed_at = new Date().toISOString();
        }
        await workoutsApi.updateSetById(setId, updateData);
        return this.getWorkoutById(workoutId) as Promise<Workout>;
    },

    async deleteSet(workoutId: string, exerciseId: string, setId: string): Promise<Workout> {
        console.log('[WorkoutService] deleteSet called, setId:', setId);
        await workoutsApi.deleteSetById(setId);
        await workoutsApi.reorderSetsByExerciseId(exerciseId);
        return this.getWorkoutById(workoutId) as Promise<Workout>;
    },

    async deleteExercise(workoutId: string, exerciseId: string): Promise<Workout> {
        console.log('[WorkoutService] deleteExercise called, exerciseId:', exerciseId);
        await workoutsApi.deleteWorkoutExerciseById(exerciseId);
        await workoutsApi.reorderExercisesByWorkoutId(workoutId);
        return this.getWorkoutById(workoutId) as Promise<Workout>;
    },

    async moveExercise(workoutId: string, exerciseId: string, direction: 'up' | 'down'): Promise<Workout> {
        console.log('[WorkoutService] moveExercise called');
        const exercises = await workoutsApi.fetchWorkoutExercises(workoutId);
        const currentIndex = exercises.findIndex((e: any) => e.id === exerciseId);
        if (currentIndex === -1) return this.getWorkoutById(workoutId) as Promise<Workout>;

        const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (swapIndex < 0 || swapIndex >= exercises.length) return this.getWorkoutById(workoutId) as Promise<Workout>;

        const currentOrder = exercises[currentIndex].order_index;
        const swapOrder = exercises[swapIndex].order_index;

        await Promise.all([
            supabase.from('workout_exercises').update({ order_index: swapOrder }).eq('id', exercises[currentIndex].id),
            supabase.from('workout_exercises').update({ order_index: currentOrder }).eq('id', exercises[swapIndex].id),
        ]);
        return this.getWorkoutById(workoutId) as Promise<Workout>;
    },

    async updateWorkoutName(workoutId: string, name: string): Promise<Workout> {
        console.log('[WorkoutService] updateWorkoutName called');
        await workoutsApi.updateWorkoutNameById(workoutId, name);
        return this.getWorkoutById(workoutId) as Promise<Workout>;
    },

    async finishWorkout(workoutId: string): Promise<Workout> {
        console.log('[WorkoutService] finishWorkout called, workoutId:', workoutId);
        const workout = await this.getWorkoutById(workoutId);
        if (!workout) throw new Error('Workout not found');

        // Удаляем пустые подходы из базы данных
        for (const exercise of workout.exercises) {
            for (const set of exercise.sets) {
                if (!set.completed || !set.weight || !set.reps) {
                    console.log('[WorkoutService] Deleting empty set:', set.id);
                    await workoutsApi.deleteSetById(set.id);
                }
            }
        }

        // Перезагружаем тренировку после удаления пустых подходов
        const cleanedWorkout = await this.getWorkoutById(workoutId);
        if (!cleanedWorkout) throw new Error('Workout not found after cleaning');

        let totalVolume = 0;
        let totalSets = 0;
        cleanedWorkout.exercises.forEach(ex => {
            ex.sets.forEach(set => {
                if (set.completed && set.weight && set.reps) {
                    totalVolume += set.weight * set.reps;
                    totalSets++;
                }
            });
        });

        const endTime = new Date();
        const duration = Math.floor((endTime.getTime() - cleanedWorkout.startTime.getTime()) / 1000);

        await workoutsApi.updateWorkoutFinish(
            workoutId,
            endTime.toISOString(),
            duration,
            totalVolume,
            totalSets,
            cleanedWorkout.exercises.filter(ex => ex.sets.length > 0).length
        );

        return this.getWorkoutById(workoutId) as Promise<Workout>;
    },

    async getWorkoutHistory(period?: 'week' | 'month' | 'year' | 'all'): Promise<WorkoutSummary[]> {
        console.log('[WorkoutService] getWorkoutHistory called, period:', period);
        const userId = await getCurrentUserId();
        if (!userId) return [];

        const data = await workoutsApi.fetchWorkoutHistory(userId, period === 'all' ? undefined : period);
        return data.map((w: any) => ({
            id: w.id,
            name: w.name,
            date: new Date(w.start_time),
            duration: w.duration || 0,
            totalExercises: w.total_exercises || 0,
            totalSets: w.total_sets || 0,
            totalVolume: w.total_volume || 0,
        }));
    },

    async getWorkoutById(id: string): Promise<Workout | null> {
        console.log('[WorkoutService] getWorkoutById called, id:', id);
        const workout = await workoutsApi.fetchWorkoutById(id);
        if (!workout) return null;
        return await buildWorkout(workout);
    },

    async updateWorkout(id: string, data: Partial<Workout>): Promise<Workout> {
        console.log('[WorkoutService] updateWorkout called, id:', id);
        if (data.name) {
            await workoutsApi.updateWorkoutNameById(id, data.name);
        }
        return this.getWorkoutById(id) as Promise<Workout>;
    },

    async deleteWorkout(id: string): Promise<void> {
        console.log('[WorkoutService] deleteWorkout called, id:', id);
        await workoutsApi.deleteWorkoutById(id);
    },

    async getWorkoutStats(): Promise<WorkoutStats> {
        console.log('[WorkoutService] getWorkoutStats called');
        const userId = await getCurrentUserId();
        if (!userId) return { totalWorkouts: 0, totalSets: 0, totalVolume: 0, averageDuration: 0, mostFrequentExercise: '' };

        const workouts = await workoutsApi.fetchWorkoutStats(userId);
        const totalWorkouts = workouts.length;
        const totalSets = workouts.reduce((sum: number, w: any) => sum + (w.total_sets || 0), 0);
        const totalVolume = workouts.reduce((sum: number, w: any) => sum + (w.total_volume || 0), 0);
        const averageDuration = totalWorkouts > 0
            ? workouts.reduce((sum: number, w: any) => sum + (w.duration || 0), 0) / totalWorkouts
            : 0;

        return { totalWorkouts, totalSets, totalVolume, averageDuration, mostFrequentExercise: '—' };
    },

    hasIncompleteSets(workout: Workout): boolean {
        return workout.exercises.some(ex =>
            ex.sets.some(set => !set.completed || !set.weight || !set.reps)
        );
    },

    removeIncompleteSets(workout: Workout): Workout {
        const cleaned = { ...workout };
        cleaned.exercises = workout.exercises.map(ex => ({
            ...ex,
            sets: ex.sets.filter(set => set.completed && set.weight && set.reps)
        }));
        cleaned.exercises = cleaned.exercises.filter(ex => ex.sets.length > 0);
        return cleaned;
    },
};

async function buildWorkout(workout: any): Promise<Workout> {
    const exercises = await workoutsApi.fetchWorkoutExercises(workout.id);
    return {
        id: workout.id,
        name: workout.name,
        startTime: new Date(workout.start_time),
        endTime: workout.end_time ? new Date(workout.end_time) : undefined,
        duration: workout.duration,
        exercises: exercises.map((ex: any) => ({
            id: ex.id,
            exerciseId: ex.exercise_id,
            exerciseName: ex.exercise_name,
            muscleGroup: ex.muscle_group,
            exercisePhoto: ex.exercise_photo,
            sets: (ex.sets || [])
                .sort((a: any, b: any) => a.order_index - b.order_index)
                .map((s: any) => ({
                    id: s.id,
                    exerciseId: ex.id,
                    weight: s.weight,
                    reps: s.reps,
                    completed: s.completed,
                    completedAt: s.completed_at ? new Date(s.completed_at) : undefined,
                    order: s.order_index,
                })),
            order: ex.order_index,
        })),
        isActive: workout.is_active,
        totalVolume: workout.total_volume,
        totalSets: workout.total_sets,
        totalExercises: workout.total_exercises,
        createdAt: new Date(workout.created_at),
        updatedAt: new Date(workout.updated_at),
    };
}