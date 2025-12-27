import React, { useState, useEffect } from "react";

const CurrencySelector = () => {
  const [currency, setCurrency] = useState(localStorage.getItem("preferredCurrency") || "USD");

  const handleCurrencyChange = (e) => {
    const selected = e.target.value;
    setCurrency(selected);
    localStorage.setItem("preferredCurrency", selected);
    window.dispatchEvent(new Event("currencyChanged")); // to notify other components
  };

  useEffect(() => {
    localStorage.setItem("preferredCurrency", currency);
  }, [currency]);

  return (
    <div className="flex items-center gap-2">
      {/* <label htmlFor="currency" className="font-medium text-gray-700">
        Preferred Currency:
      </label> */}
      <select
  id="currency"
  value={currency}
  onChange={handleCurrencyChange}
  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 max-h-48 overflow-y-auto"
>
  <option value="INR">INR (₹)</option>
  <option value="USD">USD ($)</option>
  <option value="EUR">EUR (€)</option>
  <option value="GBP">GBP (£)</option>
  <option value="JPY">JPY (¥)</option>
  <option value="AUD">AUD (A$)</option>
  <option value="CAD">CAD (C$)</option>
  <option value="CHF">CHF (Fr)</option>
  <option value="CNY">CNY (¥)</option>
  <option value="HKD">HKD (HK$)</option>
  <option value="NZD">NZD (NZ$)</option>
  <option value="SGD">SGD (S$)</option>
  <option value="SEK">SEK (kr)</option>
  <option value="NOK">NOK (kr)</option>
  <option value="DKK">DKK (kr)</option>
  <option value="ZAR">ZAR (R)</option>
  <option value="AED">AED (د.إ)</option>
  <option value="SAR">SAR (﷼)</option>
  <option value="THB">THB (฿)</option>
  <option value="KRW">KRW (₩)</option>
  <option value="MYR">MYR (RM)</option>
  <option value="PHP">PHP (₱)</option>
  <option value="IDR">IDR (Rp)</option>
  <option value="TRY">TRY (₺)</option>
  <option value="MXN">MXN ($)</option>
  <option value="BRL">BRL (R$)</option>
  <option value="RUB">RUB (₽)</option>
  <option value="PLN">PLN (zł)</option>
  <option value="CZK">CZK (Kč)</option>
  <option value="HUF">HUF (Ft)</option>
</select>

    </div>
  );
};

export default CurrencySelector;
