import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./translations/en.json";
import ru from "./translations/ru.json";

const resources = {
    ru: { translation: ru, },
    en: { translation: en, },
};

i18n.use(initReactI18next)
    .init({
        resources,
        lng: "en", //default
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;