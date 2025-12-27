import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem("language", e.target.value);
  };

  React.useEffect(() => {
    const savedLang = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLang);
  }, [i18n]);

  return (
    <select
      onChange={changeLanguage}
      defaultValue={localStorage.getItem("language") || "en"}
      className="border p-2 rounded-md bg-white shadow-sm"
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
      <option value="de">Deutsch</option>
      <option value="zh">中文</option>
    </select>
  );
};

export default LanguageSelector;
