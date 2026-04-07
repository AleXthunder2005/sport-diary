import React, { createContext, useContext, useState } from "react";

// ===== UTILS =====

const generateId = () =>
    `${Date.now()}-${Math.floor(Math.random() * 10000)}`;

// ===== TYPES =====

type WeightUnit = "kg" | "lb";
type Theme = "light" | "dark" | "system";

export type Profile = {
    name?: string;
    weightUnit: WeightUnit;
    theme: Theme;
    height?: number;
};

export type BodyWeightEntry = {
    id: string;
    date: string;
    weight: number;
};

export type Workout = {
    id: string;
    name: string;
    isActive: boolean;
};

export type Exercise = {
    id: string;
    name: string;
    inactive?: boolean;
};

export type AppData = {
    profile: Profile;
    bodyWeightEntries: BodyWeightEntry[];
    workouts: Workout[];
    exercises: Exercise[];
};

// ===== MOCK DATA =====

const mockData: AppData = {
    profile: {
        name: "Иван",
        weightUnit: "kg",
        theme: "system",
        height: 178,
    },
    bodyWeightEntries: [
        {
            id: generateId(),
            date: "2026-03-01",
            weight: 82,
        },
        {
            id: generateId(),
            date: "2026-03-10",
            weight: 81.2,
        },
        {
            id: generateId(),
            date: "2026-03-20",
            weight: 80.5,
        },
    ],
    workouts: [
        {
            id: generateId(),
            name: "Грудь + Трицепс",
            isActive: false,
        },
        {
            id: generateId(),
            name: "Спина + Бицепс",
            isActive: false,
        },
        {
            id: generateId(),
            name: "Ноги",
            isActive: true,
        },
    ],
    exercises: [
        {
            id: generateId(),
            name: "Жим лёжа",
        },
        {
            id: generateId(),
            name: "Присед",
        },
        {
            id: generateId(),
            name: "Становая тяга",
        },
        {
            id: generateId(),
            name: "Подтягивания",
            inactive: true,
        },
    ],
};

// ===== CONTEXT =====

type AppContextType = {
    data: AppData;
    updateProfile: (updates: Partial<Profile>) => void;
    addBodyWeightEntry: (entry: { date: string; weight: number }) => void;
    deleteBodyWeightEntry: (id: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// ===== PROVIDER =====

export const AppContextProvider = ({
                                       children,
                                   }: {
    children: React.ReactNode;
}) => {
    const [data, setData] = useState<AppData>(mockData);

    const updateProfile = (updates: Partial<Profile>) => {
        setData((prev) => ({
            ...prev,
            profile: {
                ...prev.profile,
                ...updates,
            },
        }));
    };

    const addBodyWeightEntry = (entry: {
        date: string;
        weight: number;
    }) => {
        const newEntry: BodyWeightEntry = {
            id: generateId(),
            ...entry,
        };

        setData((prev) => ({
            ...prev,
            bodyWeightEntries: [...prev.bodyWeightEntries, newEntry],
        }));
    };

    const deleteBodyWeightEntry = (id: string) => {
        setData((prev) => ({
            ...prev,
            bodyWeightEntries: prev.bodyWeightEntries.filter(
                (e) => e.id !== id
            ),
        }));
    };

    return (
        <AppContext.Provider
            value={{
                data,
                updateProfile,
                addBodyWeightEntry,
                deleteBodyWeightEntry,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

// ===== HOOK =====

export const useApp = () => {
    const ctx = useContext(AppContext);
    if (!ctx) {
        throw new Error("useApp must be used within AppContextProvider");
    }
    return ctx;
};