// components/workout/WorkoutSetRow.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal } from 'react-native';
import { Check, Trash2, Edit2 } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { useTranslation } from 'react-i18next';

export const WorkoutSetRow = ({ set, setIndex, onUpdate, onDelete, isDark, isEditing = false }) => {
    const { t } = useTranslation();
    const [modalVisible, setModalVisible] = useState(false);
    const [editWeight, setEditWeight] = useState(set.weight?.toString() || '');
    const [editReps, setEditReps] = useState(set.reps?.toString() || '');

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        success: getColor(isDark ? 'dark' : 'light', 'success'),
        destructive: getColor(isDark ? 'dark' : 'light', 'destructive'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
    };

    const handleSave = () => {
        const weight = parseFloat(editWeight);
        const reps = parseInt(editReps);

        if (!isNaN(weight) && !isNaN(reps) && weight >= 0 && reps >= 1) {
            onUpdate({ weight, reps, completed: true });
            setModalVisible(false);
        }
    };

    const handleToggleComplete = () => {
        if (set.weight && set.reps) {
            onUpdate({ completed: !set.completed });
        }
    };

    const isCompleted = set.completed && set.weight && set.reps;

    return (
        <>
            <Pressable onPress={() => isEditing && setModalVisible(true)}>
                <View className={`flex-row items-center gap-3 p-3 rounded-lg mb-2 ${isCompleted ? 'bg-primary/5' : 'bg-input-background'}`}>
                    {/* Set Number */}
                    <Text className="text-foreground font-medium w-8">
                        {setIndex + 1}
                    </Text>

                    {/* Weight & Reps */}
                    <View className="flex-1 flex-row gap-4">
                        {set.weight && set.reps ? (
                            <>
                                <Text className="text-foreground">
                                    {set.weight} {t('units.kg')}
                                </Text>
                                <Text className="text-muted-foreground">×</Text>
                                <Text className="text-foreground">
                                    {set.reps}
                                </Text>
                            </>
                        ) : (
                            <Text className="text-muted-foreground">
                                {t('workouts.addSet')}
                            </Text>
                        )}
                    </View>

                    {/* Complete Checkbox */}
                    {isEditing && (
                        <Pressable onPress={handleToggleComplete} disabled={!set.weight || !set.reps}>
                            <View className={`w-7 h-7 rounded-full border-2 justify-center items-center ${
                                isCompleted
                                    ? 'bg-success border-primary'
                                    : 'border-border'
                            }`}>
                                {isCompleted && <Check size={14} color="#fff" />}
                            </View>
                        </Pressable>
                    )}

                    {/* Delete Button */}
                    {isEditing && (
                        <Pressable onPress={() => onDelete()}>
                            <Trash2 size={22} color={colors.destructive} />
                        </Pressable>
                    )}
                </View>
            </Pressable>

            {/* Edit Modal */}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <Pressable
                    className="flex-1 bg-black/50 justify-center items-center"
                    onPress={() => setModalVisible(false)}
                >
                    <View className="bg-card rounded-2xl p-6 w-80" style={{ backgroundColor: colors.card }}>
                        <Text className="text-foreground text-lg font-semibold mb-4">
                            {t('workouts.editSet')}
                        </Text>

                        <TextInput
                            className="bg-input-background rounded-xl p-3 text-foreground border border-border mb-3"
                            placeholder={t('workouts.weight')}
                            placeholderTextColor={colors.border}
                            keyboardType="numeric"
                            value={editWeight}
                            onChangeText={setEditWeight}
                        />

                        <TextInput
                            className="bg-input-background rounded-xl p-3 text-foreground border border-border mb-4"
                            placeholder={t('workouts.reps')}
                            placeholderTextColor={colors.border}
                            keyboardType="numeric"
                            value={editReps}
                            onChangeText={setEditReps}
                        />

                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={() => setModalVisible(false)}
                                className="flex-1 py-3 rounded-xl border border-border"
                            >
                                <Text className="text-foreground text-center">{t('workouts.cancel')}</Text>
                            </Pressable>
                            <Pressable
                                onPress={handleSave}
                                className="flex-1 bg-primary py-3 rounded-xl"
                            >
                                <Text className="text-primary-foreground text-center font-semibold">
                                    {t('workouts.save')}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};