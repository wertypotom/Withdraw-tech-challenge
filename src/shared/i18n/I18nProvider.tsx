"use client";

import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";

import enWithdraw from "../../../locales/en/withdraw.json";
import ruWithdraw from "../../../locales/ru/withdraw.json";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: "en",
    fallbackLng: "en",
    ns: ["withdraw"],
    defaultNS: "withdraw",
    resources: {
      en: { withdraw: enWithdraw },
      ru: { withdraw: ruWithdraw },
    },
    interpolation: { escapeValue: false },
  });
}

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
