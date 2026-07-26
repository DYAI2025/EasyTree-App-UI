import React, { useState } from 'react';
import { CloudSun, Wind, Droplets, AlertTriangle, ChevronDown, ChevronUp, Sun, Cloud, CloudRain } from 'lucide-react';
import { WeatherData, WeatherSegment } from '../types';
import { TemperatureChart } from './TemperatureChart';

interface WeatherCardProps {
  weather: WeatherData;
  onOpenFullWeather?: () => void;
  showFullDetailsInitially?: boolean;
}

export const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  onOpenFullWeather,
  showFullDetailsInitially = false
}) => {
  const [activeTab, setActiveTab] = useState<'heute' | 'morgen'>('heute');
  const [isExpanded, setIsExpanded] = useState(showFullDetailsInitially);

  const activeSegments = activeTab === 'heute' ? weather.segmentsToday : weather.segmentsTomorrow;

  const getIcon = (type: WeatherSegment['iconType']) => {
    switch (type) {
      case 'sun':
        return <Sun className="w-5 h-5 text-[#C48A4A]" />;
      case 'partly-cloudy':
        return <CloudSun className="w-5 h-5 text-[#D6A875]" />;
      case 'rain':
        return <CloudRain className="w-5 h-5 text-[#5B7E86]" />;
      case 'wind':
        return <Wind className="w-5 h-5 text-[#C48A4A]" />;
      case 'cloudy':
      default:
        return <Cloud className="w-5 h-5 text-[#C2B3A0]" />;
    }
  };

  return (
    <div className="charred-wood-card p-4 rounded-2xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CloudSun className="w-5 h-5 text-[#D6A875]" />
          <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">
            Baustellen-Wetter (Park Sanssouci)
          </h3>
        </div>
        <span className="text-[10px] text-[#918577] font-mono">
          Aktualisiert {weather.updatedAt}
        </span>
      </div>

      {/* Main Temp & Condition Summary */}
      <div className="flex items-center justify-between bg-[#141713] p-3 rounded-xl border border-[#34332D]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#272822] rounded-xl border border-[#34332D]">
            <CloudSun className="w-8 h-8 text-[#D6A875]" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#F1E8DC] font-mono">{weather.tempCurrent}°C</span>
              <span className="text-xs text-[#918577] font-mono">({weather.tempMin}–{weather.tempMax}°C)</span>
            </div>
            <span className="text-xs text-[#C2B3A0] font-medium block capitalize">
              {weather.condition}
            </span>
          </div>
        </div>

        <div className="text-right text-xs space-y-1">
          <div className="flex items-center justify-end gap-1 text-[#C2B3A0]">
            <Droplets className="w-3.5 h-3.5 text-[#5B7E86]" />
            <span className="font-mono">{weather.rainProbPct}% ({weather.rainAmountMm} mm)</span>
          </div>
          <div className="flex items-center justify-end gap-1 text-[#C2B3A0]">
            <Wind className="w-3.5 h-3.5 text-[#C48A4A]" />
            <span className="font-mono">{weather.windKmH} km/h (Böen {weather.gustsKmH})</span>
          </div>
        </div>
      </div>

      {/* Official Weather Warning Banner (DWD Orange) */}
      {weather.warning && (
        <div className="mt-3 bg-[#C48A4A]/15 border border-[#C48A4A]/50 p-3 rounded-xl flex items-start gap-2.5">
          <div className="p-1.5 bg-[#C48A4A]/20 rounded-lg text-[#C48A4A] shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#F1E8DC]">
                  DWD Warnung: {weather.warning.event}
                </span>
                <span className="text-[10px] font-extrabold bg-[#C48A4A] text-[#0B0C0B] px-1.5 py-0.2 rounded-xs uppercase">
                  Stufe 2 (Orange)
                </span>
              </div>
              <span className="text-[10px] text-[#D6A875] font-mono font-bold">
                {weather.warning.validFrom} – {weather.warning.validTo}
              </span>
            </div>
            <p className="text-[11px] text-[#C2B3A0] mt-1 leading-snug">
              {weather.warning.description}
            </p>
            <div className="mt-1.5 text-[10px] text-[#D6A875] font-medium bg-[#141713]/60 px-2 py-0.5 rounded-md inline-block border border-[#34332D]">
              {weather.warning.informativeOnly ? 'Informative Warnung – keine automatische Einsatzabsage' : 'Achtung: Einsatzabsage möglich'}
            </div>
          </div>
        </div>
      )}

      {/* Toggle Expand / Switch to Detail */}
      <div className="mt-3 pt-2 border-t border-[#34332D] flex items-center justify-between">
        <button
          onClick={() => {
            if (onOpenFullWeather) {
              onOpenFullWeather();
            } else {
              setIsExpanded(!isExpanded);
            }
          }}
          className="text-xs text-[#D6A875] font-semibold flex items-center gap-1 hover:underline py-1"
        >
          <span>{isExpanded ? 'Tagesverlauf einklappen' : 'Vollständigen Tagesverlauf anzeigen'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        <span className="text-[10px] text-[#918577]">
          Ozon: {weather.ozoneForecast}
        </span>
      </div>

      {/* Expanded 6-Segment Breakdown View */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-[#34332D] space-y-3 animate-in fade-in duration-200">
          {/* Day Segments Tab Selector */}
          <div className="grid grid-cols-2 gap-1 bg-[#141713] p-1 rounded-xl border border-[#34332D]">
            <button
              onClick={() => setActiveTab('heute')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'heute'
                  ? 'bg-[#E8D2B5] text-[#2B211A]'
                  : 'text-[#C2B3A0] hover:text-[#F1E8DC]'
              }`}
            >
              Heute (27.07.)
            </button>
            <button
              onClick={() => setActiveTab('morgen')}
              className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                activeTab === 'morgen'
                  ? 'bg-[#E8D2B5] text-[#2B211A]'
                  : 'text-[#C2B3A0] hover:text-[#F1E8DC]'
              }`}
            >
              Morgen (28.07.)
            </button>
          </div>

          {/* D3 Temperature Trend Chart for Heute */}
          {activeTab === 'heute' && (
            <TemperatureChart />
          )}

          {/* 6 Segments Breakdown List */}
          <div className="space-y-2">
            <span className="text-[11px] text-[#918577] font-semibold block">
              Prognose in 6 Tagesabschnitten (Einsatzzeit hervorgehoben):
            </span>
            {activeSegments.map((seg, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border transition-all ${
                  seg.isAssignmentTime
                    ? 'bg-[#272822] border-[#D6A875]/50 shadow-xs'
                    : 'bg-[#141713] border-[#34332D] opacity-80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(seg.iconType)}
                    <div>
                      <span className="text-xs font-bold text-[#F1E8DC] font-mono">{seg.timeSlot}</span>
                      {seg.isAssignmentTime && (
                        <span className="ml-2 text-[9px] font-extrabold uppercase bg-[#55735B] text-[#F1E8DC] px-1.5 py-0.2 rounded-xs">
                          Einsatzzeit
                        </span>
                      )}
                      <p className="text-[11px] text-[#C2B3A0] capitalize">{seg.condition}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-[#F1E8DC] font-mono">
                      {seg.tempMin}–{seg.tempMax}°C
                    </div>
                    <div className="text-[10px] text-[#918577] font-mono space-x-1">
                      <span>Regen {seg.rainProb}%</span>
                      <span>•</span>
                      <span>Wind {seg.windKmH} km/h</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Source & Ozone note */}
          <div className="bg-[#141713] p-2.5 rounded-xl border border-[#34332D] text-[11px] text-[#918577] space-y-1">
            <div className="flex justify-between">
              <span>Luftfeuchtigkeit: {weather.humidityPct}%</span>
              <span>Ozonprognose: {weather.ozoneForecast}</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span>Quelle: Deutscher Wetterdienst (DWD)</span>
              <span className="text-[#55735B]">Status: {weather.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
