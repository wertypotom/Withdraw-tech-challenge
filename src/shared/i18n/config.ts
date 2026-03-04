import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enWithdraw from "../../../locales/en/withdraw.json";
import ruWithdraw from "../../../locales/ru/withdraw.json";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  ns: ["withdraw"],
  defaultNS: "withdraw",
  resources: {
    en: { withdraw: enWithdraw },
    ru: { withdraw: ruWithdraw },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
