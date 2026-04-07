import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    Pressable,
    Alert,
    Image,
    ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppTheme } from '@/app/theme/theme';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Trash2, Save, X } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { muscleGroups, exerciseTypes } from '@/app/entities/exercisesMetadata';

export default function ExerciseForm({ navigation, route }) {
    const { colorScheme } = useAppTheme();
    const { t } = useTranslation();
    const isDark = colorScheme === 'dark';

    const { id } = route.params || {};
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '',
        muscleGroup: 'chest',
        type: 'strength',
        photo: null,
        description: '',
        tips: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            loadExercise();
        }
    }, [id]);

    const loadExercise = async () => {
        // TODO: Загрузить упражнение из хранилища по id
        setTimeout(() => {
            setFormData({
                name: 'Жим лежа',
                muscleGroup: 'chest',
                type: 'strength',
                photo: null,
                description: 'Базовое упражнение для развития грудных мышц',
                tips: 'Держите лопатки сведенными',
            });
            setInitialLoading(false);
        }, 500);
    };

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
        destructive: getColor(isDark ? 'dark' : 'light', 'destructive'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
        background: getColor(isDark ? 'dark' : 'light', 'background'),
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(t('exercises.error'), t('exercises.permissionRequired'));
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFormData({ ...formData, photo: result.assets[0].uri });
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(t('exercises.error'), t('exercises.cameraPermissionRequired'));
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setFormData({ ...formData, photo: result.assets[0].uri });
        }
    };

    const removePhoto = () => {
        setFormData({ ...formData, photo: null });
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = t('exercises.nameRequired');
        }
        if (!formData.muscleGroup) {
            newErrors.muscleGroup = t('exercises.muscleGroupRequired');
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;

        setLoading(true);

        // TODO: Сохранить в хранилище
        // Если упражнение существует и используется в тренировках,
        // при деактивации нужно сделать мягкое удаление (set isActive: false)

        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                t('exercises.success'),
                isEditing ? t('exercises.updated') : t('exercises.created'),
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        }, 500);
    };

    if (initialLoading) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-background">
            <View className="p-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-foreground">
                        {isEditing ? t('exercises.editExercise') : t('exercises.createNew')}
                    </Text>
                    <Pressable onPress={() => navigation.goBack()} className="p-2">
                        <X size={24} color={colors.primary} />
                    </Pressable>
                </View>

                {/* Photo Section */}
                <View className="mb-6">
                    <Text className="text-foreground font-medium mb-2">{t('exercises.photo')}</Text>
                    <View className="flex-row gap-3">
                        {formData.photo ? (
                            <View className="relative">
                                <Image source={{ uri: formData.photo }} className="w-24 h-24 rounded-xl" />
                                <Pressable
                                    onPress={removePhoto}
                                    className="absolute -top-2 -right-2 bg-destructive rounded-full p-1"
                                >
                                    <Trash2 size={16} color="#fff" />
                                </Pressable>
                            </View>
                        ) : (
                            <View className="flex-row gap-3">
                                <Pressable
                                    onPress={pickImage}
                                    className="w-24 h-24 bg-input-background rounded-xl border-2 border-dashed border-border justify-center items-center"
                                >
                                    <Camera size={24} color={colors.border} />
                                    <Text className="text-muted-foreground text-xs mt-1">{t('exercises.gallery')}</Text>
                                </Pressable>
                                <Pressable
                                    onPress={takePhoto}
                                    className="w-24 h-24 bg-input-background rounded-xl border-2 border-dashed border-border justify-center items-center"
                                >
                                    <Camera size={24} color={colors.border} />
                                    <Text className="text-muted-foreground text-xs mt-1">{t('exercises.camera')}</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>

                {/* Name Input */}
                <View className="mb-4">
                    <Text className="text-foreground font-medium mb-2">{t('exercises.name')} *</Text>
                    <TextInput
                        className="bg-input-background rounded-xl p-3 text-foreground border border-border"
                        placeholder={t('exercises.namePlaceholder')}
                        placeholderTextColor={colors.border}
                        value={formData.name}
                        onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                    {errors.name && (
                        <Text className="text-destructive text-xs mt-1">{errors.name}</Text>
                    )}
                </View>

                {/* Muscle Group Picker */}
                <View className="mb-4">
                    <Text className="text-foreground font-medium mb-2">{t('exercises.muscleGroup')} *</Text>
                    <View className="bg-input-background rounded-xl border border-border overflow-hidden">
                        <Picker
                            selectedValue={formData.muscleGroup}
                            onValueChange={(value) => setFormData({ ...formData, muscleGroup: value })}
                            dropdownIconColor={colors.primary}
                            style={{ color: isDark ? '#fff' : '#000' }}
                        >
                            {muscleGroups.map((group) => (
                                <Picker.Item
                                    key={group.id}
                                    label={t(group.labelKey)}
                                    value={group.id}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Exercise Type Picker */}
                <View className="mb-4">
                    <Text className="text-foreground font-medium mb-2">{t('exercises.type')} *</Text>
                    <View className="bg-input-background rounded-xl border border-border overflow-hidden">
                        <Picker
                            selectedValue={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                            dropdownIconColor={colors.primary}
                            style={{ color: isDark ? '#fff' : '#000' }}
                        >
                            {exerciseTypes.map((type) => (
                                <Picker.Item
                                    key={type.id}
                                    label={t(type.labelKey)}
                                    value={type.id}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* Description Input */}
                <View className="mb-4">
                    <Text className="text-foreground font-medium mb-2">{t('exercises.description')}</Text>
                    <TextInput
                        className="bg-input-background rounded-xl p-3 text-foreground border border-border"
                        placeholder={t('exercises.descriptionPlaceholder')}
                        placeholderTextColor={colors.border}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                    />
                </View>

                {/* Tips Input */}
                <View className="mb-6">
                    <Text className="text-foreground font-medium mb-2">{t('exercises.tips')}</Text>
                    <TextInput
                        className="bg-input-background rounded-xl p-3 text-foreground border border-border"
                        placeholder={t('exercises.tipsPlaceholder')}
                        placeholderTextColor={colors.border}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                        value={formData.tips}
                        onChangeText={(text) => setFormData({ ...formData, tips: text })}
                    />
                </View>

                {/* Save Button */}
                <Pressable
                    onPress={handleSave}
                    disabled={loading}
                    className={`bg-primary py-3 rounded-xl flex-row items-center justify-center gap-2 ${loading ? 'opacity-50' : ''}`}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color={colors.primaryForeground} />
                    ) : (
                        <>
                            <Save size={20} color={colors.primaryForeground} />
                            <Text className="text-primary-foreground font-semibold text-lg">{t('exercises.save')}</Text>
                        </>
                    )}
                </Pressable>
            </View>
        </ScrollView>
    );
}