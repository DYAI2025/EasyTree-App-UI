import React from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
  CheckSquare,
  Square as SquareIcon,
  Users,
  Truck,
  AlertTriangle,
  Umbrella,
  MessageSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { Assignment, ChecklistItem, TimerState } from '../types';
import { TimerWidget } from '../components/TimerWidget';
import { WeatherCard } from '../components/WeatherCard';

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
  const handleLaunchNavigation = () => {
    onTriggerToast(
      'Navigation gestartet',
      `Route nach ${assignment.address} (${assignment.drivingMinutes} Min. Anfahrt) wird in Navigations-App geöffnet.`
    );
  };

  const formatSeconds = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-4">
      {/* A. Hauptkarte "Dein heutiger Einsatz" */}
      <section className="bg-[#1C201C] rounded-[20px] p-5 border border-[#34332D] shadow-inner relative overflow-hidden space-y-4">
        {/* Top-right Site Badge */}
        <div className="absolute top-0 right-0 p-4">
          <div className="w-10 h-10 rounded-lg bg-[#D6A875] flex items-center justify-center text-[#2B211A] font-extrabold text-base shadow-sm font-mono">
            {assignment.siteCode}
          </div>
        </div>

        {/* Eyebrow & Title */}
        <div className="pr-12">
          <h3 className="text-[#C48A4A] text-xs font-bold uppercase tracking-widest mb-1">
            Heutiger Einsatz
          </h3>
          <h2 className="text-2xl font-bold text-[#F1E8DC] leading-tight mb-1">
            {assignment.siteName}
          </h2>
          <p className="text-[#C2B3A0] text-xs font-normal">
            {assignment.address}
          </p>
        </div>

        {/* Key Time & Activity Stats Bar */}
        <div className="flex items-center gap-4 py-2 border-y border-[#34332D]/70">
          <div>
            <p className="text-[10px] text-[#918577] uppercase tracking-wider font-semibold">Beginn</p>
            <p className="font-mono text-base font-bold text-[#F1E8DC]">{assignment.startTime}</p>
          </div>
          <div className="h-8 w-[1px] bg-[#34332D]" />
          <div>
            <p className="text-[10px] text-[#918577] uppercase tracking-wider font-semibold">Ende</p>
            <p className="font-mono text-base font-bold text-[#F1E8DC]">{assignment.endTime}</p>
          </div>
          <div className="h-8 w-[1px] bg-[#34332D]" />
          <div className="min-w-0">
            <p className="text-[10px] text-[#918577] uppercase tracking-wider font-semibold">Tätigkeit</p>
            <p className="text-xs font-semibold text-[#D6A875] truncate">{assignment.activity}</p>
          </div>
        </div>

        {/* Live Timer Display Box */}
        <div className="bg-[#0B0C0B] rounded-xl p-3 border border-[#080908]">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px] text-[#918577] uppercase font-mono font-semibold">
              Laufende Arbeitszeit
            </span>
            <span className={`text-[11px] font-mono font-bold flex items-center gap-1 ${
              timer.isRunning ? 'text-[#7D8B55]' : 'text-[#C48A4A]'
            }`}>
              ● {timer.isRunning ? 'Aktiv' : 'Bereit'}
            </span>
          </div>
          <div className="text-3xl sm:text-4xl font-mono font-bold text-center tracking-tighter py-1 text-[#F1E8DC]">
            {formatSeconds(timer.elapsedSeconds)}
          </div>
        </div>

        {/* Timer Control Button */}
        {timer.isRunning ? (
          <button
            onClick={onStopTimer}
            disabled={isOffline}
            className={`w-full min-h-[52px] py-3.5 px-4 rounded-xl font-extrabold uppercase tracking-widest text-xs shadow-lg transition-all border-b-4 flex items-center justify-center gap-2 ${
              isOffline
                ? 'bg-[#272822] text-[#918577] border-[#34332D] cursor-not-allowed'
                : 'bg-[#B8413D] hover:bg-[#A33633] text-[#F1E8DC] border-[#8E2F2C] active:scale-[0.98] active:border-b-2 active:brightness-110'
            }`}
          >
            <span>Arbeitszeit stoppen</span>
          </button>
        ) : (
          <button
            onClick={onStartTimer}
            disabled={isOffline}
            className={`w-full min-h-[52px] py-3.5 px-4 rounded-xl font-extrabold uppercase tracking-widest text-xs shadow-lg transition-all border-b-4 flex items-center justify-center gap-2 ${
              isOffline
                ? 'bg-[#272822] text-[#918577] border-[#34332D] cursor-not-allowed'
                : 'bg-[#55735B] hover:bg-[#46614b] text-[#F1E8DC] border-[#3A523F] active:scale-[0.98] active:border-b-2 active:brightness-110'
            }`}
          >
            <span>Arbeitszeit starten</span>
          </button>
        )}

        {/* Navigation & Site details secondary links */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleLaunchNavigation}
            className="min-h-[48px] py-3 px-3 rounded-xl bg-[#272822] hover:bg-[#303129] active:bg-[#3d3e34] border border-[#34332D] text-xs font-bold text-[#F1E8DC] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs"
          >
            <Navigation className="w-4 h-4 text-[#5B7E86]" />
            <span>Navigation</span>
          </button>

          <button
            onClick={onOpenSiteDetail}
            className="min-h-[48px] py-3 px-3 rounded-xl bg-[#272822] hover:bg-[#303129] active:bg-[#3d3e34] border border-[#34332D] text-xs font-bold text-[#E8D2B5] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xs"
          >
            <span>Baustelle öffnen</span>
            <ExternalLink className="w-4 h-4 text-[#D6A875]" />
          </button>
        </div>
      </section>

      {/* B. Weather Warning Card */}
      <section className="bg-[#1C201C] rounded-[20px] p-4 border border-[#34332D] flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="text-[#C48A4A] shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase text-[#918577] tracking-widest font-semibold">Wetterwarnung</p>
            <p className="text-sm font-bold text-[#F1E8DC]">
              {typeof assignment.weather.warning === 'string'
                ? assignment.weather.warning
                : assignment.weather.warning?.event
                ? `${assignment.weather.warning.event} (Stufe ${assignment.weather.warning.level || 2})`
                : 'Windböen (Stufe 2)'}
            </p>
            <p className="text-[11px] text-[#C2B3A0]">
              {typeof assignment.weather.warning === 'object' && assignment.weather.warning?.validTo
                ? `Gültig bis ${assignment.weather.warning.validTo} • Max. ${assignment.weather.tempMax}°C`
                : `Gültig bis 18:00 Uhr • Max. ${assignment.weather.tempMax}°C`}
            </p>
          </div>
        </div>
        <button
          onClick={onOpenSiteDetail}
          className="min-h-[48px] min-w-[56px] px-3.5 py-2.5 rounded-xl bg-[#C48A4A] hover:bg-[#B3793B] text-[#2B211A] text-xs font-extrabold uppercase tracking-wider shrink-0 flex items-center justify-center active:scale-95 transition-all shadow-xs"
        >
          Details
        </button>
      </section>

      {/* C. Tasks / Checklist Section */}
      <section className="bg-[#141713] rounded-[20px] p-4 border border-[#34332D] space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] uppercase text-[#918577] tracking-widest font-bold">
            Nächste Aufgaben ({checklist.filter(c => c.completed).length}/{checklist.length})
          </h4>
          <span className="text-[10px] font-mono text-[#D6A875]">Tagesprotokoll</span>
        </div>

        <div className="space-y-2">
          {checklist.map((item) => (
            <button
              key={item.id}
              onClick={() => onToggleChecklist(item.id)}
              className="w-full min-h-[48px] p-3 rounded-xl bg-[#1C201C] hover:bg-[#272822] active:bg-[#303129] active:scale-[0.99] border border-[#34332D] text-left flex items-center gap-3 cursor-pointer transition-all group"
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
      </section>

      {/* D. Einsatzteam Section */}
      <section className="bg-[#141713] rounded-[20px] p-4 border border-[#34332D] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#D6A875]" />
            <h4 className="text-[10px] uppercase text-[#918577] tracking-widest font-bold">
              Einsatzteam ({assignment.team.length})
            </h4>
          </div>
          <button
            onClick={onOpenSiteDetail}
            className="min-h-[48px] px-2.5 py-1 text-xs text-[#D6A875] hover:underline flex items-center gap-1 font-bold active:scale-95 transition-all"
          >
            <span>Details</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {assignment.team.map((member) => (
            <div
              key={member.id}
              className="bg-[#1C201C] p-2.5 rounded-xl border border-[#34332D] flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-[#272822] text-[#D6A875] font-bold text-xs flex items-center justify-center shrink-0 border border-[#34332D]">
                {member.avatarInitials}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-[#F1E8DC] block truncate">
                  {member.name}
                </span>
                <span className="text-[10px] text-[#C2B3A0] block truncate">
                  {member.isLead ? '★ ' + member.role : member.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* E. Fahrzeuge & Geräte Section */}
      <section className="bg-[#141713] rounded-[20px] p-4 border border-[#34332D] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#D6A875]" />
            <h4 className="text-[10px] uppercase text-[#918577] tracking-widest font-bold">
              Fahrzeuge & Geräte ({assignment.resources.length})
            </h4>
          </div>
          <span className="text-[10px] text-[#7D8B55] font-mono font-bold">Einsatzbereit</span>
        </div>

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
      </section>

      {/* F. Schnellaktionen */}
      <div className="space-y-2 pt-1">
        <h4 className="text-[10px] uppercase text-[#918577] tracking-widest font-bold px-1">
          Schnellaktionen
        </h4>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={onOpenDamageReport}
            className="p-3 bg-[#1C201C] hover:bg-[#272822] active:bg-[#34352D] border border-[#34332D] active:border-[#C48A4A] rounded-xl flex flex-col items-center justify-center text-center gap-1.5 active:scale-95 transition-all min-h-[72px] shadow-xs"
          >
            <AlertTriangle className="w-5 h-5 text-[#C48A4A]" />
            <span className="text-[11px] font-bold text-[#F1E8DC] leading-tight">Schaden melden</span>
          </button>

          <button
            onClick={onOpenAbsence}
            className="p-3 bg-[#1C201C] hover:bg-[#272822] active:bg-[#34352D] border border-[#34332D] active:border-[#5B7E86] rounded-xl flex flex-col items-center justify-center text-center gap-1.5 active:scale-95 transition-all min-h-[72px] shadow-xs"
          >
            <Umbrella className="w-5 h-5 text-[#5B7E86]" />
            <span className="text-[11px] font-bold text-[#F1E8DC] leading-tight">Abwesenheit</span>
          </button>

          <button
            onClick={onOpenMessages}
            className="p-3 bg-[#1C201C] hover:bg-[#272822] active:bg-[#34352D] border border-[#34332D] active:border-[#D6A875] rounded-xl flex flex-col items-center justify-center text-center gap-1.5 active:scale-95 transition-all min-h-[72px] shadow-xs"
          >
            <MessageSquare className="w-5 h-5 text-[#D6A875]" />
            <span className="text-[11px] font-bold text-[#F1E8DC] leading-tight">Meldungen</span>
          </button>
        </div>
      </div>
    </div>
  );
};

