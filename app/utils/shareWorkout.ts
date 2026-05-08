import { Linking, Alert, Share } from 'react-native';
import { Workout } from '@/app/entities/workout';

export function formatWorkoutForSharing(workout: Workout, t: any): string {
    const date = new Date(workout.startTime).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const hours = Math.floor((workout.duration || 0) / 3600);
    const minutes = Math.floor(((workout.duration || 0) % 3600) / 60);
    const durationStr = hours > 0
        ? `${hours}ч ${minutes}м`
        : `${minutes}м`;

    let message = `💪 Тренировка завершена!\n\n`;
    message += `📅 ${date}\n`;
    message += `⏱ Длительность: ${durationStr}\n`;
    message += `📊 Упражнений: ${workout.totalExercises || 0}\n`;
    message += `🔄 Подходов: ${workout.totalSets || 0}\n`;
    message += `🏋️ Общий объем: ${workout.totalVolume || 0} кг\n\n`;

    message += `Выполненные упражнения:\n`;
    workout.exercises.forEach((exercise, index) => {
        const completedSets = exercise.sets.filter(s => s.completed && s.weight && s.reps);
        if (completedSets.length > 0) {
            message += `\n${index + 1}. ${exercise.exerciseName}\n`;
            completedSets.forEach((set, idx) => {
                message += `   ${idx + 1}. ${set.weight}кг × ${set.reps} повт.\n`;
            });
        }
    });

    message += `\n🏆 Тренировка в SportDiary`;

    return message;
}

export async function shareToTelegram(workout: Workout, t: any): Promise<void> {
    const message = formatWorkoutForSharing(workout, t);
    const encodedMessage = encodeURIComponent(message);

    // Используем правильный формат ссылки для Telegram
    const telegramUrl = `tg://msg?text=${encodedMessage}`;

    try {
        const canOpen = await Linking.canOpenURL(telegramUrl);
        if (canOpen) {
            await Linking.openURL(telegramUrl);
        } else {
            // Fallback на веб-версию
            const webUrl = `https://t.me/share/url?url=&text=${encodedMessage}`;
            await Linking.openURL(webUrl);
        }
    } catch (error) {
        console.error('[ShareWorkout] Error opening Telegram:', error);
        // Пробуем веб-версию
        try {
            const webUrl = `https://t.me/share/url?url=&text=${encodedMessage}`;
            await Linking.openURL(webUrl);
        } catch (webError) {
            Alert.alert(
                'Ошибка',
                'Не удалось открыть Telegram. Проверьте, установлено ли приложение.'
            );
        }
    }
}

export async function shareToWhatsApp(workout: Workout, t: any): Promise<void> {
    const message = formatWorkoutForSharing(workout, t);
    const encodedMessage = encodeURIComponent(message);
    const url = `whatsapp://send?text=${encodedMessage}`;

    try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
            await Linking.openURL(url);
        } else {
            throw new Error('WhatsApp not installed');
        }
    } catch (error) {
        console.error('[ShareWorkout] Error opening WhatsApp:', error);
        Alert.alert(
            'Ошибка',
            'Не удалось открыть WhatsApp. Проверьте, установлено ли приложение.'
        );
    }
}

export async function shareToVK(workout: Workout, t: any): Promise<void> {
    const message = formatWorkoutForSharing(workout, t);
    const encodedMessage = encodeURIComponent(message);
    const url = `https://vk.com/share.php?url=&title=Тренировка&comment=${encodedMessage}`;

    try {
        await Linking.openURL(url);
    } catch (error) {
        console.error('[ShareWorkout] Error opening VK:', error);
        Alert.alert('Ошибка', 'Не удалось открыть VK');
    }
}

export async function copyToShare(workout: Workout, t: any): Promise<void> {
    const message = formatWorkoutForSharing(workout, t);
    try {
        await Share.share({
            message: message,
        });
    } catch (error) {
        console.error('[ShareWorkout] Error sharing:', error);
    }
}