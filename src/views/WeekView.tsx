import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronRight,
  Send,
  X,
  Check,
  Zap,
  ShieldCheck,
  Building2,
  MapPin
} from 'lucide-react';
import { WeekDayPlan } from '../types';

interface WeekViewProps {
  weekPlan: WeekDayPlan[];
  isOffline: boolean;
  onConfirmWeek: () => void;
  onConfirmDay: (id: string) => void;
  onRejectDay: (id: string, category: string, text: string) => void;
  onOpenSiteDetail: () => void;
  onTriggerToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  weekPlan,
  isOffline,
  onConfirmWeek,
  onConfirmDay,
  onRejectDay,
  onOpenSiteDetail,
  onTriggerToast
}) => {
  const [selectedDay, setSelectedDay] = useState<WeekDayPlan | null>(null);
  const [showSummaryModal, setShowSummaryModal] = useState<boolean>(false);
  const [rejectionModalDay, setRejectionModalDay] = useState<WeekDayPlan | null>(null);
  const [rejectionCategory, setRejectionCategory] = useState<string>('');
  const [rejectionText, setRejectionText] = useState<string>('');

  const confirmedCount = weekPlan.filter(d => d.status === 'bestätigt').length;
  const totalDays = weekPlan.length;
  const progressPct = totalDays > 0 ? Math.round((confirmedCount / totalDays) * 100) : 0;
  const hasUnconfirmed = weekPlan.some(d => d.status === 'offen' || d.status === 'geändert' || d.status === 'dringend');

  const rejectionCategories = [
    'Terminüberschneidung',
    'Gesundheit oder Belastung',
    'Qualifikation fehlt',
    'Anfahrt oder Erreichbarkeit',
    'Persönlicher Grund',
    'Sonstiges'
  ];

  const handleOpenRejectModal = (day: WeekDayPlan) => {
    setRejectionModalDay(day);
    setRejectionCategory('');
    setRejectionText('');
  };

  const handleSubmitRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectionModalDay || !rejectionCategory || !rejectionText.trim()) return;

    onRejectDay(rejectionModalDay.id, rejectionCategory, rejectionText.trim());
    setRejectionModalDay(null);
    setSelectedDay(null);
  };

  const handleFinalizeConfirmWeek = () => {
    onConfirmWeek();
    setShowSummaryModal(false);
    onTriggerToast('Woche bestätigt', 'Alle ausstehenden Einsätze der Woche wurden verbindlich bestätigt.', 'success');
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-4">
      {/* Header Banner */}
      <section className="bg-[#1C201C] rounded-[20px] p-4 border border-[#34332D] space-y-3.5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D6A875]">Ihre Woche</span>
              <span className="text-[10px] font-mono font-extrabold bg-[#272822] text-[#E8D2B5] px-2 py-0.5 rounded-md border border-[#34332D]">
                KW 31
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#F1E8DC] mt-0.5">Wochenplaner</h2>
            <p className="text-xs text-[#C2B3A0]">27. Juli – 31. Juli 2026 (Montag bis Freitag)</p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs font-mono font-bold text-[#D6A875] block">
              {confirmedCount} von {totalDays} bestätigt
            </span>
            <span className="text-[10px] font-mono text-[#918577]">({progressPct}%)</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-[#0B0C0B] h-2 rounded-full overflow-hidden border border-[#34332D]">
            <div
              className="bg-gradient-to-r from-[#C48A4A] to-[#7D8B55] h-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-[10px] text-[#918577] flex justify-between font-mono">
            <span>Mo 27.07.</span>
            <span>Fr 31.07.</span>
          </p>
        </div>

        {/* Primary Action Button: Confirm Week */}
        {hasUnconfirmed ? (
          <button
            onClick={() => setShowSummaryModal(true)}
            disabled={isOffline}
            className={`w-full min-h-[52px] py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all border-b-4 ${
              isOffline
                ? 'bg-[#272822] text-[#918577] border-[#34332D] cursor-not-allowed'
                : 'bg-[#55735B] hover:bg-[#46614b] text-[#F1E8DC] border-[#3A523F] active:scale-[0.98] active:border-b-2 active:brightness-110'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Woche bestätigen</span>
          </button>
        ) : (
          <div className="bg-[#141713] p-3 rounded-xl border border-[#34332D] flex items-center justify-center gap-2 text-xs font-bold text-[#7D8B55] min-h-[48px]">
            <ShieldCheck className="w-4 h-4" />
            <span>Alle Einsätze dieser Woche sind bestätigt</span>
          </div>
        )}
      </section>

      {/* Week Schedule List */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#918577]">
            Tageseinsätze (Mo–Fr)
          </h3>
          <span className="text-[10px] font-mono text-[#D6A875]">KW 31</span>
        </div>

        {weekPlan.map((day) => {
          const isConfirmed = day.status === 'bestätigt';
          const isChanged = day.isChanged || day.status === 'geändert';
          const isUrgent = day.status === 'dringend';
          const isPending = day.status === 'offen';
          const isRejected = day.status === 'abgelehnt';

          return (
            <div
              key={day.id}
              onClick={() => setSelectedDay(day)}
              className={`p-3.5 rounded-[18px] border transition-all cursor-pointer min-h-[64px] active:scale-[0.98] ${
                isUrgent
                  ? 'bg-[#B8413D]/15 border-[#B8413D] shadow-md active:bg-[#B8413D]/25'
                  : isChanged
                  ? 'bg-[#C48A4A]/15 border-[#C48A4A]/70 shadow-sm active:bg-[#C48A4A]/25'
                  : isConfirmed
                  ? 'bg-[#141713] border-[#34332D] hover:border-[#D6A875]/40 active:bg-[#1E231E]'
                  : isRejected
                  ? 'bg-[#B8413D]/10 border-[#B8413D]/40 active:bg-[#B8413D]/20'
                  : 'bg-[#1C201C] border-[#34332D] hover:border-[#D6A875]/40 active:bg-[#272822]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  {/* Date Badge */}
                  <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-center shrink-0 border font-mono ${
                    isUrgent
                      ? 'bg-[#B8413D] border-[#8E2F2C] text-[#F1E8DC]'
                      : isChanged
                      ? 'bg-[#C48A4A] border-[#915f2a] text-[#2B211A]'
                      : 'bg-[#272822] border-[#34332D] text-[#F1E8DC]'
                  }`}>
                    <span className="text-[9px] uppercase font-bold tracking-tighter opacity-80">{day.dayName.substring(0, 2)}</span>
                    <span className="text-xs font-extrabold leading-none">{day.dateStr}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#F1E8DC] leading-snug">
                        {day.siteName || 'Kein Einsatz'}
                      </h4>
                      {day.siteCode && (
                        <span className="text-[10px] font-mono bg-[#49372B] text-[#E8D2B5] px-1.5 py-0.2 rounded font-bold">
                          {day.siteCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#C2B3A0] mt-0.5">{day.activity}</p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="shrink-0">
                  {isConfirmed && (
                    <span className="text-[10px] font-mono text-[#7D8B55] bg-[#7D8B55]/15 px-2.5 py-1 rounded-full border border-[#7D8B55]/40 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Bestätigt
                    </span>
                  )}
                  {isUrgent && (
                    <span className="text-[10px] font-mono text-[#F1E8DC] bg-[#B8413D] px-2.5 py-1 rounded-full border border-[#8E2F2C] font-extrabold flex items-center gap-1 animate-pulse">
                      <Zap className="w-3 h-3 fill-current" /> Dringend
                    </span>
                  )}
                  {isChanged && (
                    <span className="text-[10px] font-mono text-[#C48A4A] bg-[#C48A4A]/20 px-2.5 py-1 rounded-full border border-[#C48A4A]/50 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Geändert
                    </span>
                  )}
                  {isPending && (
                    <span className="text-[10px] font-mono text-[#918577] bg-[#272822] px-2.5 py-1 rounded-full border border-[#34332D] font-bold">
                      Ausstehend
                    </span>
                  )}
                  {isRejected && (
                    <span className="text-[10px] font-mono text-[#B8413D] bg-[#B8413D]/20 px-2.5 py-1 rounded-full border border-[#B8413D]/40 font-bold">
                      Abgelehnt
                    </span>
                  )}
                </div>
              </div>

              {day.timeRange && (
                <div className="flex items-center justify-between text-xs text-[#918577] font-mono pt-2 border-t border-[#34332D]/70 mt-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D6A875]" />
                    <span>{day.timeRange}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-[#D6A875] font-sans font-semibold">
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Week Confirmation Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-[#0B0C0B]/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-[410px] bg-[#141713] border border-[#34332D] rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#34332D] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D6A875] font-bold">Zusammenfassung</span>
                <h3 className="text-base font-extrabold text-[#F1E8DC]">Wochenplan KW 31 bestätigen</h3>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="min-h-[48px] min-w-[48px] p-2 rounded-xl flex items-center justify-center text-[#918577] hover:text-[#F1E8DC] hover:bg-[#272822] active:bg-[#34352D] active:scale-95 transition-all"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#C2B3A0] leading-relaxed">
              Du bestätigst verbindlich die folgenden Einsätze von Montag bis Freitag.
            </p>

            {/* List of week appointments */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {weekPlan.map((d) => (
                <div key={d.id} className="bg-[#1C201C] p-3 rounded-xl border border-[#34332D] flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#D6A875]">{d.dayName} ({d.dateStr})</span>
                      <span className="text-[#F1E8DC] font-bold">— {d.siteName}</span>
                    </div>
                    <p className="text-[11px] text-[#C2B3A0] mt-0.5">{d.activity}</p>
                    <p className="text-[10px] text-[#918577] font-mono mt-0.5">{d.timeRange}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    d.status === 'bestätigt'
                      ? 'bg-[#7D8B55]/20 text-[#7D8B55]'
                      : 'bg-[#C48A4A]/20 text-[#C48A4A]'
                  }`}>
                    {d.status === 'bestätigt' ? 'Bestätigt' : 'Ausstehend'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleFinalizeConfirmWeek}
                disabled={isOffline}
                className={`w-full min-h-[52px] py-3.5 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-b-4 transition-all ${
                  isOffline
                    ? 'bg-[#272822] text-[#918577] border-[#34332D] cursor-not-allowed'
                    : 'bg-[#55735B] hover:bg-[#46614b] text-[#F1E8DC] border-[#3A523F] active:scale-[0.98] active:border-b-2 active:brightness-110'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Gesamte Woche jetzt bestätigen</span>
              </button>

              <button
                onClick={() => setShowSummaryModal(false)}
                className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#272822] text-[#C2B3A0] hover:text-[#F1E8DC] active:bg-[#34352D] border border-[#34332D] text-xs font-bold text-center active:scale-[0.98] transition-all"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Day Detail Modal / Sheet */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 bg-[#0B0C0B]/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-[410px] bg-[#141713] border border-[#34332D] rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#34332D] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D6A875] font-bold">
                  {selectedDay.dayName}, {selectedDay.dateStr}2026
                </span>
                <h3 className="text-base font-extrabold text-[#F1E8DC]">
                  {selectedDay.siteName} ({selectedDay.siteCode})
                </h3>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="min-h-[48px] min-w-[48px] p-2 rounded-xl flex items-center justify-center text-[#918577] hover:text-[#F1E8DC] hover:bg-[#272822] active:bg-[#34352D] active:scale-95 transition-all"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#C2B3A0]">
              <div className="bg-[#1C201C] p-3 rounded-xl border border-[#34332D] space-y-1">
                <span className="font-bold text-[#F1E8DC] block">Tätigkeit:</span>
                <p>{selectedDay.activity}</p>
                <span className="text-mono text-[#D6A875] block font-mono text-xs pt-1">{selectedDay.timeRange}</span>
              </div>

              {selectedDay.isChanged && (
                <div className="p-3 bg-[#C48A4A]/15 border border-[#C48A4A]/50 rounded-xl text-xs text-[#F1E8DC] space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#C48A4A]">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Einsatzzeiten wurden aktualisiert</span>
                  </div>
                  <p className="text-[11px] text-[#C2B3A0]">
                    Bitte prüfe den aktualisierten Ablauf und bestätige oder lehne den geänderten Termin ab.
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons in Day Modal */}
            <div className="space-y-2 pt-2">
              {selectedDay.status !== 'bestätigt' && (
                <button
                  onClick={() => {
                    onConfirmDay(selectedDay.id);
                    setSelectedDay(null);
                  }}
                  disabled={isOffline}
                  className={`w-full min-h-[52px] py-3.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                    isOffline
                      ? 'bg-[#272822] text-[#918577] border border-[#34332D] cursor-not-allowed'
                      : 'bg-[#55735B] hover:bg-[#46614b] text-[#F1E8DC] active:scale-[0.98] active:brightness-110 shadow-md'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Diesen Einsatz bestätigen</span>
                </button>
              )}

              {selectedDay.status !== 'abgelehnt' && (
                <button
                  onClick={() => {
                    handleOpenRejectModal(selectedDay);
                  }}
                  disabled={isOffline}
                  className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                    isOffline
                      ? 'bg-[#272822] text-[#918577] border border-[#34332D] cursor-not-allowed'
                      : 'bg-[#B8413D]/20 border border-[#B8413D]/50 text-[#F1E8DC] hover:bg-[#B8413D]/30 active:bg-[#B8413D]/40 active:scale-[0.98]'
                  }`}
                >
                  <XCircle className="w-4 h-4 text-[#B8413D]" />
                  <span>Einsatz ablehnen</span>
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedDay(null);
                  onOpenSiteDetail();
                }}
                className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#272822] hover:bg-[#303129] active:bg-[#34352D] border border-[#34332D] text-xs font-bold text-[#D6A875] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all"
              >
                <span>Vollständige Baustellendetails öffnen</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Rejection Modal */}
      {rejectionModalDay && (
        <div className="fixed inset-0 z-50 bg-[#0B0C0B]/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <form
            onSubmit={handleSubmitRejection}
            className="w-full max-w-[410px] bg-[#141713] border border-[#B8413D]/50 rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#34332D] pb-3">
              <div className="flex items-center gap-2 text-[#B8413D]">
                <XCircle className="w-5 h-5 shrink-0" />
                <h3 className="text-sm font-extrabold text-[#F1E8DC]">Einsatz ablehnen</h3>
              </div>
              <button
                type="button"
                onClick={() => setRejectionModalDay(null)}
                className="min-h-[48px] min-w-[48px] p-2 rounded-xl flex items-center justify-center text-[#918577] hover:text-[#F1E8DC] hover:bg-[#272822] active:bg-[#34352D] active:scale-95 transition-all"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#C2B3A0]">
              Einsatz am <strong className="text-[#F1E8DC]">{rejectionModalDay.dayName} ({rejectionModalDay.siteName})</strong> ablehnen. Kategorie und Begründung sind verpflichtend.
            </p>

            {/* Mandatory Category Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#F1E8DC] block">
                1. Grund / Kategorie <span className="text-[#B8413D]">*</span>
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {rejectionCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setRejectionCategory(cat)}
                    className={`min-h-[48px] p-3 rounded-xl text-left text-xs font-semibold border transition-all flex items-center active:scale-[0.98] ${
                      rejectionCategory === cat
                        ? 'bg-[#49372B] border-[#D6A875] text-[#F1E8DC] font-bold shadow-xs'
                        : 'bg-[#1C201C] border-[#34332D] text-[#C2B3A0] hover:border-[#49372B] active:bg-[#272822]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Mandatory Free Text */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#F1E8DC] block">
                2. Ausführliche Begründung <span className="text-[#B8413D]">*</span>
              </label>
              <textarea
                value={rejectionText}
                onChange={(e) => setRejectionText(e.target.value)}
                placeholder="Bitte konkret beschreiben, warum der Einsatz nicht wahrgenommen werden kann..."
                rows={3}
                required
                className="w-full bg-[#0B0C0B] border border-[#34332D] focus:border-[#D6A875] rounded-xl p-3 text-xs text-[#F1E8DC] placeholder-[#918577] outline-hidden min-h-[80px]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={!rejectionCategory || !rejectionText.trim() || isOffline}
                className={`w-full min-h-[52px] py-3.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
                  !rejectionCategory || !rejectionText.trim() || isOffline
                    ? 'bg-[#272822] text-[#918577] border border-[#34332D] cursor-not-allowed'
                    : 'bg-[#B8413D] hover:bg-[#B8413D]/90 text-[#F1E8DC] active:scale-[0.98] active:brightness-110 shadow-lg'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Ablehnung verbindlich senden</span>
              </button>

              {(!rejectionCategory || !rejectionText.trim()) && (
                <p className="text-[10px] text-[#C48A4A] text-center">
                  * Kategorie und Freitexteingabe erforderlich, um den Sende-Button zu aktivieren.
                </p>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
