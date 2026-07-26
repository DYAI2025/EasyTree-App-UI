import React, { useState } from 'react';
import {
  Umbrella,
  Plus,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  Send,
  X
} from 'lucide-react';
import { AbsenceRequest } from '../types';

interface AbsenceViewProps {
  absences: AbsenceRequest[];
  isOffline: boolean;
  onSubmitAbsence: (absence: AbsenceRequest) => void;
  onTriggerToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const AbsenceView: React.FC<AbsenceViewProps> = ({
  absences,
  isOffline,
  onSubmitAbsence,
  onTriggerToast
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [type, setType] = useState<AbsenceRequest['type']>('Urlaub');
  const [startDate, setStartDate] = useState<string>('15.08.2026');
  const [endDate, setEndDate] = useState<string>('20.08.2026');
  const [isFullDay, setIsFullDay] = useState<boolean>(true);
  const [note, setNote] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) return;

    const isSick = type === 'Krankheit';
    const newAbsence: AbsenceRequest = {
      id: `ABS-2026-${Math.floor(100 + Math.random() * 900)}`,
      type,
      startDate,
      endDate,
      isFullDay,
      note: note.trim() || undefined,
      status: isSick ? 'nicht_verfuegbar' : 'beantragt',
      submittedAt: new Date().toLocaleDateString('de-DE')
    };

    onSubmitAbsence(newAbsence);
    setShowForm(false);
    setNote('');

    if (isSick) {
      onTriggerToast(
        'Krankmeldung erfasst',
        'Status sofort auf "Nicht verfügbar" gesetzt. Gute Besserung!',
        'warning'
      );
    } else {
      onTriggerToast(
        'Urlaubsantrag eingereicht',
        'Dein Antrag liegt der Personalplanung zur Genehmigung vor.'
      );
    }
  };

  const getStatusBadge = (status: AbsenceRequest['status']) => {
    switch (status) {
      case 'genehmigt':
        return (
          <span className="text-[10px] font-mono text-[#55735B] bg-[#55735B]/15 px-2 py-0.5 rounded-full border border-[#55735B]/30 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Genehmigt
          </span>
        );
      case 'nicht_verfuegbar':
        return (
          <span className="text-[10px] font-mono text-[#B8413D] bg-[#B8413D]/20 px-2 py-0.5 rounded-full border border-[#B8413D]/40 font-bold flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Nicht verfügbar
          </span>
        );
      case 'abgelehnt':
        return (
          <span className="text-[10px] font-mono text-[#B8413D] bg-[#B8413D]/15 px-2 py-0.5 rounded-full border border-[#B8413D]/30 font-bold flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Abgelehnt
          </span>
        );
      case 'beantragt':
      default:
        return (
          <span className="text-[10px] font-mono text-[#C48A4A] bg-[#C48A4A]/20 px-2 py-0.5 rounded-full border border-[#C48A4A]/40 font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" /> Beantragt
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-3">
      {/* Header Banner */}
      <div className="charred-wood-card p-4 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#D6A875]">Personalwesen</span>
            <h2 className="text-lg font-extrabold text-[#F1E8DC]">Abwesenheit & Urlaub</h2>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            disabled={isOffline}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              isOffline
                ? 'bg-[#272822] text-[#918577] border border-[#34332D] cursor-not-allowed'
                : 'bg-[#55735B] hover:bg-[#55735B]/90 text-[#F1E8DC] active:scale-95 shadow-md'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Abwesenheit erfassen</span>
          </button>
        </div>
      </div>

      {/* Absence Form Sheet / View */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#141713] border border-[#D6A875]/50 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center justify-between border-b border-[#34332D] pb-2">
            <h3 className="text-sm font-bold text-[#F1E8DC] flex items-center gap-2">
              <Umbrella className="w-4 h-4 text-[#D6A875]" />
              Neue Abwesenheit erfassen
            </h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-[#918577] hover:text-[#F1E8DC]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Type Switcher */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#C2B3A0] block">Art der Abwesenheit</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Urlaub', 'Krankheit', 'Sonstige'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`p-2 rounded-xl text-xs font-bold border text-center transition-all ${
                    type === t
                      ? t === 'Krankheit'
                        ? 'bg-[#B8413D] text-[#F1E8DC] border-[#B8413D]'
                        : 'bg-[#E8D2B5] text-[#2B211A] border-[#D6A875]'
                      : 'bg-[#1C201C] text-[#C2B3A0] border-[#34332D]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            {type === 'Krankheit' && (
              <p className="text-[11px] text-[#C48A4A] mt-1 font-semibold">
                * Krankmeldungen erzeugen sofort den Status "Nicht verfügbar". Keine medizinischen Angaben erforderlich.
              </p>
            )}
          </div>

          {/* Start & End Dates */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#C2B3A0] block">Beginn</label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="TT.MM.JJJJ"
                className="w-full bg-[#0B0C0B] border border-[#34332D] rounded-xl p-2.5 text-xs text-[#F1E8DC] font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#C2B3A0] block">Ende</label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="TT.MM.JJJJ"
                className="w-full bg-[#0B0C0B] border border-[#34332D] rounded-xl p-2.5 text-xs text-[#F1E8DC] font-mono"
              />
            </div>
          </div>

          {/* Full day or partial */}
          <div className="flex items-center gap-3 bg-[#1C201C] p-2.5 rounded-xl border border-[#34332D]">
            <label className="flex items-center gap-2 text-xs font-bold text-[#F1E8DC] cursor-pointer">
              <input
                type="radio"
                name="fullDay"
                checked={isFullDay}
                onChange={() => setIsFullDay(true)}
                className="text-[#D6A875]"
              />
              <span>Ganztägig</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-[#F1E8DC] cursor-pointer">
              <input
                type="radio"
                name="fullDay"
                checked={!isFullDay}
                onChange={() => setIsFullDay(false)}
                className="text-[#D6A875]"
              />
              <span>Halbtags / Teilzeitraum</span>
            </label>
          </div>

          {/* Optional Note */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[#C2B3A0] block">Optionale Notiz</label>
            <input
              type="text"
              placeholder="z.B. Sommerurlaub mit Familie"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#0B0C0B] border border-[#34332D] rounded-xl p-2.5 text-xs text-[#F1E8DC] placeholder-[#918577]"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#55735B] hover:bg-[#55735B]/90 text-[#F1E8DC] font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>Abwesenheit jetzt einreichen</span>
          </button>
        </form>
      )}

      {/* Existing Absence Requests List */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#918577] block px-1">
          Eingereichte Anträge & Status
        </span>

        {absences.map((abs) => (
          <div
            key={abs.id}
            className="charred-wood-card p-4 rounded-2xl flex items-start justify-between gap-3"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F1E8DC]">{abs.type}</span>
                <span className="text-[10px] text-[#918577] font-mono">({abs.id})</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#D6A875] font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>{abs.startDate} – {abs.endDate}</span>
              </div>

              {abs.note && (
                <p className="text-[11px] text-[#C2B3A0] italic mt-0.5">"{abs.note}"</p>
              )}
            </div>

            <div className="shrink-0 text-right">
              {getStatusBadge(abs.status)}
              <span className="text-[10px] text-[#918577] block mt-1">
                Eingereicht {abs.submittedAt}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
