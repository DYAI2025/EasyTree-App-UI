import React from 'react';
import {
  User,
  Shield,
  Smartphone,
  WifiOff,
  RefreshCw,
  Phone,
  RotateCcw,
  Info,
  CheckCircle2,
  Lock,
  Compass
} from 'lucide-react';
import { HexBadge } from '../components/HexBadge';
import { currentUser } from '../mockData';

interface ProfileViewProps {
  isOffline: boolean;
  onToggleOffline: () => void;
  onResetDemoState: () => void;
  onStartOnboarding: () => void;
  onTriggerToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  isOffline,
  onToggleOffline,
  onResetDemoState,
  onStartOnboarding,
  onTriggerToast
}) => {
  return (
    <div className="space-y-4 pb-24 px-4 pt-4">
      {/* Profile Header Card */}
      <div className="bg-[#1C201C] p-5 rounded-[20px] border border-[#34332D] relative overflow-hidden space-y-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#272822] text-[#D6A875] font-extrabold text-xl flex items-center justify-center shrink-0 border-2 border-[#D6A875]/60 shadow-lg font-mono">
            {currentUser.avatarInitials}
          </div>

          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D6A875]">Mitarbeiter Profil</span>
            <h2 className="text-lg font-extrabold text-[#F1E8DC] truncate">{currentUser.name}</h2>
            <span className="text-xs font-semibold text-[#C2B3A0] block">{currentUser.role}</span>
            <span className="text-[11px] text-[#918577] font-mono flex items-center gap-1 mt-1">
              <Phone className="w-3 h-3 text-[#7D8B55]" />
              {currentUser.phone}
            </span>
          </div>
        </div>

        {/* Qualifications Section */}
        <div className="pt-3 border-t border-[#34332D] space-y-2">
          <span className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#D6A875]" />
            Nachgewiesene Qualifikationen
          </span>

          <div className="flex flex-wrap gap-2 pt-1">
            {currentUser.qualifications.map((qual) => (
              <HexBadge key={qual} label={qual} variant="wood" size="md" />
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Tour & Onboarding Section */}
      <div className="bg-[#1C201C] p-4 rounded-[20px] border border-[#34332D] space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#272822] text-[#D6A875] rounded-xl border border-[#34332D]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">App-Einführung</h3>
            <p className="text-[11px] text-[#918577]">Interaktiver Rundgang durch Navigation & Funktionen</p>
          </div>
        </div>

        <button
          onClick={onStartOnboarding}
          className="w-full py-2.5 px-4 rounded-xl bg-[#D6A875] hover:bg-[#c39766] text-[#2B211A] text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Einführungs-Tour neu starten</span>
        </button>
      </div>

      {/* Offline Mode Switch Card */}
      <div className="bg-[#1C201C] p-4 rounded-[20px] border border-[#34332D] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-[#C48A4A]" />
            <div>
              <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">Demo Offline-Modus</h3>
              <p className="text-[11px] text-[#918577]">Simuliert fehlende Netzverbindung im Feld</p>
            </div>
          </div>

          <button
            onClick={onToggleOffline}
            className={`w-12 h-6 rounded-full p-1 transition-colors relative ${
              isOffline ? 'bg-[#B8413D]' : 'bg-[#34332D]'
            }`}
            aria-label="Offline Mode Toggle"
          >
            <div
              className={`w-4 h-4 rounded-full bg-[#F1E8DC] transition-transform ${
                isOffline ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {isOffline ? (
          <div className="p-3 bg-[#B8413D]/15 border border-[#B8413D]/50 rounded-xl space-y-1 text-xs text-[#F1E8DC]">
            <div className="flex items-center gap-1.5 font-bold text-[#B8413D]">
              <WifiOff className="w-4 h-4" />
              <span>Offline – Daten lokal gespeichert</span>
            </div>
            <p className="text-[11px] text-[#C2B3A0]">
              Einsatzpläne und Kontakte bleiben lesbar. Synchronisiert automatisch bei Netzempfang.
            </p>
          </div>
        ) : (
          <div className="p-2.5 bg-[#141713] rounded-xl border border-[#34332D] text-[11px] text-[#7D8B55] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7D8B55] shrink-0" />
            <span>Online – Live-Synchronisation aktiv ({currentUser.lastSynced})</span>
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="bg-[#1C201C] p-4 rounded-[20px] border border-[#34332D] space-y-3">
        <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">System & Installierbarkeit</h3>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex justify-between p-2.5 bg-[#141713] rounded-xl border border-[#34332D]">
            <span className="text-[#918577]">App-Version:</span>
            <span className="text-[#F1E8DC] font-bold">{currentUser.appVersion}</span>
          </div>

          <div className="flex justify-between p-2.5 bg-[#141713] rounded-xl border border-[#34332D]">
            <span className="text-[#918577]">PWA Status:</span>
            <span className="text-[#7D8B55] font-bold">Installierbar (Offline PWA)</span>
          </div>
        </div>
      </div>

      {/* Demo Reset Action */}
      <div className="pt-2">
        <button
          onClick={onResetDemoState}
          className="w-full py-2.5 px-4 rounded-xl bg-[#1C201C] hover:bg-[#272822] border border-[#34332D] text-xs font-bold text-[#C48A4A] flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Demo-Zustände zurücksetzen</span>
        </button>
      </div>
    </div>
  );
};
