export type MuscleGroup =
    | 'chest'
    | 'back'
    | 'legs'
    | 'shoulders'
    | 'arms'
    | 'core'
    | 'cardio'
    | 'stretching';

export type ExerciseType = 'strength' | 'cardio' | 'stretching';

export interface Exercise {
    id: string;
    name: string;
    muscleGroup: MuscleGroup;
    type: ExerciseType;
    photo?: string;
    description?: string;
    tips?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

//подход
export interface ExerciseSet {
    id: string;
    weight: number;
    reps: number;
    duration?: number; // для кардио в секундах
}

export interface ExerciseHistory {
    id: string;
    exerciseId: string;
    workoutId: string;
    workoutDate: Date;
    sets: ExerciseSet[];
    maxWeight: number;
    oneRM?: number; // 1 повторный максимум
}

export interface ExerciseStats {
    exerciseId: string;
    bestWeight: number;
    bestOneRM: number;
    totalVolume: number; //суммарный объем
    totalSets: number; //количество подходов
    lastPerformed: Date;
    frequency: number; // раз в неделю
}