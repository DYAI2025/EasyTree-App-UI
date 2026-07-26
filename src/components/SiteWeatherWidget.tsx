import React from 'react';
import {
  CloudSun,
  Wind,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  Thermometer,
  ChevronRight,
  MapPin,
  CheckCircle2,
  CloudRain,
  Sun
} from 'lucide-react';
import { WeatherData } from '../types';

interface SiteWeatherWidgetProps {
  weather: WeatherData;
  siteName: string;
  address: string;
  onOpenDetails: () => void;
}

export const SiteWeatherWidget: React.FC<SiteWeatherWidgetProps> = ({
  weather,
  siteName,
  address,
  onOpenDetails
}) => {
  // Determine dominant weather icon
  const renderWeatherIcon = () => {
    const conditionLower = weather.condition.toLowerCase();
    if (conditionLower.includes('wind') || weather.gustsKmH >= 40) {
      return <Wind className="w-6 h-6 text-[#D6A875]" />;
    }
    if (conditionLower.includes('regen') || conditionLower.includes('schauer')) {
      return <CloudRain className="w-6 h-6 text-[#5B7E86]" />;
    }
    if (conditionLower.includes('sonne') || conditionLower.includes('klar')) {
      return <Sun className="w-6 h-6 text-[#C48A4A]" />;
    }
    return <CloudSun className="w-6 h-6 text-[#D6A875]" />;
  };

  // Severe weather threshold evaluation
  // Niederschlag über 70% ODER Windgeschwindigkeiten über 50 km/h
  const hasSevereRain = weather.rainProbPct > 70 || (weather.segmentsToday && weather.segmentsToday.some(s => s.rainProb > 70));
  const hasSevereWind = weather.windKmH > 50 || weather.gustsKmH > 50 || (weather.segmentsToday && weather.segmentsToday.some(s => s.windKmH > 50 || s.gustsKmH > 50));
  const hasSevereWeather = hasSevereRain || hasSevereWind;

  const isHighWind = weather.gustsKmH >= 45 || weather.windKmH >= 25;
  const isRainRisk = weather.rainProbPct >= 40 || weather.rainAmountMm >= 0.5;
  const warningObj = typeof weather.warning === 'object' ? weather.warning : null;

  return (
    <section className={`rounded-[20px] p-4.5 border transition-all duration-300 space-y-3.5 shadow-sm ${
      hasSevereWeather
        ? 'bg-[#281414] border-[#B8413D] shadow-lg shadow-[#B8413D]/20 ring-1 ring-[#B8413D]/40'
        : 'bg-[#1C201C] border-[#34332D]'
    }`}>
      {/* Red Critical Warning Banner */}
      {hasSevereWeather && (
        <div className="bg-[#B8413D] text-[#F1E8DC] rounded-2xl p-3.5 flex items-start gap-3 shadow-md border border-[#D65D5A]">
          <div className="p-1.5 bg-[#8E2F2C] rounded-xl shrink-0 mt-0.5 text-[#F1E8DC]">
            <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F1E8DC] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#F1E8DC]" />
                Achtung: Wetter-Warnung
              </span>
              <span className="text-[9px] bg-[#141713] text-[#F1E8DC] px-2 py-0.5 rounded font-mono font-extrabold uppercase shrink-0 border border-[#B8413D]">
                Gefahrenstufe Rot
              </span>
            </div>
            <p className="text-xs font-extrabold text-[#F1E8DC]">
              {hasSevereWind && hasSevereRain
                ? `Kritisch: Wind/Böen bis ${Math.max(weather.windKmH, weather.gustsKmH)} km/h (>50 km/h) & Regenrisiko ${weather.rainProbPct}% (>70%)`
                : hasSevereWind
                ? `Kritischer Wind: Böen bis ${Math.max(weather.windKmH, weather.gustsKmH)} km/h überschreiten Grenzwert (50 km/h)`
                : `Kritischer Niederschlag: Regenrisiko (${weather.rainProbPct}%) überschreitet Grenzwert (70%)`}
            </p>
            <p className="text-[11px] text-[#F1E8DC]/95 mt-1 leading-snug">
              Arbeitssicherheits-Protokoll: Höhenarbeiten, Klettern und Arbeiten mit Hubarbeitsbühnen sind sofort neu zu bewerten bzw. einzustellen!
            </p>
          </div>
        </div>
      )}

      {/* Header / Location Context */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`p-2 rounded-xl border shrink-0 ${
            hasSevereWeather
              ? 'bg-[#3D1A1A] text-[#B8413D] border-[#B8413D]/60'
              : 'bg-[#272822] text-[#D6A875] border-[#34332D]'
          }`}>
            <MapPin className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className={`text-[10px] font-bold uppercase tracking-wider truncate ${
                hasSevereWeather ? 'text-[#D65D5A]' : 'text-[#918577]'
              }`}>
                Baustellenwetter
              </h3>
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${
                hasSevereWeather ? 'bg-[#B8413D] animate-ping' : 'bg-[#7D8B55] animate-pulse'
              }`} />
            </div>
            <p className="text-xs font-bold text-[#F1E8DC] truncate">
              {siteName} <span className="text-[#918577] font-normal">({address.split(',')[1]?.trim() || address})</span>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenDetails}
          className={`min-h-[40px] px-2.5 py-1.5 text-xs rounded-xl border font-bold flex items-center gap-1 transition-all shrink-0 active:scale-95 ${
            hasSevereWeather
              ? 'bg-[#3D1A1A] text-[#F1E8DC] border-[#B8413D] hover:bg-[#4A2020]'
              : 'text-[#D6A875] hover:text-[#F1E8DC] hover:bg-[#272822] active:bg-[#34352D] border-[#34332D]'
          }`}
        >
          <span>Details</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Temperature & Condition Row */}
      <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
        hasSevereWeather
          ? 'bg-[#1F1010] border-[#B8413D]/50'
          : 'bg-[#141713] border-[#34332D]'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border shrink-0 ${
            hasSevereWeather
              ? 'bg-[#2A1616] border-[#B8413D]/60'
              : 'bg-[#1C201C] border-[#34332D]'
          }`}>
            {renderWeatherIcon()}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-[#F1E8DC] leading-none">
                {weather.tempCurrent}°C
              </span>
              <span className="text-[11px] font-mono text-[#918577]">
                {weather.tempMin}° / {weather.tempMax}°C
              </span>
            </div>
            <p className={`text-xs font-semibold capitalize mt-0.5 ${
              hasSevereWeather ? 'text-[#E57373]' : 'text-[#D6A875]'
            }`}>
              {weather.condition}
            </p>
          </div>
        </div>

        {/* Updated Timestamp */}
        <div className="text-right shrink-0">
          <span className="text-[9px] font-mono uppercase tracking-wider text-[#918577] block">Standort-Prognose</span>
          <span className={`text-[10px] font-mono font-bold ${
            hasSevereWeather ? 'text-[#B8413D]' : 'text-[#7D8B55]'
          }`}>● Live aktualisiert</span>
        </div>
      </div>

      {/* 3 Metric Cards: Wind, Rain, Humidity */}
      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
        {/* Wind & Gusts */}
        <div className={`p-2.5 rounded-xl border transition-colors ${
          weather.windKmH > 50 || weather.gustsKmH > 50
            ? 'bg-[#B8413D]/30 border-[#B8413D] text-[#F1E8DC]'
            : isHighWind
            ? 'bg-[#49372B]/60 border-[#C48A4A] text-[#F1E8DC]'
            : 'bg-[#141713] border-[#34332D] text-[#F1E8DC]'
        }`}>
          <div className="flex items-center gap-1 text-[#918577] mb-1 font-sans text-[10px]">
            <Wind className={`w-3.5 h-3.5 ${weather.gustsKmH > 50 || weather.windKmH > 50 ? 'text-[#B8413D]' : 'text-[#D6A875]'}`} />
            <span>Wind / Böen</span>
          </div>
          <span className="font-bold text-xs block">{weather.windKmH} km/h</span>
          <span className={`text-[10px] font-bold block ${
            weather.gustsKmH > 50 || weather.windKmH > 50 ? 'text-[#E57373]' : isHighWind ? 'text-[#C48A4A]' : 'text-[#918577]'
          }`}>
            Böen {weather.gustsKmH} km/h
          </span>
        </div>

        {/* Rain Probability */}
        <div className={`p-2.5 rounded-xl border transition-colors ${
          weather.rainProbPct > 70
            ? 'bg-[#B8413D]/30 border-[#B8413D] text-[#F1E8DC]'
            : isRainRisk
            ? 'bg-[#1C272C] border-[#5B7E86] text-[#F1E8DC]'
            : 'bg-[#141713] border-[#34332D] text-[#F1E8DC]'
        }`}>
          <div className="flex items-center gap-1 text-[#918577] mb-1 font-sans text-[10px]">
            <Droplets className={`w-3.5 h-3.5 ${weather.rainProbPct > 70 ? 'text-[#B8413D]' : 'text-[#5B7E86]'}`} />
            <span>Regenrisiko</span>
          </div>
          <span className="font-bold text-xs block">{weather.rainProbPct}%</span>
          <span className={`text-[10px] font-bold block ${weather.rainProbPct > 70 ? 'text-[#E57373]' : 'text-[#918577]'}`}>
            {weather.rainAmountMm} mm
          </span>
        </div>

        {/* Humidity / Air */}
        <div className={`p-2.5 rounded-xl border text-[#F1E8DC] ${
          hasSevereWeather ? 'bg-[#1F1010] border-[#B8413D]/40' : 'bg-[#141713] border-[#34332D]'
        }`}>
          <div className="flex items-center gap-1 text-[#918577] mb-1 font-sans text-[10px]">
            <Thermometer className="w-3.5 h-3.5 text-[#7D8B55]" />
            <span>Feuchte / UV</span>
          </div>
          <span className="font-bold text-xs block">{weather.humidityPct}% r.F.</span>
          <span className="text-[10px] text-[#7D8B55] block font-semibold">Ozon normal</span>
        </div>
      </div>

      {/* Weather Warning / Safety Assessment Box */}
      {warningObj ? (
        <div className={`border rounded-2xl p-3 flex items-start gap-3 shadow-xs ${
          hasSevereWeather
            ? 'bg-[#3D1A1A] border-[#B8413D]'
            : 'bg-[#2B211A] border-[#C48A4A]/80'
        }`}>
          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
            hasSevereWeather ? 'bg-[#B8413D]/30 text-[#B8413D]' : 'bg-[#C48A4A]/20 text-[#C48A4A]'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                hasSevereWeather ? 'text-[#E57373]' : 'text-[#C48A4A]'
              }`}>
                Arbeitssicherheit & Wetterwarnung ({warningObj.source})
              </span>
              <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                hasSevereWeather ? 'bg-[#B8413D] text-[#F1E8DC]' : 'bg-[#C48A4A] text-[#2B211A]'
              }`}>
                Stufe {warningObj.level}
              </span>
            </div>
            <p className="text-xs font-bold text-[#F1E8DC]">
              {warningObj.event} ({warningObj.validFrom} bis {warningObj.validTo})
            </p>
            <p className="text-[11px] text-[#C2B3A0] leading-snug">
              {warningObj.description}
            </p>
            <div className={`pt-1 flex items-center gap-1 text-[10px] font-bold ${
              hasSevereWeather ? 'text-[#E57373]' : 'text-[#D6A875]'
            }`}>
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span>Sicherheitsvorgabe: Freigabe von Kletter- & Hebearbeiten vor Ort prüfen!</span>
            </div>
          </div>
        </div>
      ) : isHighWind ? (
        <div className={`border rounded-2xl p-3 flex items-start gap-2.5 ${
          hasSevereWeather ? 'bg-[#3D1A1A] border-[#B8413D]' : 'bg-[#2B211A] border-[#C48A4A]/60'
        }`}>
          <ShieldAlert className={`w-4 h-4 shrink-0 mt-0.5 ${hasSevereWeather ? 'text-[#B8413D]' : 'text-[#C48A4A]'}`} />
          <div className="text-xs">
            <span className="font-bold text-[#F1E8DC] block">Achtung: Windböen bis {weather.gustsKmH} km/h</span>
            <span className="text-[#C2B3A0] text-[11px] block">Erhöhte Aufmerksamkeit bei Baumpflege & Hubarbeitsbühnen erforderlich.</span>
          </div>
        </div>
      ) : (
        <div className="bg-[#141713] border border-[#34332D] rounded-2xl p-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7D8B55] shrink-0" />
            <span className="text-[#F1E8DC] font-semibold text-[11px]">
              Gute Wetterbedingungen für geplante Außenarbeiten
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#7D8B55] font-bold uppercase">PSA freigegeben</span>
        </div>
      )}
    </section>
  );
};
