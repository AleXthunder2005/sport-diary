import { supabase } from '@/app/supabase/supabaseClient';

class ExercisesApi {
    async fetchExercises(userId: string) {
        console.log('[ExercisesApi] fetchExercises called, userId:', userId);
        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[ExercisesApi] fetchExercises error:', error);
            throw error;
        }
        console.log('[ExercisesApi] fetchExercises result count:', data?.length || 0);
        return data || [];
    }

    async fetchExerciseById(id: string) {
        console.log('[ExercisesApi] fetchExerciseById called, id:', id);
        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('[ExercisesApi] fetchExerciseById error:', error);
            throw error;
        }
        console.log('[ExercisesApi] fetchExerciseById result:', data?.name);
        return data;
    }

    async fetchExerciseStats(userId: string, exerciseId: string) {
        console.log('[ExercisesApi] fetchExerciseStats called, userId:', userId, 'exerciseId:', exerciseId);
        const { data: sets, error } = await supabase
            .from('sets')
            .select(`
                weight,
                reps,
                completed,
                workout_exercises!inner (
                    exercise_id,
                    workouts!inner (
                        user_id,
                        start_time
                    )
                )
            `)
            .eq('workout_exercises.exercise_id', exerciseId)
            .eq('workout_exercises.workouts.user_id', userId)
            .eq('completed', true)
            .not('weight', 'is', null)
            .not('reps', 'is', null);

        if (error) {
            console.error('[ExercisesApi] fetchExerciseStats error:', error);
            throw error;
        }
        console.log('[ExercisesApi] fetchExerciseStats sets count:', sets?.length || 0);
        return sets || [];
    }

    async fetchExerciseChartData(userId: string, exerciseId: string, periodDays: string) {
        console.log('[ExercisesApi] fetchExerciseChartData called, exerciseId:', exerciseId, 'periodDays:', periodDays);

        // Исправленный запрос: получаем подходы через workout_exercises и сортируем по дате тренировки
        const { data: workoutExercises, error } = await supabase
            .from('workout_exercises')
            .select(`
                id,
                sets!inner (
                    weight,
                    reps,
                    completed
                ),
                workouts!inner (
                    start_time
                )
            `)
            .eq('exercise_id', exerciseId)
            .eq('workouts.user_id', userId)
            .eq('sets.completed', true)
            .not('sets.weight', 'is', null)
            .not('sets.reps', 'is', null)
            .gte('workouts.start_time', periodDays)
            .order('start_time', { foreignTable: 'workouts', ascending: true });

        if (error) {
            console.error('[ExercisesApi] fetchExerciseChartData error:', error);
            throw error;
        }

        // Преобразуем в плоский массив подходов с датами
        const sets = (workoutExercises || []).flatMap((we: any) => {
            const startTime = we.workouts?.start_time;
            return (we.sets || []).map((s: any) => ({
                weight: s.weight,
                reps: s.reps,
                workout_exercises: {
                    workouts: {
                        start_time: startTime
                    }
                }
            }));
        });

        console.log('[ExercisesApi] fetchExerciseChartData sets count:', sets.length);
        return sets;
    }

    async fetchExerciseHistory(userId: string, exerciseId: string, periodDays: string) {
        console.log('[ExercisesApi] fetchExerciseHistory called, exerciseId:', exerciseId, 'periodDays:', periodDays);

        const { data: workoutExercises, error } = await supabase
            .from('workout_exercises')
            .select(`
                id,
                workout_id,
                workouts!inner (
                    user_id,
                    start_time
                ),
                sets (
                    id,
                    weight,
                    reps,
                    completed,
                    order_index
                )
            `)
            .eq('exercise_id', exerciseId)
            .eq('workouts.user_id', userId)
            .gte('workouts.start_time', periodDays)
            .order('start_time', { foreignTable: 'workouts', ascending: false });

        if (error) {
            console.error('[ExercisesApi] fetchExerciseHistory error:', error);
            throw error;
        }
        console.log('[ExercisesApi] fetchExerciseHistory workoutExercises count:', workoutExercises?.length || 0);
        return workoutExercises || [];
    }

    async insertExercise(userId: string, data: any) {
        console.log('[ExercisesApi] insertExercise called, userId:', userId, 'data:', JSON.stringify(data));
        const { data: created, error } = await supabase
            .from('exercises')
            .insert({
                user_id: userId,
                name: data.name,
                muscle_group: data.muscleGroup,
                type: data.type || 'strength',
                description: data.description || null,
                tips: data.tips || null,
                photo: data.photo || null,
            })
            .select()
            .single();

        if (error) {
            console.error('[ExercisesApi] insertExercise error:', error);
            throw error;
        }
        console.log('[ExercisesApi] insertExercise success, id:', created.id);
        return created;
    }

    async updateExerciseById(id: string, data: any) {
        console.log('[ExercisesApi] updateExerciseById called, id:', id, 'data:', JSON.stringify(data));
        const { data: updated, error } = await supabase
            .from('exercises')
            .update({
                name: data.name,
                muscle_group: data.muscleGroup,
                type: data.type,
                description: data.description || null,
                tips: data.tips || null,
                photo: data.photo || null,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[ExercisesApi] updateExerciseById error:', error);
            throw error;
        }
        console.log('[ExercisesApi] updateExerciseById success');
        return updated;
    }
}

export const exercisesApi = new ExercisesApi();