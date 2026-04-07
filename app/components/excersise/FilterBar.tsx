import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native';
import { Search, Filter, X } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';

const muscleGroups = [
    { id: 'all', label: 'Все' },
    { id: 'chest', label: 'Грудь' },
    { id: 'back', label: 'Спина' },
    { id: 'legs', label: 'Ноги' },
    { id: 'shoulders', label: 'Плечи' },
    { id: 'arms', label: 'Руки' },
    { id: 'core', label: 'Кор' },
    { id: 'cardio', label: 'Кардио' },
    { id: 'stretching', label: 'Растяжка' },
];

export const FilterBar = ({
                              searchQuery,
                              onSearchChange,
                              selectedMuscle,
                              onMuscleChange,
                              isDark
                          }) => {
    const [showFilters, setShowFilters] = useState(false);
    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
        background: getColor(isDark ? 'dark' : 'light', 'background'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
    };

    return (
        <View className="mb-4">
            {/* Search Bar */}
            <View className="flex-row gap-2 mb-3">
                <View className="flex-1 flex-row items-center bg-input-background rounded-xl border border-border px-3">
                    <Search size={20} color={colors.primary} />
                    <TextInput
                        className="flex-1 py-3 px-2 text-foreground"
                        placeholder="Поиск упражнений..."
                        placeholderTextColor={colors.border}
                        value={searchQuery}
                        onChangeText={onSearchChange}
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => onSearchChange('')}>
                            <X size={18} color={colors.border} />
                        </Pressable>
                    )}
                </View>
                <Pressable
                    onPress={() => setShowFilters(!showFilters)}
                    className="px-4 rounded-xl border border-border justify-center"
                >
                    <Filter size={20} color={colors.primary} />
                </Pressable>
            </View>

            {/* Filters */}
            {showFilters && (
                <View className="bg-card rounded-xl p-4 border border-border">
                    <Text className="text-foreground font-semibold mb-3">Группа мышц</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-2">
                            {muscleGroups.map((group) => (
                                <Pressable
                                    key={group.id}
                                    onPress={() => onMuscleChange(group.id === 'all' ? null : group.id)}
                                    className={`px-4 py-2 rounded-full ${
                                        selectedMuscle === group.id || (group.id === 'all' && !selectedMuscle)
                                            ? 'bg-primary'
                                            : 'bg-input-background border border-border'
                                    }`}
                                >
                                    <Text
                                        className={
                                            selectedMuscle === group.id || (group.id === 'all' && !selectedMuscle)
                                                ? 'text-primary-foreground'
                                                : 'text-foreground'
                                        }
                                    >
                                        {group.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            )}
        </View>
    );
};