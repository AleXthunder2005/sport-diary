// app/components/profile/NotificationSettings.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Bell, BellOff, Clock, TestTube } from 'lucide-react-native';
import { getColor } from '@/app/colors/colors';
import { notificationService } from '../../services/notifications/notificationService';
import { useTranslation } from 'react-i18next';

interface NotificationSettingsProps {
    isDark: boolean;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ isDark }) => {
    const { t } = useTranslation();
    const [isEnabled, setIsEnabled] = useState(false);
    const [selectedHour, setSelectedHour] = useState(19);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [nextNotification, setNextNotification] = useState<Date | null>(null);

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
        foreground: getColor(isDark ? 'dark' : 'light', 'foreground'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
        inputBackground: getColor(isDark ? 'dark' : 'light', 'input-background'),
    };

    // Генерируем часы (0-23) и минуты (0-59)
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setIsLoading(true);
        const settings = await notificationService.getNotificationSettings();
        if (settings) {
            setIsEnabled(settings.enabled);
            setSelectedHour(settings.hour);
            setSelectedMinute(settings.minute);
        }

        const nextTime = await notificationService.getNextTriggerTime();
        setNextNotification(nextTime);
        setIsLoading(false);
    };

    const handleToggle = async (value: boolean) => {
        setIsEnabled(value);

        if (value) {
            const notificationId = await notificationService.scheduleDailyNotification(
                selectedHour,
                selectedMinute
            );

            if (notificationId) {
                await notificationService.saveNotificationSettings({
                    hour: selectedHour,
                    minute: selectedMinute,
                    enabled: true
                });

                const nextTime = await notificationService.getNextTriggerTime();
                setNextNotification(nextTime);

                Alert.alert(
                    t('notifications.enabled') || '✅ Notifications Enabled',
                    `${t('notifications.reminder_at') || 'You will receive daily workout reminders at'} ${formatTime(selectedHour, selectedMinute)}`
                );
            }
        } else {
            // await notificationService.cancelAllNotifications();
            await notificationService.saveNotificationSettings({
                hour: selectedHour,
                minute: selectedMinute,
                enabled: false
            });
            setNextNotification(null);

            Alert.alert(
                t('notifications.disabled') || '🔕 Notifications Disabled',
                t('notifications.disabled_message') || 'You will no longer receive workout reminders'
            );
        }
    };

    const handleHourChange = (hour: number) => {
        setSelectedHour(hour);
        if (isEnabled) {
            updateNotificationTime(hour, selectedMinute);
        }
    };

    const handleMinuteChange = (minute: number) => {
        setSelectedMinute(minute);
        if (isEnabled) {
            updateNotificationTime(selectedHour, minute);
        }
    };

    const updateNotificationTime = async (hour: number, minute: number) => {
        const notificationId = await notificationService.scheduleDailyNotification(hour, minute);
        if (notificationId) {
            await notificationService.saveNotificationSettings({
                hour: hour,
                minute: minute,
                enabled: true
            });

            const nextTime = await notificationService.getNextTriggerTime();
            setNextNotification(nextTime);

            Alert.alert(
                t('notifications.time_updated') || '⏰ Time Updated',
                `${t('notifications.reminder_time_changed') || 'Reminder time changed to'} ${formatTime(hour, minute)}`
            );
        }
    };

    const handleTestNotification = async () => {
        await notificationService.sendTestNotification();
    };

    const formatTime = (hour: number, minute: number): string => {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    const formatNextNotification = (date: Date | null): string => {
        if (!date) return t('notifications.not_scheduled') || 'Not scheduled';
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (isLoading) {
        return (
            <View className="bg-card rounded-xl p-6 border border-border/50">
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View className="bg-card rounded-xl border border-border/50 overflow-hidden">
            {/* Header with toggle */}
            <View className="flex-row items-center justify-between p-4 bg-primary/5">
                <View className="flex-row items-center gap-3">
                    {isEnabled ? (
                        <Bell size={20} color={colors.primary} />
                    ) : (
                        <BellOff size={20} color={colors.mutedForeground} />
                    )}
                    <View>
                        <Text className="text-foreground font-semibold text-base">
                            {t('notifications.title') || 'Workout Reminders'}
                        </Text>
                        <Text className="text-muted-foreground text-xs">
                            {t('notifications.description') || 'Get daily reminders to stay consistent'}
                        </Text>
                    </View>
                </View>
                <Switch
                    value={isEnabled}
                    onValueChange={handleToggle}
                    trackColor={{ false: colors.mutedForeground, true: colors.primary }}
                    thumbColor={colors.foreground}
                />
            </View>

            {isEnabled && (
                <View className="p-4">
                    {/* Time Pickers */}
                    <View className="mb-4">
                        <View className="flex-row items-center gap-2 mb-3">
                            <Clock size={16} color={colors.mutedForeground} />
                            <Text className="text-muted-foreground text-sm font-medium">
                                {t('notifications.reminder_time') || 'Reminder Time'}
                            </Text>
                        </View>

                        <View className="flex-row gap-4">
                            {/* Hours Picker */}
                            <View className="flex-1 bg-input-background rounded-xl border border-border overflow-hidden">
                                <Picker
                                    selectedValue={selectedHour}
                                    onValueChange={(itemValue) => handleHourChange(itemValue)}
                                    dropdownIconColor={colors.foreground}
                                    style={{ color: colors.foreground }}
                                >
                                    {hours.map((hour) => (
                                        <Picker.Item
                                            key={hour}
                                            label={hour.toString().padStart(2, '0')}
                                            value={hour}
                                        />
                                    ))}
                                </Picker>
                            </View>

                            <Text className="text-2xl font-bold text-foreground self-center">:</Text>

                            {/* Minutes Picker */}
                            <View className="flex-1 bg-input-background rounded-xl border border-border overflow-hidden">
                                <Picker
                                    selectedValue={selectedMinute}
                                    onValueChange={(itemValue) => handleMinuteChange(itemValue)}
                                    dropdownIconColor={colors.foreground}
                                    style={{ color: colors.foreground }}
                                >
                                    {minutes.map((minute) => (
                                        <Picker.Item
                                            key={minute}
                                            label={minute.toString().padStart(2, '0')}
                                            value={minute}
                                        />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                    </View>

                    {/* Next notification info */}
                    {nextNotification && (
                        <View className="bg-primary/10 rounded-lg p-3 mb-4">
                            <Text className="text-xs text-muted-foreground text-center">
                                {t('notifications.next_reminder') || 'Next reminder'}: {formatNextNotification(nextNotification)}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};