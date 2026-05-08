// entities/workout.ts
export interface WorkoutSet {
    id: string;
    exerciseId: string;
    weight: number | null;
    reps: number | null;
    completed: boolean;
    completedAt?: Date;
    order: number;
}

export interface WorkoutExercise {
    id: string;
    exerciseId: string;
    exerciseName: string;
    muscleGroup: string;
    exercisePhoto?: string;
    sets: WorkoutSet[];
    order: number;
}

export interface Workout {
    id: string;
    name: string;
    startTime: Date;
    endTime?: Date;
    duration?: number; // в секундах
    exercises: WorkoutExercise[];
    isActive: boolean;
    totalVolume?: number;
    totalSets?: number;
    totalExercises?: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface WorkoutSummary {
    id: string;
    name: string;
    date: Date;
    duration: number;
    totalExercises: number;
    totalSets: number;
    totalVolume: number;
}

export interface WorkoutStats {
    totalWorkouts: number;
    totalSets: number;
    totalVolume: number;
    averageDuration: number;
    mostFrequentExercise: string;
}