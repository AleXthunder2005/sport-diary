import { preferencesStorage } from '@/app/storages/preferencesStorage';

// Типы данных для погоды
export interface WeatherData {
    city: string;
    temperature: number;
    feelsLike: number;
    condition: string;
    conditionCode: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    sunrise: string;
    sunset: string;
    icon: string;
    timestamp: number;
    language: string;
}

export interface ForecastData {
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    condition: string;
    conditionCode: number;
    icon: string;
}

class WeatherApi {
    private API_KEY = '4ab935649d6b82845210edbbd73731f0';
    private BASE_URL = 'https://api.openweathermap.org/data/2.5';
    private CACHE_KEYS = {
        WEATHER: 'weather_cache_',
        FORECAST: 'forecast_cache_'
    };

    // Получение текущей погоды
    async getCurrentWeather(city: string, language: string): Promise<WeatherData | null> {
        try {
            const url = `${this.BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric&lang=${language === 'ru' ? 'ru' : 'en'}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();

            const weatherData: WeatherData = {
                city: data.name,
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                condition: data.weather[0].description,
                conditionCode: data.weather[0].id,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 3.6), // конвертация в км/ч
                pressure: data.main.pressure,
                sunrise: this.formatTime(data.sys.sunrise, data.timezone),
                sunset: this.formatTime(data.sys.sunset, data.timezone),
                icon: data.weather[0].icon,
                timestamp: Date.now(),
                language: language
            };

            // Сохраняем в кэш
            await this.cacheWeather(city, weatherData);

            return weatherData;
        } catch (error) {
            console.error('Error fetching current weather:', error);
            // Пытаемся получить из кэша
            return await this.getCachedWeather(city, language);
        }
    }

    // Получение прогноза на 5 дней
    async getForecast(city: string, language: string): Promise<ForecastData[] | null> {
        try {
            const url = `${this.BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric&lang=${language === 'ru' ? 'ru' : 'en'}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Forecast API error: ${response.status}`);
            }

            const data = await response.json();

            // Группируем прогноз по дням
            const dailyForecasts = new Map<string, ForecastData>();

            data.list.forEach((item: any) => {
                const date = item.dt_txt.split(' ')[0];
                const temp = Math.round(item.main.temp);
                const condition = item.weather[0].description;
                const conditionCode = item.weather[0].id;
                const icon = item.weather[0].icon;

                if (!dailyForecasts.has(date)) {
                    dailyForecasts.set(date, {
                        date: date,
                        temperatureMax: temp,
                        temperatureMin: temp,
                        condition: condition,
                        conditionCode: conditionCode,
                        icon: icon
                    });
                } else {
                    const existing = dailyForecasts.get(date)!;
                    existing.temperatureMax = Math.max(existing.temperatureMax, temp);
                    existing.temperatureMin = Math.min(existing.temperatureMin, temp);
                }
            });

            const forecasts = Array.from(dailyForecasts.values()).slice(0, 5);

            // Сохраняем в кэш
            await this.cacheForecast(city, forecasts);

            return forecasts;
        } catch (error) {
            console.error('Error fetching forecast:', error);
            // Пытаемся получить из кэша
            return await this.getCachedForecast(city);
        }
    }

    // Получение погоды по координатам
    async getWeatherByCoords(lat: number, lon: number, language: string): Promise<WeatherData | null> {
        try {
            const url = `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric&lang=${language === 'ru' ? 'ru' : 'en'}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`);
            }

            const data = await response.json();

            const weatherData: WeatherData = {
                city: data.name,
                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                condition: data.weather[0].description,
                conditionCode: data.weather[0].id,
                humidity: data.main.humidity,
                windSpeed: Math.round(data.wind.speed * 3.6),
                pressure: data.main.pressure,
                sunrise: this.formatTime(data.sys.sunrise, data.timezone),
                sunset: this.formatTime(data.sys.sunset, data.timezone),
                icon: data.weather[0].icon,
                timestamp: Date.now(),
                language: language
            };

            await this.cacheWeather(data.name, weatherData);

            return weatherData;
        } catch (error) {
            console.error('Error fetching weather by coords:', error);
            return null;
        }
    }

    // Вспомогательные методы для кэширования
    private async cacheWeather(city: string, data: WeatherData): Promise<void> {
        const key = `${this.CACHE_KEYS.WEATHER}${city.toLowerCase()}`;
        await preferencesStorage.setItem(key, data);
    }

    private async getCachedWeather(city: string, language: string): Promise<WeatherData | null> {
        const key = `${this.CACHE_KEYS.WEATHER}${city.toLowerCase()}`;
        const cached = await preferencesStorage.getItem<WeatherData>(key);

        if (cached && cached.language === language) {
            return cached;
        }

        return null;
    }

    private async cacheForecast(city: string, data: ForecastData[]): Promise<void> {
        const key = `${this.CACHE_KEYS.FORECAST}${city.toLowerCase()}`;
        await preferencesStorage.setItem(key, data);
    }

    private async getCachedForecast(city: string): Promise<ForecastData[] | null> {
        const key = `${this.CACHE_KEYS.FORECAST}${city.toLowerCase()}`;
        return await preferencesStorage.getItem<ForecastData[]>(key);
    }

    private formatTime(timestamp: number, timezone: number): string {
        const date = new Date((timestamp + timezone) * 1000);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

export const weatherApi = new WeatherApi();