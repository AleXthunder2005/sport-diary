import { weatherApi, WeatherData, ForecastData } from '../../api/wheather/wheatherApi';
import { preferencesStorage } from '@/app/storages/preferencesStorage';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

export interface WeatherDisplayData {
    current: WeatherData | null;
    forecast: ForecastData[] | null;
    isLoading: boolean;
    error: string | null;
    isOffline: boolean;
}

class WeatherService {
    private static instance: WeatherService;
    private defaultCity = 'Minsk';
    private lastCity: string = this.defaultCity;

    static getInstance(): WeatherService {
        if (!WeatherService.instance) {
            WeatherService.instance = new WeatherService();
        }
        return WeatherService.instance;
    }

    async checkInternetConnection(): Promise<boolean> {
        const netInfo = await NetInfo.fetch();
        return netInfo.isConnected === true;
    }

    private async showNoInternetAlert() {
        const language = await preferencesStorage.getLanguage();
        const message = language === 'ru'
            ? 'Отсутствует интернет соединение. Отображаются кэшированные данные.'
            : 'No internet connection. Showing cached data.';

        Alert.alert(
            language === 'ru' ? 'Нет соединения' : 'No Connection',
            message
        );
    }

    async getCurrentWeather(city?: string): Promise<WeatherDisplayData> {
        const targetCity = city || this.lastCity;
        const hasInternet = await this.checkInternetConnection();
        const language = await preferencesStorage.getLanguage() || 'en';

        if (!hasInternet) {
            await this.showNoInternetAlert();
            // Пытаемся получить кэшированные данные
            const cachedWeather = await this.getCachedWeather(targetCity, language);
            const cachedForecast = await this.getCachedForecast(targetCity);

            return {
                current: cachedWeather,
                forecast: cachedForecast,
                isLoading: false,
                error: cachedWeather ? null : 'No cached data available',
                isOffline: true
            };
        }

        try {
            // Параллельно запрашиваем текущую погоду и прогноз
            const [currentWeather, forecast] = await Promise.all([
                weatherApi.getCurrentWeather(targetCity, language),
                weatherApi.getForecast(targetCity, language)
            ]);

            if (currentWeather) {
                this.lastCity = currentWeather.city;
            }

            return {
                current: currentWeather,
                forecast: forecast,
                isLoading: false,
                error: currentWeather ? null : 'Failed to load weather data',
                isOffline: false
            };
        } catch (error) {
            console.error('Error in weather service:', error);
            return {
                current: null,
                forecast: null,
                isLoading: false,
                error: 'Failed to load weather data',
                isOffline: false
            };
        }
    }

    async getWeatherByCoords(lat: number, lon: number): Promise<WeatherDisplayData> {
        const hasInternet = await this.checkInternetConnection();
        const language = await preferencesStorage.getLanguage() || 'en';

        if (!hasInternet) {
            await this.showNoInternetAlert();
            return {
                current: null,
                forecast: null,
                isLoading: false,
                error: 'No internet connection',
                isOffline: true
            };
        }

        try {
            const currentWeather = await weatherApi.getWeatherByCoords(lat, lon, language);

            if (currentWeather) {
                this.lastCity = currentWeather.city;
                const forecast = await weatherApi.getForecast(currentWeather.city, language);

                return {
                    current: currentWeather,
                    forecast: forecast,
                    isLoading: false,
                    error: null,
                    isOffline: false
                };
            }

            return {
                current: null,
                forecast: null,
                isLoading: false,
                error: 'Failed to get location weather',
                isOffline: false
            };
        } catch (error) {
            console.error('Error getting weather by coords:', error);
            return {
                current: null,
                forecast: null,
                isLoading: false,
                error: 'Failed to load weather data',
                isOffline: false
            };
        }
    }

    async updateCity(city: string): Promise<WeatherDisplayData> {
        this.lastCity = city;
        return await this.getCurrentWeather(city);
    }

    private async getCachedWeather(city: string, language: string): Promise<WeatherData | null> {
        const key = `weather_cache_${city.toLowerCase()}`;
        const cached = await preferencesStorage.getItem<WeatherData>(key);

        if (cached && cached.language === language) {
            return cached;
        }

        return null;
    }

    private async getCachedForecast(city: string): Promise<ForecastData[] | null> {
        const key = `forecast_cache_${city.toLowerCase()}`;
        return await preferencesStorage.getItem<ForecastData[]>(key);
    }

    getWeatherConditionIcon(conditionCode: number, isDay: boolean = true): string {
        // Thunderstorm
        if (conditionCode >= 200 && conditionCode < 300) return '⛈️';
        // Drizzle
        if (conditionCode >= 300 && conditionCode < 400) return '🌧️';
        // Rain
        if (conditionCode >= 500 && conditionCode < 600) return '🌧️';
        // Snow
        if (conditionCode >= 600 && conditionCode < 700) return '❄️';
        // Atmosphere (fog, mist, etc.)
        if (conditionCode >= 700 && conditionCode < 800) return '🌫️';
        // Clear
        if (conditionCode === 800) return isDay ? '☀️' : '🌙';
        // Clouds
        if (conditionCode === 801) return '🌤️';
        if (conditionCode === 802) return '⛅';
        if (conditionCode >= 803) return '☁️';

        return '🌡️';
    }

    formatTemperature(temp: number, language?: string): string {
        return `${temp > 0 ? '+' : ''}${temp}°`;
    }
}

export const weatherService = WeatherService.getInstance();