import { supabase } from '@/app/supabase/supabaseClient';

class WorkoutsApi {
    async fetchActiveWorkout(userId: string) {
        console.log('[WorkoutsApi] fetchActiveWorkout called, userId:', userId);
        const { data: workout, error } = await supabase
            .from('workouts')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log('[WorkoutsApi] fetchActiveWorkout: no active workout');
                return null;
            }
            console.error('[WorkoutsApi] fetchActiveWorkout error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] fetchActiveWorkout found, id:', workout.id);
        return workout;
    }

    async insertWorkout(userId: string, name: string) {
        console.log('[WorkoutsApi] insertWorkout called, userId:', userId, 'name:', name);
        const now = new Date().toISOString();
        const { data, error } = await supabase
            .from('workouts')
            .insert({
                user_id: userId,
                name: name,
                start_time: now,
                is_active: true,
            })
            .select()
            .single();

        if (error) {
            console.error('[WorkoutsApi] insertWorkout error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] insertWorkout success, id:', data.id);
        return data;
    }

    async fetchWorkoutById(workoutId: string) {
        console.log('[WorkoutsApi] fetchWorkoutById called, workoutId:', workoutId);
        const { data: workout, error } = await supabase
            .from('workouts')
            .select('*')
            .eq('id', workoutId)
            .single();

        if (error) {
            console.error('[WorkoutsApi] fetchWorkoutById error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] fetchWorkoutById found, name:', workout.name);
        return workout;
    }

    async fetchWorkoutExercises(workoutId: string) {
        console.log('[WorkoutsApi] fetchWorkoutExercises called, workoutId:', workoutId);
        const { data: exercises, error } = await supabase
            .from('workout_exercises')
            .select(`*, sets (*)`)
            .eq('workout_id', workoutId)
            .order('order_index', { ascending: true });

        if (error) {
            console.error('[WorkoutsApi] fetchWorkoutExercises error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] fetchWorkoutExercises count:', exercises?.length || 0);
        return exercises || [];
    }

    async insertWorkoutExercise(workoutId: string, exercise: any, orderIndex: number) {
        console.log('[WorkoutsApi] insertWorkoutExercise called, workoutId:', workoutId, 'exerciseId:', exercise.id, 'orderIndex:', orderIndex);
        const { data, error } = await supabase
            .from('workout_exercises')
            .insert({
                workout_id: workoutId,
                exercise_id: exercise.id,
                exercise_name: exercise.name,
                muscle_group: exercise.muscleGroup,
                exercise_photo: exercise.photo || null,
                order_index: orderIndex,
            })
            .select()
            .single();

        if (error) {
            console.error('[WorkoutsApi] insertWorkoutExercise error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] insertWorkoutExercise success, id:', data.id);
        return data;
    }

    async fetchMaxExerciseOrder(workoutId: string): Promise<number> {
        console.log('[WorkoutsApi] fetchMaxExerciseOrder called, workoutId:', workoutId);
        const { data, error } = await supabase
            .from('workout_exercises')
            .select('order_index')
            .eq('workout_id', workoutId)
            .order('order_index', { ascending: false })
            .limit(1);

        if (error) {
            console.error('[WorkoutsApi] fetchMaxExerciseOrder error:', error);
            throw error;
        }
        const max = data && data.length > 0 ? data[0].order_index : -1;
        console.log('[WorkoutsApi] fetchMaxExerciseOrder result:', max);
        return max;
    }

    async insertSet(workoutExerciseId: string, orderIndex: number) {
        console.log('[WorkoutsApi] insertSet called, workoutExerciseId:', workoutExerciseId, 'orderIndex:', orderIndex);
        const { data, error } = await supabase
            .from('sets')
            .insert({
                workout_exercise_id: workoutExerciseId,
                weight: null,
                reps: null,
                completed: false,
                order_index: orderIndex,
            })
            .select()
            .single();

        if (error) {
            console.error('[WorkoutsApi] insertSet error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] insertSet success, id:', data.id);
        return data;
    }

    async fetchMaxSetOrder(workoutExerciseId: string): Promise<number> {
        console.log('[WorkoutsApi] fetchMaxSetOrder called, workoutExerciseId:', workoutExerciseId);
        const { data, error } = await supabase
            .from('sets')
            .select('order_index')
            .eq('workout_exercise_id', workoutExerciseId)
            .order('order_index', { ascending: false })
            .limit(1);

        if (error) {
            console.error('[WorkoutsApi] fetchMaxSetOrder error:', error);
            throw error;
        }
        const max = data && data.length > 0 ? data[0].order_index : -1;
        console.log('[WorkoutsApi] fetchMaxSetOrder result:', max);
        return max;
    }

    async updateSetById(setId: string, updateData: any) {
        console.log('[WorkoutsApi] updateSetById called, setId:', setId, 'data:', JSON.stringify(updateData));
        const { error } = await supabase
            .from('sets')
            .update(updateData)
            .eq('id', setId);

        if (error) {
            console.error('[WorkoutsApi] updateSetById error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] updateSetById success');
    }

    async deleteSetById(setId: string) {
        console.log('[WorkoutsApi] deleteSetById called, setId:', setId);
        const { error } = await supabase
            .from('sets')
            .delete()
            .eq('id', setId);

        if (error) {
            console.error('[WorkoutsApi] deleteSetById error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] deleteSetById success');
    }

    async deleteWorkoutExerciseById(workoutExerciseId: string) {
        console.log('[WorkoutsApi] deleteWorkoutExerciseById called, id:', workoutExerciseId);
        const { error } = await supabase
            .from('workout_exercises')
            .delete()
            .eq('id', workoutExerciseId);

        if (error) {
            console.error('[WorkoutsApi] deleteWorkoutExerciseById error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] deleteWorkoutExerciseById success');
    }

    async updateWorkoutNameById(workoutId: string, name: string) {
        console.log('[WorkoutsApi] updateWorkoutNameById called, workoutId:', workoutId, 'name:', name);
        const { error } = await supabase
            .from('workouts')
            .update({ name })
            .eq('id', workoutId);

        if (error) {
            console.error('[WorkoutsApi] updateWorkoutNameById error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] updateWorkoutNameById success');
    }

    async updateWorkoutFinish(workoutId: string, endTime: string, duration: number, totalVolume: number, totalSets: number, totalExercises: number) {
        console.log('[WorkoutsApi] updateWorkoutFinish called, workoutId:', workoutId);
        const { error } = await supabase
            .from('workouts')
            .update({
                end_time: endTime,
                duration,
                is_active: false,
                total_volume: totalVolume,
                total_sets: totalSets,
                total_exercises: totalExercises,
            })
            .eq('id', workoutId);

        if (error) {
            console.error('[WorkoutsApi] updateWorkoutFinish error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] updateWorkoutFinish success');
    }

    async fetchWorkoutHistory(userId: string, period?: string) {
        console.log('[WorkoutsApi] fetchWorkoutHistory called, userId:', userId, 'period:', period);
        let query = supabase
            .from('workouts')
            .select('id, name, start_time, duration, total_exercises, total_sets, total_volume')
            .eq('user_id', userId)
            .eq('is_active', false)
            .order('start_time', { ascending: false });

        const now = new Date();
        if (period === 'week') {
            now.setDate(now.getDate() - 7);
            query = query.gte('start_time', now.toISOString());
        } else if (period === 'month') {
            now.setMonth(now.getMonth() - 1);
            query = query.gte('start_time', now.toISOString());
        } else if (period === 'year') {
            now.setFullYear(now.getFullYear() - 1);
            query = query.gte('start_time', now.toISOString());
        }

        const { data, error } = await query;

        if (error) {
            console.error('[WorkoutsApi] fetchWorkoutHistory error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] fetchWorkoutHistory count:', data?.length || 0);
        return data || [];
    }

    async deleteWorkoutById(workoutId: string) {
        console.log('[WorkoutsApi] deleteWorkoutById called, workoutId:', workoutId);
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('id', workoutId);

        if (error) {
            console.error('[WorkoutsApi] deleteWorkoutById error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] deleteWorkoutById success');
    }

    async fetchWorkoutStats(userId: string) {
        console.log('[WorkoutsApi] fetchWorkoutStats called, userId:', userId);
        const { data: workouts, error } = await supabase
            .from('workouts')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', false);

        if (error) {
            console.error('[WorkoutsApi] fetchWorkoutStats error:', error);
            throw error;
        }
        console.log('[WorkoutsApi] fetchWorkoutStats count:', workouts?.length || 0);
        return workouts || [];
    }

    async reorderSetsByExerciseId(workoutExerciseId: string) {
        console.log('[WorkoutsApi] reorderSetsByExerciseId called, workoutExerciseId:', workoutExerciseId);
        const { data: sets } = await supabase
            .from('sets')
            .select('id')
            .eq('workout_exercise_id', workoutExerciseId)
            .order('created_at', { ascending: true });

        if (sets) {
            const updates = sets.map((s: any, index: number) =>
                supabase.from('sets').update({ order_index: index }).eq('id', s.id)
            );
            await Promise.all(updates);
            console.log('[WorkoutsApi] reorderSetsByExerciseId done, count:', sets.length);
        }
    }

    async reorderExercisesByWorkoutId(workoutId: string) {
        console.log('[WorkoutsApi] reorderExercisesByWorkoutId called, workoutId:', workoutId);
        const { data: exercises } = await supabase
            .from('workout_exercises')
            .select('id')
            .eq('workout_id', workoutId)
            .order('created_at', { ascending: true });

        if (exercises) {
            const updates = exercises.map((e: any, index: number) =>
                supabase.from('workout_exercises').update({ order_index: index }).eq('id', e.id)
            );
            await Promise.all(updates);
            console.log('[WorkoutsApi] reorderExercisesByWorkoutId done, count:', exercises.length);
        }
    }
}

export const workoutsApi = new WorkoutsApi();