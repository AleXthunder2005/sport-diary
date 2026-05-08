// app/components/WeatherWidget.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    Modal,
    ScrollView,
    RefreshControl
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Cloud, MapPin, RefreshCw, Wind, Droplets, Sunrise, Sunset } from 'lucide-react-native';
import { weatherService, WeatherDisplayData } from '../../services/wheather/wheatherService';
import { getColor } from '@/app/colors/colors';
import { useAppTheme } from '@/app/theme/theme';

interface WeatherWidgetProps {
    isDark: boolean;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ isDark }) => {
    const { t, i18n } = useTranslation();
    const [weatherData, setWeatherData] = useState<WeatherDisplayData>({
        current: null,
        forecast: null,
        isLoading: true,
        error: null,
        isOffline: false
    });
    const [cityInput, setCityInput] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const colors = {
        primary: getColor(isDark ? 'dark' : 'light', 'primary'),
        foreground: getColor(isDark ? 'dark' : 'light', 'foreground'),
        mutedForeground: getColor(isDark ? 'dark' : 'light', 'muted-foreground'),
        card: getColor(isDark ? 'dark' : 'light', 'card'),
        border: getColor(isDark ? 'dark' : 'light', 'border'),
        background: getColor(isDark ? 'dark' : 'light', 'background'),
    };

    const loadWeather = useCallback(async (city?: string) => {
        setWeatherData(prev => ({ ...prev, isLoading: true, error: null }));

        const data = await weatherService.getCurrentWeather(city);
        setWeatherData(data);
    }, []);

    useEffect(() => {
        loadWeather();
    }, [loadWeather, i18n.language]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadWeather();
        setRefreshing(false);
    }, [loadWeather]);

    const handleCityChange = async () => {
        if (cityInput.trim()) {
            await loadWeather(cityInput.trim());
            setModalVisible(false);
            setCityInput('');
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return t('workouts.greetingMorning');
        if (hour < 18) return t('workouts.greetingAfternoon');
        return t('workouts.greetingEvening');
    };

    function formatDate (dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString([], { weekday: 'short', day: 'numeric' });
    }

    if (weatherData.isLoading) {
        return (
            <View className="bg-card rounded-2xl p-6 mb-6 border border-border/50 shadow-soft-2">
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (weatherData.error && !weatherData.current) {
        return (
            <View className="bg-card rounded-2xl p-6 mb-6 border border-border/50 shadow-soft-2">
                <Text className="text-muted-foreground text-center">
                    {weatherData.error}
                </Text>
                <TouchableOpacity
                    onPress={() => loadWeather()}
                    className="mt-4 bg-primary py-2 px-4 rounded-lg self-center"
                >
                    <Text className="text-primary-foreground font-medium">
                        {t('common.retry') || 'Retry'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <>
            <View className="bg-card rounded-2xl mb-6 border border-border/50 shadow-soft-2 overflow-hidden">
                {/* Header with location selector */}
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    className="flex-row items-center justify-between p-4 bg-primary/5"
                >
                    <View className="flex-row items-center gap-2">
                        <MapPin size={16} color={colors.primary} />
                        <Text className="text-foreground font-semibold text-base">
                            {weatherData.current?.city || 'Minsk'}
                        </Text>
                        {weatherData.isOffline && (
                            <View className="bg-warning/20 px-2 py-0.5 rounded-full">
                                <Text className="text-warning text-xs">Offline</Text>
                            </View>
                        )}
                    </View>
                    <RefreshCw size={16} color={colors.mutedForeground} />
                </TouchableOpacity>

                {/* Main weather info */}
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View className="p-6">
                        <Text className="text-muted-foreground text-sm mb-2">
                            {getGreeting()}
                        </Text>

                        {weatherData.current && (
                            <>
                                <View className="items-center mb-6">
                                    <Text className="text-6xl mb-2">
                                        {weatherService.getWeatherConditionIcon(
                                            weatherData.current.conditionCode,
                                            true
                                        )}
                                    </Text>
                                    <Text className="text-5xl font-bold text-foreground mb-2">
                                        {weatherService.formatTemperature(weatherData.current.temperature)}
                                    </Text>
                                    <Text className="text-lg text-foreground mb-1">
                                        {weatherData.current.condition}
                                    </Text>
                                    <Text className="text-muted-foreground">
                                        {t('weather.feels_like')} {weatherService.formatTemperature(weatherData.current.feelsLike)}
                                    </Text>
                                </View>

                                {/* Details grid */}
                                <View className="flex-row flex-wrap gap-4 mb-6">
                                    <View className="flex-1 min-w-[100px] flex-row items-center gap-3 bg-muted/30 p-3 rounded-xl">
                                        <Droplets size={20} color={colors.primary} />
                                        <View>
                                            <Text className="text-muted-foreground text-xs">
                                                {t('weather.humidity')}
                                            </Text>
                                            <Text className="text-foreground font-semibold">
                                                {weatherData.current.humidity}%
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-1 min-w-[100px] flex-row items-center gap-3 bg-muted/30 p-3 rounded-xl">
                                        <Wind size={20} color={colors.primary} />
                                        <View>
                                            <Text className="text-muted-foreground text-xs">
                                                {t('weather.wind')}
                                            </Text>
                                            <Text className="text-foreground font-semibold">
                                                {weatherData.current.windSpeed} km/h
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-1 min-w-[100px] flex-row items-center gap-3 bg-muted/30 p-3 rounded-xl">
                                        <Sunrise size={20} color={colors.primary} />
                                        <View>
                                            <Text className="text-muted-foreground text-xs">
                                                {t('weather.sunrise')}
                                            </Text>
                                            <Text className="text-foreground font-semibold">
                                                {weatherData.current.sunrise}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-1 min-w-[100px] flex-row items-center gap-3 bg-muted/30 p-3 rounded-xl">
                                        <Sunset size={20} color={colors.primary} />
                                        <View>
                                            <Text className="text-muted-foreground text-xs">
                                                {t('weather.sunset')}
                                            </Text>
                                            <Text className="text-foreground font-semibold">
                                                {weatherData.current.sunset}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </>
                        )}

                        {/* Forecast */}
                        {weatherData.forecast && weatherData.forecast.length > 0 && (
                            <View>
                                <Text className="text-foreground font-semibold mb-3">
                                    {t('weather.forecast')}
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <View className="flex-row gap-3">
                                        {weatherData.forecast.map((day, index) => (
                                            <View
                                                key={index}
                                                className="bg-muted/30 rounded-xl p-3 items-center min-w-[80px]"
                                            >
                                                <Text className="text-muted-foreground text-xs mb-1">
                                                    {index === 0 ? t('weather.today') : formatDate?.(day.date) || day.date.split('-')[2]}
                                                </Text>
                                                <Text className="text-2xl mb-1">
                                                    {weatherService.getWeatherConditionIcon(day.conditionCode, true)}
                                                </Text>
                                                <Text className="text-foreground font-semibold text-sm">
                                                    {weatherService.formatTemperature(day.temperatureMax)}
                                                </Text>
                                                <Text className="text-muted-foreground text-xs">
                                                    {weatherService.formatTemperature(day.temperatureMin)}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>

            {/* City selection modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/90">
                    <View className="bg-card rounded-2xl p-6 w-11/12 max-w-sm border border-border">
                        <Text className="text-foreground text-lg font-semibold mb-4">
                            {t('weather.select_city')}
                        </Text>
                        <TextInput
                            className="bg-input-background rounded-xl p-3 mb-4 text-foreground border border-border"
                            placeholder={t('weather.enter_city')}
                            placeholderTextColor={colors.mutedForeground}
                            value={cityInput}
                            onChangeText={setCityInput}
                            autoCapitalize="words"
                        />
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="flex-1 py-3 rounded-xl border border-border"
                            >
                                <Text className="text-muted-foreground text-center">
                                    {t('common.cancel')}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleCityChange}
                                className="flex-1 py-3 rounded-xl bg-primary"
                            >
                                <Text className="text-primary-foreground text-center font-semibold">
                                    {t('common.confirm')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );


};