import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  Phone,
  Users,
  Truck,
  FileText,
  AlertTriangle,
  ArrowLeft,
  Info,
  CheckSquare,
  Square
} from 'lucide-react';
import { Assignment, ChecklistItem } from '../types';
import { WeatherCard } from '../components/WeatherCard';

interface SiteDetailViewProps {
  assignment: Assignment;
  checklist: ChecklistItem[];
  onToggleChecklist: (id: string) => void;
  onBack: () => void;
  onTriggerToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const SiteDetailView: React.FC<SiteDetailViewProps> = ({
  assignment,
  checklist,
  onToggleChecklist,
  onBack,
  onTriggerToast
}) => {
  const [activeTab, setActiveTab] = useState<'übersicht' | 'wetter' | 'briefing' | 'team'>('übersicht');

  const handleLaunchNavigation = () => {
    onTriggerToast(
      'Navigation gestartet',
      `Route nach ${assignment.address} (${assignment.drivingMinutes} Min. Anfahrt) wird in Navigations-App geöffnet.`
    );
  };

  const handleCall = (name: string, number: string) => {
    onTriggerToast(
      'Anruf gestartet',
      `Wähle ${name} (${number})...`
    );
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-3">
      {/* Top Navigation Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#D6A875] bg-[#1C201C] border border-[#34332D] px-3 py-1.5 rounded-xl hover:bg-[#272822] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Übersicht</span>
        </button>

        <span className="text-[10px] font-mono text-[#55735B] bg-[#55735B]/15 px-2 py-0.5 rounded-full border border-[#55735B]/30 font-bold">
          Einsatz Bestätigt
        </span>
      </div>

      {/* Site Header Card */}
      <div className="charred-wood-card wood-edge-accent p-4 rounded-2xl relative overflow-hidden space-y-3">
        {/* Abstract Tree Ring Background Accent */}
        <div className="absolute right-2 top-2 opacity-10 pointer-events-none">
          <svg className="w-28 h-28 text-[#D6A875]" viewBox="0 0 200 200" fill="none" stroke="currentColor">
            <circle cx="100" cy="100" r="90" strokeWidth="4" />
            <circle cx="100" cy="100" r="70" strokeWidth="6" />
            <circle cx="100" cy="100" r="50" strokeWidth="8" />
            <circle cx="100" cy="100" r="30" strokeWidth="10" />
            <circle cx="100" cy="100" r="10" fill="currentColor" />
          </svg>
        </div>

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#49372B] border border-[#D6A875]/60 flex items-center justify-center text-[#E8D2B5] font-extrabold text-base font-mono shadow-md">
              {assignment.siteCode}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6A875]">Baustellendetail</span>
              <h2 className="text-lg font-extrabold text-[#F1E8DC] leading-tight">
                {assignment.siteName}
              </h2>
              <span className="text-xs text-[#C2B3A0] block mt-0.5">
                {assignment.activity}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[#141713] p-3 rounded-xl border border-[#34332D] grid grid-cols-2 gap-2 text-xs font-mono relative z-10">
          <div>
            <span className="text-[10px] text-[#918577] block">Einsatzzeit:</span>
            <span className="text-[#F1E8DC] font-bold">{assignment.startTime} – {assignment.endTime} Uhr</span>
          </div>
          <div>
            <span className="text-[10px] text-[#918577] block">Anfahrtszeit:</span>
            <span className="text-[#D6A875] font-bold">~{assignment.drivingMinutes} Minuten</span>
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="grid grid-cols-4 gap-1 bg-[#141713] p-1 rounded-xl border border-[#34332D] text-xs font-bold">
        {(['übersicht', 'wetter', 'briefing', 'team'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 rounded-lg transition-colors capitalize ${
              activeTab === tab
                ? 'bg-[#E8D2B5] text-[#2B211A] font-extrabold shadow-xs'
                : 'text-[#C2B3A0] hover:text-[#F1E8DC]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Übersicht */}
      {activeTab === 'übersicht' && (
        <div className="space-y-4">
          {/* A. Auftrag */}
          <div className="charred-wood-card p-4 rounded-2xl space-y-2.5">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#D6A875]" />
              <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">Auftrag & Aufgabe</h3>
            </div>
            <div className="bg-[#141713] p-3 rounded-xl border border-[#34332D] space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-[#918577] uppercase block font-bold">Tätigkeit</span>
                <p className="text-[#F1E8DC] font-bold">{assignment.activity}</p>
              </div>
              <div className="pt-2 border-t border-[#272822]">
                <span className="text-[10px] text-[#918577] uppercase block font-bold">Konkrete Aufgabe</span>
                <p className="text-[#C2B3A0] leading-relaxed">{assignment.task}</p>
              </div>
              <div className="pt-2 border-t border-[#272822] flex justify-between text-[11px]">
                <span className="text-[#918577]">Teamleitung:</span>
                <span className="text-[#D6A875] font-bold">Jana Krüger</span>
              </div>
            </div>
          </div>

          {/* B. Adresse & Anfahrt */}
          <div className="charred-wood-card p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#D6A875]" />
              <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">Adresse & Anfahrt</h3>
            </div>

            <div className="bg-[#141713] p-3 rounded-xl border border-[#34332D] space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D6A875] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#F1E8DC] font-bold block">{assignment.address}</span>
                  <span className="text-[11px] text-[#918577] block mt-0.5">
                    Berechnete Anfahrt: {assignment.drivingMinutes} Minuten vom Betriebshof
                  </span>
                </div>
              </div>

              <div className="p-2 bg-[#272822] rounded-lg text-[11px] text-[#C2B3A0] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-[#5B7E86] shrink-0" />
                <span>Private Startadressen werden aus Datenschutzgründen nicht gespeichert.</span>
              </div>
            </div>

            <button
              onClick={handleLaunchNavigation}
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#5B7E86] hover:bg-[#5B7E86]/90 text-[#F1E8DC] font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigation starten (24 Min. Anfahrt)</span>
            </button>
          </div>

          {/* D. Aufgaben Checklist */}
          <div className="charred-wood-card p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-[#D6A875]" />
                <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">
                  Arbeitsaufschlüsselung ({checklist.filter(c => c.completed).length}/{checklist.length})
                </h3>
              </div>
            </div>

            <div className="space-y-2">
              {checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onToggleChecklist(item.id)}
                  className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    item.completed
                      ? 'bg-[#141713] border-[#34332D] text-[#918577] line-through'
                      : 'bg-[#272822] border-[#34332D] text-[#F1E8DC] hover:border-[#D6A875]/40'
                  }`}
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 text-[#55735B] shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 text-[#C2B3A0] shrink-0" />
                  )}
                  <span className="text-xs font-medium flex-1">{item.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Wetter */}
      {activeTab === 'wetter' && (
        <div className="space-y-4">
          <WeatherCard weather={assignment.weather} showFullDetailsInitially={true} />
        </div>
      )}

      {/* Tab 3: Briefing & Sicherheit */}
      {activeTab === 'briefing' && (
        <div className="space-y-4">
          <div className="charred-wood-card p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#D6A875]" />
              <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">
                Baustellen-Briefing & Sicherheit
              </h3>
            </div>

            <div className="space-y-2">
              {assignment.briefingNotes.map((note, index) => (
                <div
                  key={index}
                  className="p-3 bg-[#141713] rounded-xl border border-[#34332D] flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-[#49372B] text-[#D6A875] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <p className="text-xs text-[#F1E8DC] leading-relaxed">{note}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#C48A4A]/10 border border-[#C48A4A]/40 p-3 rounded-xl text-xs text-[#C2B3A0] space-y-1">
              <span className="font-bold text-[#C48A4A] block">Achtung Personenverkehr:</span>
              <p>Öffentlicher Publikumsverkehr im Park Sanssouci ab 10:00 Uhr. Absperrkreis min. 1,5x Baumlänge halten.</p>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="charred-wood-card p-4 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">Ansprechpartner & Notfall</h3>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleCall('Parkverwaltung Sanssouci', '+49 331 96940')}
                className="p-3 bg-[#141713] hover:bg-[#272822] border border-[#34332D] rounded-xl flex items-center justify-between text-xs text-[#F1E8DC] transition-all"
              >
                <div>
                  <span className="font-bold block">Parkverwaltung Sanssouci</span>
                  <span className="text-[10px] text-[#918577]">Schlüssel & Zufahrtsgenehmigung</span>
                </div>
                <Phone className="w-4 h-4 text-[#55735B]" />
              </button>

              <button
                onClick={() => handleCall('Teamleitung Jana Krüger', '+49 172 3344120')}
                className="p-3 bg-[#141713] hover:bg-[#272822] border border-[#34332D] rounded-xl flex items-center justify-between text-xs text-[#F1E8DC] transition-all"
              >
                <div>
                  <span className="font-bold block">Jana Krüger (Teamleitung)</span>
                  <span className="text-[10px] text-[#918577]">+49 172 3344120</span>
                </div>
                <Phone className="w-4 h-4 text-[#55735B]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Team & Ressourcen */}
      {activeTab === 'team' && (
        <div className="space-y-4">
          {/* Team Members List */}
          <div className="charred-wood-card p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D6A875]" />
              <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">Einsatzteam</h3>
            </div>

            <div className="space-y-2">
              {assignment.team.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#141713] p-3 rounded-xl border border-[#34332D] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#49372B] text-[#E8D2B5] font-bold text-xs flex items-center justify-center shrink-0 border border-[#D6A875]/40">
                      {member.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#F1E8DC]">{member.name}</span>
                        {member.isLead && (
                          <span className="text-[9px] font-extrabold uppercase bg-[#D6A875] text-[#2B211A] px-1.5 py-0.2 rounded-xs">
                            Teamleitung
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#C2B3A0] block">{member.role}</span>
                    </div>
                  </div>

                  {member.phone && (
                    <button
                      onClick={() => handleCall(member.name, member.phone!)}
                      className="p-2 bg-[#272822] hover:bg-[#303129] border border-[#34332D] rounded-xl text-[#55735B] active:scale-95"
                      aria-label={`${member.name} anrufen`}
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resources List */}
          <div className="charred-wood-card p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D6A875]" />
              <h3 className="text-xs font-bold text-[#F1E8DC] uppercase tracking-wider">Fahrzeuge & Geräte</h3>
            </div>

            <div className="space-y-2">
              {assignment.resources.map((res) => (
                <div
                  key={res.id}
                  className="bg-[#141713] p-3 rounded-xl border border-[#34332D] flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#F1E8DC] font-mono">{res.code}</span>
                      <span className="text-[10px] bg-[#272822] text-[#C2B3A0] px-1.5 py-0.2 rounded-xs border border-[#34332D]">
                        {res.category}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#918577] block mt-0.5">{res.details || res.name}</span>
                  </div>

                  <span className="text-[10px] font-bold text-[#55735B] bg-[#55735B]/15 px-2 py-0.5 rounded-full border border-[#55735B]/30 font-mono">
                    ✓ {res.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Global Contacts Footer */}
      <div className="pt-2">
        <button
          onClick={() => handleCall('Zentrale Disposition', '+49 331 889900')}
          className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#1C201C] hover:bg-[#272822] border border-[#34332D] text-xs font-bold text-[#C2B3A0] flex items-center justify-center gap-2"
        >
          <Phone className="w-4 h-4 text-[#D6A875]" />
          <span>Zentrale Geschäftsstelle / Disposition anrufen</span>
        </button>
      </div>
    </div>
  );
};
