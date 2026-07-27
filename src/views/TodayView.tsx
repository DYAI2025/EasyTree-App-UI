import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  CheckSquare,
  Users,
  Truck,
  AlertTriangle,
  Umbrella,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CloudSun,
  Wind,
  Droplets,
  Phone,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Assignment, ChecklistItem, TimerState } from '../types';
import { SiteWeatherWidget } from '../components/SiteWeatherWidget';

interface TodayViewProps {
  assignment: Assignment;
  timer: TimerState;
  checklist: ChecklistItem[];
  isOffline: boolean;
  onStartTimer: () => void;
  onStopTimer: () => void;
  onToggleChecklist: (id: string) => void;
  onOpenSiteDetail: () => void;
  onOpenDamageReport: () => void;
  onOpenAbsence: () => void;
  onOpenMessages: () => void;
  onTriggerToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  assignment,
  timer,
  checklist,
  isOffline,
  onStartTimer,
  onStopTimer,
  onToggleChecklist,
  onOpenSiteDetail,
  onOpenDamageReport,
  onOpenAbsence,
  onOpenMessages,
  onTriggerToast
}) => {
  // Collapsible section states for uncluttered first-glance readability
  const [isWeatherExpanded, setIsWeatherExpanded] = useState<boolean>(false);
  const [isTasksExpanded, setIsTasksExpanded] = useState<boolean>(false);
  const [isTeamExpanded, setIsTeamExpanded] = useState<boolean>(false);
  const [isResourcesExpanded, setIsResourcesExpanded] = useState<boolean>(false);

  const handleLaunchNavigation = () => {
    onTriggerToast(
      'Navigation gestartet',
      `Route nach ${assignment.address} (${assignment.drivingMinutes} Min. Anfahrt) wird in Navigations-App geöffnet.`
    );
  };

  const handleCallMember = (name: string, phone: string) => {
    onTriggerToast('Anruf gestartet', `Wähle ${name} (${phone})...`);
  };

  const formatSeconds = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const completedTasksCount = checklist.filter((c) => c.completed).length;
  const teamLead = assignment.team.find((m) => m.isLead) || assignment.team[0];

  // Weather severe check for highlight pill
  const weather = assignment.weather;
  const isSevereWeather = weather.rainProbPct > 70 || weather.gustsKmH > 50 || weather.windKmH > 50;

  return (
    <div className="space-y-4 pb-24 px-4 pt-3">
      {/* ======================================================== */}
      {/* ERSTER BLICK: DAS WESENTLICHE (HERO DASHBOARD CARD)       */}
      {/* ======================================================== */}
      <section className="bg-[#1C201C] rounded-[24px] p-5 border border-[#34332D] shadow-xl relative overflow-hidden space-y-4">
        {/* Site Code Badge */}
        <div className="absolute top-4 right-4">
          <div className="w-10 h-10 rounded-xl bg-[#D6A875] flex items-center justify-center text-[#2B211A] font-black text-sm shadow-sm font-mono border border-[#E8D2B5]">
            {assignment.siteCode}
          </div>
        </div>

        {/* Title & Location Header */}
        <div className="pr-12">
          <div className="flex items-center gap-1.5 text-[#C48A4A] text-[10px] font-extrabold uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D6A875]" />
            <span>Heute • Einsatzplan</span>
          </div>
          <h2 className="text-2xl font-black text-[#F1E8DC] leading-tight tracking-tight">
            {assignment.siteName}
          </h2>
          <p className="text-[#C2B3A0] text-xs flex items-center gap-1 mt-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#D6A875] shrink-0" />
            <span className="truncate">{assignment.address}</span>
          </p>
        </div>

        {/* ======================================================== */}
        {/* DIE 4 WESENTLICHEN SÄULEN (4-GRID)                        */}
        {/* ======================================================== */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          {/* 1. BAUSTELLE */}
          <div className="bg-[#141713] p-3 rounded-2xl border border-[#34332D] flex flex-col justify-between">
            <span className="text-[10px] font-mono font-bold text-[#918577] uppercase tracking-wider block">
              1. Baustelle
            </span>
            <div className="mt-1">
              <span className="text-xs font-bold text-[#F1E8DC] block truncate">
                {assignment.activity}
              </span>
              <span className="text-[10px] text-[#D6A875] font-mono block mt-0.5">
                {assignment.startTime} - {assignment.endTime} Uhr
              </span>
            </div>
          </div>

          {/* 2. WETTER */}
          <button
            onClick={() => setIsWeatherExpanded(!isWeatherExpanded)}
            className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              isSevereWeather
                ? 'bg-[#281414] border-[#B8413D] shadow-sm'
                : 'bg-[#141713] border-[#34332D] hover:border-[#D6A875]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                isSevereWeather ? 'text-[#E57373]' : 'text-[#918577]'
              }`}>
                2. Wetter
              </span>
              {isSevereWeather && (
                <span className="text-[9px] bg-[#B8413D] text-[#F1E8DC] font-mono px-1.5 py-0.2 rounded font-bold uppercase animate-pulse">
                  Warnung
                </span>
              )}
            </div>
            <div className="mt-1">
              <span className="text-xs font-bold text-[#F1E8DC] block truncate">
                {weather.tempCurrent}°C • {weather.condition}
              </span>
              <span className={`text-[10px] font-mono block mt-0.5 truncate ${
                isSevereWeather ? 'text-[#E57373] font-bold' : 'text-[#7D8B55]'
              }`}>
                Böen {weather.gustsKmH} km/h • {weather.rainProbPct}% Regen
              </span>
            </div>
          </button>

          {/* 3. ANFAHRT */}
          <button
            onClick={handleLaunchNavigation}
            className="bg-[#141713] hover:bg-[#1C201C] active:scale-98 p-3 rounded-2xl border border-[#34332D] text-left flex flex-col justify-between transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#918577] uppercase tracking-wider">
                3. Anfahrt
              </span>
              <Navigation className="w-3.5 h-3.5 text-[#5B7E86] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="mt-1">
              <span className="text-xs font-bold text-[#F1E8DC] block truncate">
                {assignment.drivingMinutes} Min. Anfahrt
              </span>
              <span className="text-[10px] text-[#5B7E86] font-bold underline block mt-0.5">
                Route in App starten ➔
              </span>
            </div>
          </button>

          {/* 4. TEAM */}
          <button
            onClick={() => setIsTeamExpanded(!isTeamExpanded)}
            className="bg-[#141713] hover:bg-[#1C201C] p-3 rounded-2xl border border-[#34332D] text-left flex flex-col justify-between transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#918577] uppercase tracking-wider">
                4. Team
              </span>
              <span className="text-[10px] font-mono text-[#D6A875] font-bold">
                {assignment.team.length} Pers.
              </span>
            </div>
            <div className="mt-1">
              <span className="text-xs font-bold text-[#F1E8DC] block truncate">
                ★ {teamLead.name}
              </span>
              <span className="text-[10px] text-[#918577] block mt-0.5 truncate">
                {teamLead.role}
              </span>
            </div>
          </button>
        </div>

        {/* LIVE WORK TIMER BOX */}
        <div className="bg-[#0B0C0B] rounded-2xl p-3.5 border border-[#272822] space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-[#918577] uppercase font-mono font-bold tracking-wider">
              Arbeitszeiterfassung
            </span>
            <span className={`text-[11px] font-mono font-bold flex items-center gap-1.5 ${
              timer.isRunning ? 'text-[#7D8B55]' : 'text-[#C48A4A]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${timer.isRunning ? 'bg-[#7D8B55] animate-ping' : 'bg-[#C48A4A]'}`} />
              <span>{timer.isRunning ? 'Zeiterfassung Aktiv' : 'Bereit zum Start'}</span>
            </span>
          </div>

          <div className="text-3xl sm:text-4xl font-mono font-bold text-center tracking-tight text-[#F1E8DC] py-0.5">
            {formatSeconds(timer.elapsedSeconds)}
          </div>

          {/* Start/Stop Button */}
          {timer.isRunning ? (
            <button
              onClick={onStopTimer}
              disabled={isOffline}
              className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-md transition-all border-b-4 flex items-center justify-center gap-2 cursor-pointer ${
                isOffline
                  ? 'bg-[#272822] text-[#918577] border-[#34332D] cursor-not-allowed'
                  : 'bg-[#B8413D] hover:bg-[#A33633] text-[#F1E8DC] border-[#8E2F2C] active:scale-[0.98]'
              }`}
            >
              <span>Arbeitszeit Stoppen</span>
            </button>
          ) : (
            <button
              onClick={onStartTimer}
              disabled={isOffline}
              className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-black uppercase tracking-widest text-xs shadow-md transition-all border-b-4 flex items-center justify-center gap-2 cursor-pointer ${
                isOffline
                  ? 'bg-[#272822] text-[#918577] border-[#34332D] cursor-not-allowed'
                  : 'bg-[#55735B] hover:bg-[#46614b] text-[#F1E8DC] border-[#3A523F] active:scale-[0.98]'
              }`}
            >
              <span>Arbeitszeit Starten</span>
            </button>
          )}
        </div>

        {/* Secondary Navigation to full Site details */}
        <div className="flex justify-end pt-0.5">
          <button
            onClick={onOpenSiteDetail}
            className="text-xs font-bold text-[#D6A875] hover:text-[#F1E8DC] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Vollständige Baustellen-Akte öffnen</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>


      {/* ======================================================== */}
      {/* SEKUNDÄRE PUNKTE (EINKLAPPBAR / AUSKLAPPBAR)              */}
      {/* ======================================================== */}

      {/* 1. WETTER & ARBEITSSICHERHEIT DETAILS (EINKLAPPBAR) */}
      <section className="bg-[#141713] rounded-[20px] border border-[#34332D] overflow-hidden transition-all duration-300">
        <button
          onClick={() => setIsWeatherExpanded(!isWeatherExpanded)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1C201C] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl border ${
              isSevereWeather
                ? 'bg-[#281414] text-[#B8413D] border-[#B8413D]'
                : 'bg-[#272822] text-[#D6A875] border-[#34332D]'
            }`}>
              <CloudSun className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#F1E8DC]">
                Wetter & Arbeitssicherheit
              </h4>
              <p className="text-[10px] text-[#918577] font-mono">
                {isSevereWeather
                  ? '⚠️ Achtung: Wind/Regen-Warnung vorhanden'
                  : `${weather.tempCurrent}°C • Böen ${weather.gustsKmH} km/h • PSA OK`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#D6A875]">
              {isWeatherExpanded ? 'Einklappen' : 'Details ausklappen'}
            </span>
            {isWeatherExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#D6A875]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#D6A875]" />
            )}
          </div>
        </button>

        {isWeatherExpanded && (
          <div className="p-4 pt-0 border-t border-[#34332D]/60 animate-fadeIn">
            <div className="pt-3">
              <SiteWeatherWidget
                weather={assignment.weather}
                siteName={assignment.siteName}
                address={assignment.address}
                onOpenDetails={onOpenSiteDetail}
              />
            </div>
          </div>
        )}
      </section>

      {/* 2. AUFGABEN & TAGESPROTOKOLL (EINKLAPPBAR) */}
      <section className="bg-[#141713] rounded-[20px] border border-[#34332D] overflow-hidden transition-all duration-300">
        <button
          onClick={() => setIsTasksExpanded(!isTasksExpanded)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1C201C] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#272822] text-[#D6A875] border border-[#34332D]">
              <CheckSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#F1E8DC]">
                Nächste Aufgaben & Checklist
              </h4>
              <p className="text-[10px] text-[#918577] font-mono">
                {completedTasksCount} von {checklist.length} Aufgaben erledigt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#D6A875] bg-[#272822] px-2 py-0.5 rounded-full border border-[#34332D]">
              {completedTasksCount}/{checklist.length}
            </span>
            {isTasksExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#D6A875]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#D6A875]" />
            )}
          </div>
        </button>

        {isTasksExpanded && (
          <div className="p-4 pt-0 border-t border-[#34332D]/60 space-y-2 pt-3 animate-fadeIn">
            {checklist.map((item) => (
              <button
                key={item.id}
                onClick={() => onToggleChecklist(item.id)}
                className="w-full min-h-[48px] p-3 rounded-xl bg-[#1C201C] hover:bg-[#272822] active:bg-[#303129] border border-[#34332D] text-left flex items-center gap-3 cursor-pointer transition-all group"
              >
                <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${
                  item.completed
                    ? 'bg-[#D6A875] border-[#D6A875] text-[#2B211A]'
                    : 'bg-[#272822] border-[#34332D] group-hover:border-[#D6A875]/60'
                }`}>
                  {item.completed && <CheckSquare className="w-4 h-4 stroke-[2.5]" />}
                </div>
                <span className={`text-xs font-semibold ${
                  item.completed ? 'line-through text-[#918577]' : 'text-[#F1E8DC]'
                }`}>
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 3. EINSATZTEAM (EINKLAPPBAR) */}
      <section className="bg-[#141713] rounded-[20px] border border-[#34332D] overflow-hidden transition-all duration-300">
        <button
          onClick={() => setIsTeamExpanded(!isTeamExpanded)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1C201C] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#272822] text-[#D6A875] border border-[#34332D]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#F1E8DC]">
                Einsatzteam ({assignment.team.length} Personen)
              </h4>
              <p className="text-[10px] text-[#918577] font-mono">
                Vorarbeiter: {teamLead.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#D6A875]">
              {isTeamExpanded ? 'Einklappen' : 'Anzeigen'}
            </span>
            {isTeamExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#D6A875]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#D6A875]" />
            )}
          </div>
        </button>

        {isTeamExpanded && (
          <div className="p-4 pt-0 border-t border-[#34332D]/60 space-y-2 pt-3 animate-fadeIn">
            <div className="grid grid-cols-1 gap-2">
              {assignment.team.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#1C201C] p-3 rounded-xl border border-[#34332D] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#272822] text-[#D6A875] font-bold text-xs flex items-center justify-center shrink-0 border border-[#34332D]">
                      {member.avatarInitials}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-[#F1E8DC] block">
                        {member.name} {member.isLead && '★'}
                      </span>
                      <span className="text-[10px] text-[#C2B3A0] block">
                        {member.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCallMember(member.name, member.phone)}
                    className="p-2 rounded-xl bg-[#272822] text-[#D6A875] hover:bg-[#303129] border border-[#34332D] transition-all cursor-pointer active:scale-95"
                    title={`${member.name} anrufen`}
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 4. FAHRZEUGE & GERÄTE (EINKLAPPBAR) */}
      <section className="bg-[#141713] rounded-[20px] border border-[#34332D] overflow-hidden transition-all duration-300">
        <button
          onClick={() => setIsResourcesExpanded(!isResourcesExpanded)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-[#1C201C] transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#272822] text-[#D6A875] border border-[#34332D]">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-[#F1E8DC]">
                Fahrzeuge & Geräte ({assignment.resources.length})
              </h4>
              <p className="text-[10px] text-[#7D8B55] font-mono font-bold">
                ● Alle {assignment.resources.length} Einheiten einsatzbereit
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-[#D6A875]">
              {isResourcesExpanded ? 'Einklappen' : 'Anzeigen'}
            </span>
            {isResourcesExpanded ? (
              <ChevronUp className="w-4 h-4 text-[#D6A875]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#D6A875]" />
            )}
          </div>
        </button>

        {isResourcesExpanded && (
          <div className="p-4 pt-0 border-t border-[#34332D]/60 pt-3 animate-fadeIn">
            <div className="grid grid-cols-2 gap-2">
              {assignment.resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-[#1C201C] p-2.5 rounded-xl border border-[#34332D] flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-[#F1E8DC] block truncate">{res.code}</span>
                    <span className="text-[10px] text-[#918577] block truncate">{res.name}</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#7D8B55] shrink-0" title="Einsatzbereit" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 5. SCHNELLAKTIONEN (FOOTER)                              */}
      {/* ======================================================== */}
      <div className="space-y-2 pt-2">
        <h4 className="text-[10px] uppercase text-[#918577] tracking-widest font-extrabold px-1">
          Schnellaktionen
        </h4>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onOpenDamageReport}
            className="p-3 bg-[#1C201C] hover:bg-[#272822] active:bg-[#34352D] border border-[#34332D] active:border-[#C48A4A] rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 active:scale-95 transition-all min-h-[72px] shadow-xs cursor-pointer"
          >
            <AlertTriangle className="w-5 h-5 text-[#C48A4A]" />
            <span className="text-[11px] font-extrabold text-[#F1E8DC] leading-tight">Schaden melden</span>
          </button>

          <button
            onClick={onOpenAbsence}
            className="p-3 bg-[#1C201C] hover:bg-[#272822] active:bg-[#34352D] border border-[#34332D] active:border-[#5B7E86] rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 active:scale-95 transition-all min-h-[72px] shadow-xs cursor-pointer"
          >
            <Umbrella className="w-5 h-5 text-[#5B7E86]" />
            <span className="text-[11px] font-extrabold text-[#F1E8DC] leading-tight">Abwesenheit</span>
          </button>

          <button
            onClick={onOpenMessages}
            className="p-3 bg-[#1C201C] hover:bg-[#272822] active:bg-[#34352D] border border-[#34332D] active:border-[#D6A875] rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 active:scale-95 transition-all min-h-[72px] shadow-xs cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 text-[#D6A875]" />
            <span className="text-[11px] font-extrabold text-[#F1E8DC] leading-tight">Meldungen</span>
          </button>
        </div>
      </div>
    </div>
  );
};


