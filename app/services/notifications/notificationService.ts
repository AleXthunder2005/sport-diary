// import * as Notifications from 'expo-notifications';
import { Platform, Alert } from 'react-native';
import { preferencesStorage } from '@/app/storages/preferencesStorage';

export interface NotificationTime {
    hour: number;
    minute: number;
    enabled: boolean;
}

class NotificationService {
    private static instance: NotificationService;
    private NOTIFICATION_KEY = 'workout_reminder_settings';

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    // Настройка поведения уведомлений
    configureNotifications() {
/*        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true,
            }),
        });*/
    }

    // Запрос разрешений на уведомления
    async requestPermissions(): Promise<boolean> {
/*        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            Alert.alert(
                'Permission required',
                'Please enable notifications to receive workout reminders'
            );
            return false;
        }
*/
        return true;
    }

    // Сохранение настроек уведомлений
    async saveNotificationSettings(time: NotificationTime): Promise<void> {
        await preferencesStorage.setItem(this.NOTIFICATION_KEY, time);
    }

    // Получение настроек уведомлений
    async getNotificationSettings(): Promise<NotificationTime | null> {
        return await preferencesStorage.getItem<NotificationTime>(this.NOTIFICATION_KEY);
    }

    // Запланировать ежедневное уведомление
    async scheduleDailyNotification(hour: number, minute: number): Promise<string | null> {
/*        await this.cancelAllNotifications();*/

        const hasPermission = await this.requestPermissions();
        if (!hasPermission) return null;

        // Настраиваем триггер для ежедневного уведомления
        const trigger = {
            hour: hour,
            minute: minute,
            repeats: true,
        };
/*
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: "🏋️‍♂️ Time to Workout!",
                body: "Don't forget your workout today! Stay consistent and reach your goals.",
                data: { type: 'workout_reminder' },
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
            },
            trigger: trigger,
        });*/

/*        // Сохраняем ID уведомления
        await preferencesStorage.setItem('notification_id', notificationId);

        return notificationId;*/
    }

    // Отмена всех запланированных уведомлений
/*    async cancelAllNotifications(): Promise<void> {
        await Notifications.cancelAllScheduledNotificationsAsync();
    }*/

    // Отправка тестового уведомления
    async sendTestNotification(): Promise<void> {
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) return;

/*        await Notifications.scheduleNotificationAsync({
            content: {
                title: "🏋️‍♂️ Workout Reminder Test",
                body: "This is how your daily reminder will look!",
                data: { type: 'test' },
                sound: true,
            },
            trigger: null, // Отправляем сразу
        });*/
    }

    // Форматирование времени для отображения
    formatTime(hour: number, minute: number): string {
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    }

    // Получить следующий запланированный триггер
    async getNextTriggerTime(): Promise<Date | null> {
        const settings = await this.getNotificationSettings();
        if (!settings || !settings.enabled) return null;

        const now = new Date();
        const nextTrigger = new Date();
        nextTrigger.setHours(settings.hour, settings.minute, 0, 0);

        if (nextTrigger <= now) {
            nextTrigger.setDate(nextTrigger.getDate() + 1);
        }

        return nextTrigger;
    }
}

export const notificationService = NotificationService.getInstance();