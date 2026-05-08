import { Alert } from 'react-native';
import { exercisesApi } from '@/app/api/exercises/exercisesApi';
import { getCurrentUserId } from '@/app/supabase/supabaseClient';
import { Exercise, ExerciseStats, ExerciseHistory } from '@/app/entities/exercises.types';

export const exercisesService = {
    async getExercises(): Promise<Exercise[]> {
        console.log('[ExerciseService] getExercises called');
        try {
            const userId = await getCurrentUserId();
            console.log('[ExerciseService] getExercises userId:', userId);
            if (!userId) {
                console.log('[ExerciseService] getExercises: no userId');
                return [];
            }

            const data = await exercisesApi.fetchExercises(userId);
            console.log('[ExerciseService] getExercises raw count:', data?.length);

            const result = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                muscleGroup: item.muscle_group,
                type: item.type,
                description: item.description,
                tips: item.tips,
                photo: item.photo,
                isActive: item.is_active,
                createdAt: new Date(item.created_at),
                updatedAt: new Date(item.updated_at),
            }));
            console.log('[ExerciseService] getExercises success, count:', result.length);
            return result;
        } catch (error: any) {
            console.error('[ExerciseService] getExercises error:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить упражнения');
            return [];
        }
    },

    async getExerciseById(id: string): Promise<Exercise | null> {
        console.log('[ExerciseService] getExerciseById called, id:', id);
        try {
            const data = await exercisesApi.fetchExerciseById(id);
            console.log('[ExerciseService] getExerciseById success:', data?.name);
            return {
                id: data.id,
                name: data.name,
                muscleGroup: data.muscle_group,
                type: data.type,
                description: data.description,
                tips: data.tips,
                photo: data.photo,
                isActive: data.is_active,
                createdAt: new Date(data.created_at),
                updatedAt: new Date(data.updated_at),
            };
        } catch (error: any) {
            console.error('[ExerciseService] getExerciseById error:', error);
            Alert.alert('Ошибка', 'Не удалось загрузить упражнение');
            return null;
        }
    },

    async getExerciseStats(exerciseId: string): Promise<ExerciseStats | null> {
        console.log('[ExerciseService] getExerciseStats called, exerciseId:', exerciseId);
        try {
            const userId = await getCurrentUserId();
            console.log('[ExerciseService] getExerciseStats userId:', userId);
            if (!userId) {
                return {
                    exerciseId,
                    bestWeight: 0,
                    bestOneRM: 0,
                    totalVolume: 0,
                    totalSets: 0,
                    lastPerformed: new Date(),
                    frequency: 0,
                };
            }

            const sets = await exercisesApi.fetchExerciseStats(userId, exerciseId);
            console.log('[ExerciseService] getExerciseStats sets count:', sets?.length);

            if (!sets || sets.length === 0) {
                return {
                    exerciseId,
                    bestWeight: 0,
                    bestOneRM: 0,
                    totalVolume: 0,
                    totalSets: 0,
                    lastPerformed: new Date(),
                    frequency: 0,
                };
            }

            let bestWeight = 0;
            let bestOneRM = 0;
            let totalVolume = 0;
            let lastDate = new Date(0);
            const uniqueDays = new Set<string>();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            sets.forEach((s: any) => {
                const weight = Number(s.weight) || 0;
                const reps = Number(s.reps) || 0;
                if (weight > bestWeight) bestWeight = weight;
                const oneRM = Math.round(weight * (1 + reps / 30));
                if (oneRM > bestOneRM) bestOneRM = oneRM;
                totalVolume += weight * reps;

                const workoutDate = new Date(s.workout_exercises?.workouts?.start_time);
                if (workoutDate > lastDate) lastDate = workoutDate;
                if (workoutDate >= thirtyDaysAgo) uniqueDays.add(workoutDate.toDateString());
            });

            const result = {
                exerciseId,
                bestWeight,
                bestOneRM,
                totalVolume,
                totalSets: sets.length,
                lastPerformed: lastDate,
                frequency: uniqueDays.size,
            };
            console.log('[ExerciseService] getExerciseStats success');
            return result;
        } catch (error: any) {
            console.error('[ExerciseService] getExerciseStats error:', error);
            return null;
        }
    },

    async getExerciseChartData(exerciseId: string, period: string): Promise<{ date: string; weight: number }[]> {
        console.log('[ExerciseService] getExerciseChartData called, exerciseId:', exerciseId, 'period:', period);
        try {
            const userId = await getCurrentUserId();
            console.log('[ExerciseService] getExerciseChartData userId:', userId);
            if (!userId) return [];

            const periodDays = getPeriodDaysISO(period);
            const sets = await exercisesApi.fetchExerciseChartData(userId, exerciseId, periodDays);

            const dailyMax = new Map<string, number>();
            sets.forEach((s: any) => {
                const date = new Date(s.workout_exercises?.workouts?.start_time)
                    .toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
                const weight = Number(s.weight) || 0;
                const current = dailyMax.get(date) || 0;
                if (weight > current) dailyMax.set(date, weight);
            });

            const result = Array.from(dailyMax.entries()).map(([date, weight]) => ({ date, weight }));
            console.log('[ExerciseService] getExerciseChartData success, points:', result.length);
            return result;
        } catch (error: any) {
            console.error('[ExerciseService] getExerciseChartData error:', error);
            return [];
        }
    },

    async getExerciseHistory(exerciseId: string, period: string): Promise<ExerciseHistory[]> {
        console.log('[ExerciseService] getExerciseHistory called, exerciseId:', exerciseId, 'period:', period);
        try {
            const userId = await getCurrentUserId();
            console.log('[ExerciseService] getExerciseHistory userId:', userId);
            if (!userId) return [];

            const periodDays = getPeriodDaysISO(period);
            const workoutExercises = await exercisesApi.fetchExerciseHistory(userId, exerciseId, periodDays);

            const result = workoutExercises.map((we: any) => {
                const completedSets = (we.sets || [])
                    .filter((s: any) => s.completed && s.weight && s.reps)
                    .sort((a: any, b: any) => a.order_index - b.order_index);

                let maxWeight = 0;
                let maxOneRM = 0;
                const sets = completedSets.map((s: any) => {
                    const weight = Number(s.weight) || 0;
                    const reps = Number(s.reps) || 0;
                    if (weight > maxWeight) maxWeight = weight;
                    const oneRM = Math.round(weight * (1 + reps / 30));
                    if (oneRM > maxOneRM) maxOneRM = oneRM;
                    return { id: s.id, weight, reps };
                });

                return {
                    id: we.id,
                    exerciseId,
                    workoutId: we.workout_id,
                    workoutDate: new Date(we.workouts.start_time),
                    sets,
                    maxWeight,
                    oneRM: maxOneRM,
                };
            });
            console.log('[ExerciseService] getExerciseHistory success, entries:', result.length);
            return result;
        } catch (error: any) {
            console.error('[ExerciseService] getExerciseHistory error:', error);
            return [];
        }
    },

    async createExercise(data: any): Promise<Exercise> {
        console.log('[ExerciseService] createExercise called, data:', JSON.stringify(data));
        try {
            const userId = await getCurrentUserId();
            console.log('[ExerciseService] createExercise userId:', userId);
            if (!userId) throw new Error('User not authenticated');

            const created = await exercisesApi.insertExercise(userId, data);
            console.log('[ExerciseService] createExercise success, id:', created.id);

            return {
                id: created.id,
                name: created.name,
                muscleGroup: created.muscle_group,
                type: created.type,
                description: created.description,
                tips: created.tips,
                photo: created.photo,
                isActive: true,
                createdAt: new Date(created.created_at),
                updatedAt: new Date(created.updated_at),
            };
        } catch (error: any) {
            console.error('[ExerciseService] createExercise error:', error);
            Alert.alert('Ошибка', 'Не удалось создать упражнение');
            throw error;
        }
    },

    async updateExercise(id: string, data: any): Promise<Exercise> {
        console.log('[ExerciseService] updateExercise called, id:', id);
        try {
            const updated = await exercisesApi.updateExerciseById(id, data);
            console.log('[ExerciseService] updateExercise success');
            return {
                id: updated.id,
                name: updated.name,
                muscleGroup: updated.muscle_group,
                type: updated.type,
                description: updated.description,
                tips: updated.tips,
                photo: updated.photo,
                isActive: updated.is_active,
                createdAt: new Date(updated.created_at),
                updatedAt: new Date(updated.updated_at),
            };
        } catch (error: any) {
            console.error('[ExerciseService] updateExercise error:', error);
            Alert.alert('Ошибка', 'Не удалось обновить упражнение');
            throw error;
        }
    },

    async getExerciseFormData(id: string): Promise<any> {
        console.log('[ExerciseService] getExerciseFormData called, id:', id);
        try {
            const exercise = await this.getExerciseById(id);
            if (!exercise) return {
                name: '',
                muscleGroup: 'chest',
                type: 'strength',
                photo: null,
                description: '',
                tips: '',
            };
            return {
                name: exercise.name,
                muscleGroup: exercise.muscleGroup,
                type: exercise.type,
                photo: exercise.photo,
                description: exercise.description,
                tips: exercise.tips,
            };
        } catch (error: any) {
            console.error('[ExerciseService] getExerciseFormData error:', error);
            return {
                name: '',
                muscleGroup: 'chest',
                type: 'strength',
                photo: null,
                description: '',
                tips: '',
            };
        }
    },
};

function getPeriodDaysISO(period: string): string {
    const now = new Date();
    switch (period) {
        case '30d':
            now.setDate(now.getDate() - 30);
            break;
        case '3m':
            now.setMonth(now.getMonth() - 3);
            break;
        case '1y':
            now.setFullYear(now.getFullYear() - 1);
            break;
        case 'all':
        default:
            return new Date(0).toISOString();
    }
    return now.toISOString();
}