// app/components/profile/TimePickerWheel.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { getColor } from '@/app/colors/colors';
import { useTranslation } from 'react-i18next';

interface TimePickerWheelProps {
    isDark: boolean;
    initialHour?: number;
    initialMinute?: number;
    onTimeChange: (hour: number, minute: number) => void;
}

export const TimePickerWheel: React.FC<TimePickerWheelProps> = ({
                                                                    isDark,
                                                                    initialHour = 19,
                                                                    initialMinute = 0,
                                                                    onTimeChange
                                                                }) => {
    const { t } = useTranslation();
    const [selectedHour, setSelectedHour] = useState(initialHour);
    const [selectedMinute, setSelectedMinute] = useState(initialMinute);

    const hourScrollRef = useRef<ScrollView>(null);
    const minuteScrollRef = useRef<ScrollView>(null);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const minutes = Array.from({ length: 60 }, (_, i) => i);

    const ITEM_HEIGHT = 60; // Увеличил для лучшего клика

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        primaryForeground: getColor(isDark ? 'dark' : 'light', 'primary-foreground'),
        foreground: getColor(isDark ? 'dark' : 'light', 'foreground'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
    };

    // Прокрутка к выбранному значению
    const scrollToSelected = (type: 'hour' | 'minute') => {
        if (type === 'hour' && hourScrollRef.current) {
            const y = selectedHour * ITEM_HEIGHT;
            hourScrollRef.current.scrollTo({ y, animated: true });
        } else if (type === 'minute' && minuteScrollRef.current) {
            const y = selectedMinute * ITEM_HEIGHT;
            minuteScrollRef.current.scrollTo({ y, animated: true });
        }
    };

    // При монтировании прокручиваем к выбранным значениям
    useEffect(() => {
        setTimeout(() => {
            scrollToSelected('hour');
            scrollToSelected('minute');
        }, 100);
    }, []);

    const handleHourChange = (hour: number) => {
        setSelectedHour(hour);
        onTimeChange(hour, selectedMinute);
    };

    const handleMinuteChange = (minute: number) => {
        setSelectedMinute(minute);
        onTimeChange(selectedHour, minute);
    };

    // Обработка окончания скролла
    const onHourScrollEnd = (event: any) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        const hour = Math.min(23, Math.max(0, index));
        if (hour !== selectedHour) {
            handleHourChange(hour);
        }
    };

    const onMinuteScrollEnd = (event: any) => {
        const y = event.nativeEvent.contentOffset.y;
        const index = Math.round(y / ITEM_HEIGHT);
        const minute = Math.min(59, Math.max(0, index));
        if (minute !== selectedMinute) {
            handleMinuteChange(minute);
        }
    };

    return (
        <View className="flex-row justify-center items-start gap-4 py-4">
            {/* Часы */}
            <View className="flex-1">
                <Text className="text-muted-foreground text-sm text-center mb-2">
                    {t('time.hour') || 'Hour'}
                </Text>
                <View style={{ height: 240, position: 'relative' }}>
                    {/* Индикатор выбора */}
                    <View
                        style={{
                            position: 'absolute',
                            top: 90,
                            left: 0,
                            right: 0,
                            height: ITEM_HEIGHT,
                            backgroundColor: `${colors.primary}15`,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: colors.primary,
                            zIndex: 1,
                        }}
                    />
                    <ScrollView
                        ref={hourScrollRef}
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}
                        snapToInterval={ITEM_HEIGHT}
                        decelerationRate="fast"
                        onMomentumScrollEnd={onHourScrollEnd}
                        scrollEventThrottle={16}
                        removeClippedSubviews={false}
                    >
                        <View style={{ height: 90 }} />
                        {hours.map((hour) => (
                            <TouchableOpacity
                                key={hour}
                                onPress={() => {
                                    handleHourChange(hour);
                                    const y = hour * ITEM_HEIGHT;
                                    hourScrollRef.current?.scrollTo({ y, animated: true });
                                }}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={{
                                        height: ITEM_HEIGHT,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        className={`text-2xl ${
                                            selectedHour === hour
                                                ? 'text-primary font-bold'
                                                : 'text-foreground'
                                        }`}
                                    >
                                        {hour.toString().padStart(2, '0')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <View style={{ height: 90 }} />
                    </ScrollView>
                </View>
            </View>

            {/* Разделитель */}
            <Text className="text-3xl font-bold text-foreground" style={{ marginTop: 90 }}>
                :
            </Text>

            {/* Минуты */}
            <View className="flex-1">
                <Text className="text-muted-foreground text-sm text-center mb-2">
                    {t('time.minute') || 'Minute'}
                </Text>
                <View style={{ height: 240, position: 'relative' }}>
                    {/* Индикатор выбора */}
                    <View
                        style={{
                            position: 'absolute',
                            top: 90,
                            left: 0,
                            right: 0,
                            height: ITEM_HEIGHT,
                            backgroundColor: `${colors.primary}15`,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: colors.primary,
                            zIndex: 1,
                        }}
                    />
                    <ScrollView
                        ref={minuteScrollRef}
                        showsVerticalScrollIndicator={false}
                        style={{ flex: 1 }}
                        snapToInterval={ITEM_HEIGHT}
                        decelerationRate="fast"
                        onMomentumScrollEnd={onMinuteScrollEnd}
                        scrollEventThrottle={16}
                        removeClippedSubviews={false}
                    >
                        <View style={{ height: 90 }} />
                        {minutes.map((minute) => (
                            <TouchableOpacity
                                key={minute}
                                onPress={() => {
                                    handleMinuteChange(minute);
                                    const y = minute * ITEM_HEIGHT;
                                    minuteScrollRef.current?.scrollTo({ y, animated: true });
                                }}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={{
                                        height: ITEM_HEIGHT,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text
                                        className={`text-2xl ${
                                            selectedMinute === minute
                                                ? 'text-primary font-bold'
                                                : 'text-foreground'
                                        }`}
                                    >
                                        {minute.toString().padStart(2, '0')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                        <View style={{ height: 90 }} />
                    </ScrollView>
                </View>
            </View>
        </View>
    );
};