import React, { useState } from 'react';
import {
  Compass,
  LayoutDashboard,
  Clock,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Calendar,
  Bell,
  User,
  ShieldAlert,
  MapPin,
  Play
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Willkommen bei Arboscus',
      subtitle: 'Hauptnavigation im Überblick',
      description: 'Die untere Navigationsleiste gibt dir schnellen Zugriff auf alle essenziellen Bereiche deines Arbeitsalltags:',
      icon: <Compass className="w-8 h-8 text-[#D6A875]" />,
      content: (
        <div className="space-y-2.5 my-2">
          <div className="bg-[#1C201C] p-3 rounded-xl border border-[#34332D] flex items-center gap-3">
            <div className="p-2 bg-[#D6A875] text-[#2B211A] rounded-lg shrink-0 font-bold">
              <LayoutDashboard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F1E8DC]">Heute</p>
              <p className="text-[11px] text-[#C2B3A0]">Tageseinsatz, Wetterwarnung, Zeiterfassung & Schnellaktionen.</p>
            </div>
          </div>

          <div className="bg-[#1C201C] p-3 rounded-xl border border-[#34332D] flex items-center gap-3">
            <div className="p-2 bg-[#272822] text-[#D6A875] rounded-lg shrink-0 border border-[#34332D]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F1E8DC]">Woche</p>
              <p className="text-[11px] text-[#C2B3A0]">Wochenübersicht Mo–Fr, Termine prüfen & Woche per Klick bestätigen.</p>
            </div>
          </div>

          <div className="bg-[#1C201C] p-3 rounded-xl border border-[#34332D] flex items-center gap-3">
            <div className="p-2 bg-[#272822] text-[#D6A875] rounded-lg shrink-0 border border-[#34332D]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F1E8DC]">Meldungen</p>
              <p className="text-[11px] text-[#C2B3A0]">In-App Benachrichtigungen zu Wetter, Planung & Schadensberichten.</p>
            </div>
          </div>

          <div className="bg-[#1C201C] p-3 rounded-xl border border-[#34332D] flex items-center gap-3">
            <div className="p-2 bg-[#272822] text-[#D6A875] rounded-lg shrink-0 border border-[#34332D]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F1E8DC]">Status & Profil</p>
              <p className="text-[11px] text-[#C2B3A0]">Abwesenheiten eintragen, Qualifikationen & Offline-Synchronisation.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Tageseinsatz im Detail',
      subtitle: 'Alles Wichtige auf einen Blick',
      description: 'Auf dem "Heute"-Bildschirm findest du alle einsatzkritischen Informationen ohne langes Suchen:',
      icon: <LayoutDashboard className="w-8 h-8 text-[#C48A4A]" />,
      content: (
        <div className="space-y-2.5 my-2">
          <div className="bg-[#1C201C] p-3 rounded-xl border border-[#34332D] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#D6A875] font-bold uppercase">Baustellendetails</span>
              <span className="text-[10px] bg-[#272822] text-[#C2B3A0] px-1.5 py-0.5 rounded border border-[#34332D]">Code PS</span>
            </div>
            <p className="text-xs font-bold text-[#F1E8DC]">Park Sanssouci — Kronenpflege</p>
            <p className="text-[11px] text-[#C2B3A0] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D6A875] shrink-0" />
              Zur Historischen Mühle 1, Potsdam (Anfahrt ~24 Min.)
            </p>
          </div>

          <div className="bg-[#C48A4A]/10 p-3 rounded-xl border border-[#C48A4A]/40 flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#C48A4A] shrink-0" />
            <div>
              <p className="text-xs font-bold text-[#F1E8DC]">Wetter- & Sicherheitswarnungen</p>
              <p className="text-[11px] text-[#C2B3A0]">Aktuelle DWD-Hinweise (z.B. Windböen) direkt im Einsatzkontext.</p>
            </div>
          </div>

          <div className="bg-[#1C201C] p-3 rounded-xl border border-[#34332D]">
            <p className="text-xs font-bold text-[#F1E8DC] mb-1">Checkliste & Team</p>
            <p className="text-[11px] text-[#C2B3A0]">Hake Tagesaufgaben ab und sieh auf einen Blick, welche Kollegen & Fahrzeuge eingeteilt sind.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Zeiterfassung starten',
      subtitle: 'Der primäre Handlungs-Button',
      description: 'Mit einem Klick auf den prominenten Haupt-Button startest du deine Arbeitszeitmessung:',
      icon: <Clock className="w-8 h-8 text-[#7D8B55]" />,
      content: (
        <div className="space-y-3 my-2">
          {/* Simulated Button Preview */}
          <div className="p-3 bg-[#1C201C] rounded-2xl border border-[#34332D] space-y-2">
            <div className="bg-[#55735B] text-[#F1E8DC] py-3 px-4 rounded-xl font-bold uppercase tracking-widest text-xs text-center border-b-4 border-[#3A523F] flex items-center justify-center gap-2">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Arbeitszeit starten</span>
            </div>
            <p className="text-[11px] text-[#C2B3A0] text-center">
              Läuft minutengenau im Hintergrund & synchronisiert automatisch sobald du online bist.
            </p>
          </div>

          <div className="bg-[#141713] p-3 rounded-xl border border-[#34332D] text-xs text-[#C2B3A0] space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-[#D6A875]">
              <CheckCircle2 className="w-4 h-4" />
              <span>Bereit für den ersten Einsatz!</span>
            </div>
            <p className="text-[11px]">
              Du kannst diese Einführung jederzeit in deinem Profil unter "App-Einstellungen" erneut aufrufen.
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const current = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C0B]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] bg-[#141713] border border-[#34332D] rounded-3xl p-5 shadow-2xl flex flex-col justify-between space-y-4 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="flex items-center justify-between pb-2 border-b border-[#34332D]">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase text-[#D6A875] bg-[#272822] px-2 py-0.5 rounded-full border border-[#34332D]">
              Schritt {currentStep + 1} von {steps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[11px] text-[#918577] hover:text-[#F1E8DC] font-semibold px-2 py-1 rounded-lg hover:bg-[#1C201C] transition-colors flex items-center gap-1"
          >
            <span>Überspringen</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#1C201C] rounded-2xl border border-[#34332D] shrink-0">
              {current.icon}
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#918577]">
                {current.subtitle}
              </span>
              <h3 className="text-base font-extrabold text-[#F1E8DC] leading-tight">
                {current.title}
              </h3>
            </div>
          </div>
          <p className="text-xs text-[#C2B3A0] pt-1 leading-snug">
            {current.description}
          </p>
        </div>

        {/* Step Interactive Content */}
        <div className="flex-1">
          {current.content}
        </div>

        {/* Progress Dots & Navigation Footer */}
        <div className="pt-2 border-t border-[#34332D] space-y-3">
          <div className="flex items-center justify-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStep ? 'w-6 bg-[#D6A875]' : 'w-1.5 bg-[#34332D]'
                }`}
                aria-label={`Zu Schritt ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-2">
            {currentStep > 0 ? (
              <button
                onClick={handlePrev}
                className="py-2.5 px-3 rounded-xl bg-[#1C201C] border border-[#34332D] text-xs font-bold text-[#C2B3A0] hover:text-[#F1E8DC] flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Zurück</span>
              </button>
            ) : <div />}

            <button
              onClick={handleNext}
              className="py-2.5 px-4 rounded-xl bg-[#D6A875] hover:bg-[#c39766] text-[#2B211A] text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-98 transition-all ml-auto"
            >
              <span>{currentStep === steps.length - 1 ? 'Loslegen' : 'Weiter'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
