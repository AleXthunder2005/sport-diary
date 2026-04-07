import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageService {
    private KEYS = {
        LANGUAGE: "app_language",
        THEME: "app_theme",
    };

    async setLanguage(lang: string) {
        try {
            await AsyncStorage.setItem(this.KEYS.LANGUAGE, lang);
        } catch (e) {
            console.log("Error saving language", e);
        }
    }

    async getLanguage(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(this.KEYS.LANGUAGE);
        } catch (e) {
            console.log("Error getting language", e);
            return null;
        }
    }

    async setTheme(theme: string) {
        try {
            await AsyncStorage.setItem(this.KEYS.THEME, theme);
        } catch (e) {
            console.log("Error saving theme", e);
        }
    }

    async getTheme(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(this.KEYS.THEME);
        } catch (e) {
            console.log("Error getting theme", e);
            return null;
        }
    }

    // ===== generic methods =====
    async setItem(key: string, value: any) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.log("Error saving item", e);
        }
    }

    async getItem<T>(key: string): Promise<T | null> {
        try {
            const value = await AsyncStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.log("Error getting item", e);
            return null;
        }
    }

    async removeItem(key: string) {
        try {
            await AsyncStorage.removeItem(key);
        } catch (e) {
            console.log("Error removing item", e);
        }
    }

    async clearAll() {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            console.log("Error clearing AsyncStorage", e);
        }
    }
}

export const preferencesStorage = new StorageService();