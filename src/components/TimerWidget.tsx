import React from 'react';
import { Play, Square, Clock, AlertCircle } from 'lucide-react';
import { TimerState } from '../types';

interface TimerWidgetProps {
  timer: TimerState;
  isOffline: boolean;
  onStartTimer: () => void;
  onStopTimer: () => void;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({
  timer,
  isOffline,
  onStartTimer,
  onStopTimer
}) => {
  const formatSeconds = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!timer.isRunning && timer.history.length === 0) {
    return (
      <div className="charred-wood-card p-4 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#D6A875]" />
            <span className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">Arbeitszeiterfassung</span>
          </div>
          <span className="text-[11px] text-[#918577]">Bereit für Einsatz</span>
        </div>

        <p className="text-xs text-[#C2B3A0] mb-3">
          Starte den Timer bei Beginn deiner Tätigkeit auf der Baustelle.
        </p>

        <button
          onClick={onStartTimer}
          disabled={isOffline}
          className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
            isOffline
              ? 'bg-[#272822] text-[#918577] border border-[#34332D] cursor-not-allowed'
              : 'bg-[#55735B] hover:bg-[#55735B]/90 text-[#F1E8DC] active:scale-98'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Arbeitszeit starten</span>
        </button>
        {isOffline && (
          <p className="text-[11px] text-[#B8413D] mt-1.5 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>Offline-Modus aktiv: Zeiterfassung gesperrt</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="charred-wood-card p-4 rounded-2xl relative overflow-hidden border border-[#D6A875]/30">
      {/* Background subtle glow when timer is running */}
      {timer.isRunning && (
        <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#55735B]/10 rounded-full blur-xl pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {timer.isRunning ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#55735B] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#55735B]" />
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C48A4A]" />
            )}
          </span>
          <span className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">
            {timer.isRunning ? 'Laufender Einsatz' : 'Einsatz beendet'}
          </span>
        </div>

        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
          timer.isRunning
            ? 'bg-[#55735B]/20 text-[#D6A875] border-[#55735B]/40'
            : 'bg-[#C48A4A]/20 text-[#C48A4A] border-[#C48A4A]/40'
        }`}>
          {timer.isRunning ? 'Aktiv' : 'Zur Freigabe'}
        </span>
      </div>

      <div className="bg-[#141713] p-3 rounded-xl border border-[#34332D] mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs text-[#C2B3A0] font-medium truncate">
            {timer.siteName || 'Park Sanssouci'}
          </span>
          <span className="text-[11px] text-[#918577] font-mono">
            Start: {timer.startTime || '08:00 Uhr'}
          </span>
        </div>

        {/* Live ticking display in IBM Plex / Mono font */}
        <div className="text-3xl font-mono font-extrabold text-[#F1E8DC] tracking-wider my-1 text-center py-1 bg-[#0B0C0B] rounded-lg border border-[#272822]">
          {formatSeconds(timer.elapsedSeconds)}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] text-[#918577] flex items-center gap-1">
          <AlertCircle className="w-3 h-3 text-[#D6A875] shrink-0" />
          Nur ein Timer kann gleichzeitig laufen.
        </span>
      </div>

      {timer.isRunning ? (
        <button
          onClick={onStopTimer}
          disabled={isOffline}
          className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
            isOffline
              ? 'bg-[#272822] text-[#918577] border border-[#34332D] cursor-not-allowed'
              : 'bg-[#B8413D] hover:bg-[#B8413D]/90 text-[#F1E8DC] active:scale-98'
          }`}
        >
          <Square className="w-4 h-4 fill-current" />
          <span>Arbeitszeit stoppen</span>
        </button>
      ) : (
        <button
          onClick={onStartTimer}
          disabled={isOffline}
          className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all ${
            isOffline
              ? 'bg-[#272822] text-[#918577] border border-[#34332D] cursor-not-allowed'
              : 'bg-[#55735B] hover:bg-[#55735B]/90 text-[#F1E8DC] active:scale-98'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Neuen Einsatz starten</span>
        </button>
      )}

      {/* History log summary if any completed timers */}
      {timer.history.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#34332D]">
          <span className="text-[11px] text-[#C2B3A0] font-semibold block mb-1">
            Heute erfasst ({timer.history.length}):
          </span>
          {timer.history.map((item) => (
            <div key={item.id} className="text-[11px] text-[#918577] flex items-center justify-between py-0.5">
              <span>{item.startTime} – {item.endTime} ({item.durationStr})</span>
              <span className="text-[#55735B] font-medium">{item.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
