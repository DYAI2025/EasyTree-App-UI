import React, { useState } from 'react';
import {
  AlertTriangle,
  Camera,
  Mic,
  CheckCircle2,
  X,
  Upload,
  Send,
  FileText,
  Info
} from 'lucide-react';
import { Resource, DamageReport } from '../types';

interface DamageReportModalProps {
  resources: Resource[];
  siteName: string;
  isOffline: boolean;
  onClose: () => void;
  onSubmit: (report: DamageReport) => void;
  onTriggerToast: (title: string, message?: string, type?: 'success' | 'warning' | 'info') => void;
}

export const DamageReportModal: React.FC<DamageReportModalProps> = ({
  resources,
  siteName,
  isOffline,
  onClose,
  onSubmit,
  onTriggerToast
}) => {
  const [resourceId, setResourceId] = useState<string>(resources[0]?.id || 'res-4');
  const [description, setDescription] = useState<string>('');
  const [incident, setIncident] = useState<string>('');
  const [damageType, setDamageType] = useState<string>('Mechanischer Defekt');
  const [affectedArea, setAffectedArea] = useState<string>('');
  const [severity, setSeverity] = useState<DamageReport['severity']>('mittel');
  const [usable, setUsable] = useState<DamageReport['usable']>('eingeschränkt');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  // Simulated Voice Note State
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceDraft, setVoiceDraft] = useState<string>('');
  const [voiceChecked, setVoiceChecked] = useState<boolean>(false);

  // Mandatory photo requirement rule check
  const isPhotoRequired = severity === 'schwer' || severity === 'sicherheitskritisch';
  const canSubmit = Boolean(
    resourceId &&
    description.trim() &&
    (!isPhotoRequired || photoUrl) &&
    !isOffline
  );

  const handleSimulatePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
        onTriggerToast('Foto hinzugefügt', 'Schadensfoto als lokale Vorschau erfasst.');
      };
      reader.readAsDataURL(file);
    } else {
      // Dummy photo fallback if direct select without camera file
      setPhotoUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80');
      onTriggerToast('Beispielfoto geladen', 'Demo-Schadensfoto hinzugefügt.');
    }
  };

  const handleSimulateVoiceRecording = () => {
    setIsRecording(true);
    onTriggerToast('Aufnahme gestartet', 'Sprich jetzt deine Schadensbeschreibung ein...');

    setTimeout(() => {
      setIsRecording(false);
      setVoiceDraft('Bei der Astpflege hat die Kettenbremse beim Auslösen mehrfach verzögert reagiert. Dringende Werkstattprüfung erforderlich.');
      setVoiceChecked(false);
      onTriggerToast('Transkription erstellt', 'Bitte prüfe den erzeugten Textentwurf.');
    }, 2500);
  };

  const handleInsertVoiceDraft = () => {
    if (!voiceChecked) return;
    setDescription((prev) => (prev ? `${prev}\n${voiceDraft}` : voiceDraft));
    onTriggerToast('Text übernommen', 'Geprüfter Transkriptionstext eingefügt.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const selectedRes = resources.find(r => r.id === resourceId);
    const newReport: DamageReport = {
      id: `DMG-2026-${Math.floor(100 + Math.random() * 900)}`,
      resourceId,
      resourceName: selectedRes ? selectedRes.name : 'Gerät',
      siteName,
      timestamp: new Date().toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) + ' Uhr',
      description,
      incident,
      damageType,
      affectedArea,
      severity,
      usable,
      photoUrl,
      voiceTranscript: voiceDraft || undefined,
      voiceChecked,
      statusText: 'Meldung eingegangen (Zur Prüfung)'
    };

    onSubmit(newReport);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0C0B]/85 backdrop-blur-md flex items-end sm:items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-[430px] bg-[#141713] border border-[#34332D] rounded-2xl p-4 space-y-4 max-h-[92vh] overflow-y-auto animate-in slide-in-from-bottom-8 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#34332D] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#C48A4A]/20 text-[#C48A4A] rounded-xl border border-[#C48A4A]/40">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-[#D6A875] font-bold">Meldewesen</span>
              <h2 className="text-base font-extrabold text-[#F1E8DC]">Schadensmeldung erfassen</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#272822] text-[#918577] hover:text-[#F1E8DC]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Resource & Site Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F1E8DC] block">
              Betroffene Ressource / Fahrzeug <span className="text-[#B8413D]">*</span>
            </label>
            <select
              value={resourceId}
              onChange={(e) => setResourceId(e.target.value)}
              className="w-full bg-[#0B0C0B] border border-[#34332D] focus:border-[#D6A875] rounded-xl p-3 text-xs text-[#F1E8DC] outline-hidden font-medium"
            >
              {resources.map((res) => (
                <option key={res.id} value={res.id}>
                  {res.code} – {res.name} ({res.category})
                </option>
              ))}
            </select>
          </div>

          {/* Severity Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F1E8DC] block">
              Schweregrad <span className="text-[#B8413D]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['leicht', 'mittel', 'schwer', 'sicherheitskritisch'] as const).map((sev) => {
                const isSelected = severity === sev;
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`p-2.5 rounded-xl text-xs font-bold capitalize border transition-all text-center ${
                      isSelected
                        ? sev === 'schwer' || sev === 'sicherheitskritisch'
                          ? 'bg-[#B8413D] text-[#F1E8DC] border-[#B8413D]'
                          : 'bg-[#C48A4A] text-[#0B0C0B] border-[#C48A4A]'
                        : 'bg-[#1C201C] text-[#C2B3A0] border-[#34332D] hover:border-[#49372B]'
                    }`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
            {isPhotoRequired && (
              <p className="text-[11px] text-[#C48A4A] font-bold flex items-center gap-1 mt-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Foto zwingend erforderlich bei schweren / sicherheitskritischen Schäden!</span>
              </p>
            )}
          </div>

          {/* Operational Status (Weiterhin nutzbar) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F1E8DC] block">
              Weiterhin nutzbar? <span className="text-[#B8413D]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['ja', 'eingeschränkt', 'nein'] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUsable(u)}
                  className={`p-2.5 rounded-xl text-xs font-bold capitalize border transition-all text-center ${
                    usable === u
                      ? u === 'ja'
                        ? 'bg-[#55735B] text-[#F1E8DC] border-[#55735B]'
                        : u === 'nein'
                        ? 'bg-[#B8413D] text-[#F1E8DC] border-[#B8413D]'
                        : 'bg-[#C48A4A] text-[#0B0C0B] border-[#C48A4A]'
                      : 'bg-[#1C201C] text-[#C2B3A0] border-[#34332D]'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          {/* Damage Type & Affected Area */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#C2B3A0] block">Schadenstyp</label>
              <select
                value={damageType}
                onChange={(e) => setDamageType(e.target.value)}
                className="w-full bg-[#0B0C0B] border border-[#34332D] rounded-xl p-2.5 text-xs text-[#F1E8DC]"
              >
                <option value="Mechanischer Defekt">Mechanischer Defekt</option>
                <option value="Hydraulikleck">Hydraulikleck</option>
                <option value="Schnittschaden">Schnittschaden</option>
                <option value="Elektronikfehler">Elektronikfehler</option>
                <option value="Karosserie / Gehäuse">Karosserie / Gehäuse</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#C2B3A0] block">Betroffener Bereich</label>
              <input
                type="text"
                placeholder="z.B. Kettenbremse, Hydraulikschlauch"
                value={affectedArea}
                onChange={(e) => setAffectedArea(e.target.value)}
                className="w-full bg-[#0B0C0B] border border-[#34332D] rounded-xl p-2.5 text-xs text-[#F1E8DC] placeholder-[#918577]"
              />
            </div>
          </div>

          {/* Description & Incident details */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F1E8DC] block">
              Kurze Schadensbeschreibung <span className="text-[#B8413D]">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Welcher Defekt liegt vor?"
              rows={3}
              required
              className="w-full bg-[#0B0C0B] border border-[#34332D] focus:border-[#D6A875] rounded-xl p-3 text-xs text-[#F1E8DC] placeholder-[#918577] outline-hidden"
            />
          </div>

          {/* Simulated Voice Note Recording Feature */}
          <div className="bg-[#1C201C] p-3 rounded-2xl border border-[#34332D] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-[#D6A875]" />
                <span className="text-xs font-bold text-[#F1E8DC]">Sprachnotiz aufnehmen</span>
              </div>
              <button
                type="button"
                onClick={handleSimulateVoiceRecording}
                disabled={isRecording}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isRecording
                    ? 'bg-[#B8413D] text-[#F1E8DC] animate-pulse'
                    : 'bg-[#49372B] hover:bg-[#6A4934] text-[#E8D2B5] border border-[#D6A875]/40'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isRecording ? 'Aufnahme läuft...' : 'Aufnehmen'}</span>
              </button>
            </div>

            {voiceDraft && (
              <div className="bg-[#141713] p-2.5 rounded-xl border border-[#34332D] space-y-2 text-xs">
                <span className="text-[10px] text-[#D6A875] font-mono font-bold block">
                  Erzeugte Transkription:
                </span>
                <p className="text-[#C2B3A0] italic">"{voiceDraft}"</p>

                <label className="flex items-center gap-2 text-[11px] text-[#F1E8DC] font-bold cursor-pointer pt-1 border-t border-[#272822]">
                  <input
                    type="checkbox"
                    checked={voiceChecked}
                    onChange={(e) => setVoiceChecked(e.target.checked)}
                    className="rounded border-[#34332D] text-[#D6A875]"
                  />
                  <span>Transkription geprüft & freigegeben</span>
                </label>

                <button
                  type="button"
                  onClick={handleInsertVoiceDraft}
                  disabled={!voiceChecked}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${
                    voiceChecked
                      ? 'bg-[#55735B] text-[#F1E8DC]'
                      : 'bg-[#272822] text-[#918577] cursor-not-allowed'
                  }`}
                >
                  Text übernehmen
                </button>
              </div>
            )}
          </div>

          {/* Photo Upload Section with Preview */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#F1E8DC] block">
              Schadensfoto {isPhotoRequired && <span className="text-[#B8413D]">* (Pflicht)</span>}
            </label>

            {photoUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#D6A875] bg-[#0B0C0B]">
                <img src={photoUrl} alt="Schadensfoto" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(undefined)}
                  className="absolute top-2 right-2 p-1.5 bg-[#0B0C0B]/80 text-[#F1E8DC] rounded-xl hover:bg-[#B8413D]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className={`w-full p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                isPhotoRequired
                  ? 'border-[#B8413D] bg-[#B8413D]/10 hover:bg-[#B8413D]/20'
                  : 'border-[#34332D] bg-[#141713] hover:border-[#D6A875]'
              }`}>
                <Camera className="w-6 h-6 text-[#D6A875]" />
                <span className="text-xs font-bold text-[#F1E8DC]">Foto aufnehmen oder Datei wählen</span>
                <span className="text-[10px] text-[#918577]">JPG, PNG bis 10MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleSimulatePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                !canSubmit
                  ? 'bg-[#272822] text-[#918577] border border-[#34332D] cursor-not-allowed'
                  : 'bg-[#C48A4A] hover:bg-[#C48A4A]/90 text-[#0B0C0B] active:scale-98'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Schadensmeldung verbindlich absenden</span>
            </button>

            {!canSubmit && (
              <p className="text-[10px] text-[#B8413D] text-center font-semibold">
                {isOffline
                  ? 'Offline: Schreiben nicht möglich'
                  : isPhotoRequired && !photoUrl
                  ? 'Foto erforderlich bei schwerem oder sicherheitskritischem Schaden!'
                  : 'Bitte alle Pflichtfelder ausfüllen.'}
              </p>
            )}

            <div className="p-2.5 bg-[#141713] rounded-xl border border-[#34332D] text-[10px] text-[#918577] flex items-center gap-2">
              <Info className="w-4 h-4 text-[#5B7E86] shrink-0" />
              <span>Die formelle Gerätefreigabe kann erst nach Reparatur durch berechtigte Werkstattrollen erfolgen.</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
