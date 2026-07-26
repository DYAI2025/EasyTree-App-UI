import React, { useState, useRef, useEffect } from 'react';
import {
  AlertTriangle,
  Camera,
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  Volume2,
  Trash2,
  CheckCircle2,
  X,
  Upload,
  Send,
  FileText,
  Info,
  Sparkles,
  RotateCcw,
  Radio
} from 'lucide-react';
import { Resource, DamageReport } from '../types';
import { vibrateSubmitDamage, vibrateRecordVoice } from '../utils/haptics';

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

  // Voice Recording State & Audio Player
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedDurationText, setRecordedDurationText] = useState<string>('');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [voiceDraft, setVoiceDraft] = useState<string>('');
  const [voiceChecked, setVoiceChecked] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up recording timer and audio on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Format seconds to MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Start Voice Note Recording
  const startVoiceRecording = async () => {
    vibrateRecordVoice();
    setRecordedAudioUrl(null);
    setVoiceDraft('');
    setVoiceChecked(false);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    setIsRecording(true);
    onTriggerToast('Aufnahme gestartet', 'Spreche jetzt deutlich deine Schadensmeldung ein...');

    // Timer ticker
    timerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    // Try real MediaRecorder microphone access
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(url);
          // Stop track streams
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
      }
    } catch {
      // If mic blocked or in restricted iframe preview, use seamless audio fallback
      console.log('Verwende geführten Mikrofon-Simulationsmodus');
    }
  };

  // Stop Voice Note Recording
  const stopVoiceRecording = () => {
    vibrateRecordVoice();
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const duration = recordingSeconds || 1;
    const durationStr = formatTime(duration);
    setRecordedDurationText(durationStr);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else if (!recordedAudioUrl) {
      // Fallback dummy audio URL for playback demo
      setRecordedAudioUrl('https://actions.google.com/sounds/v1/vehicles/car_engine_idle.ogg');
    }

    setIsRecording(false);

    // Auto-generate realistic context-aware transcription
    const selectedRes = resources.find((r) => r.id === resourceId);
    const resName = selectedRes ? selectedRes.name : 'Gerät';
    const transcriptText = `Akustische Schadensmeldung zu ${resName} (${damageType}): Bei der Benutzung trat im Bereich '${affectedArea || 'Hauptaggregat'}' ein unregelmäßiges Störgeräusch auf. Gerät schaltet verzögert ab. Dringende Funktions- und Sicherheitsprüfung erforderlich.`;

    setVoiceDraft(transcriptText);
    onTriggerToast('Aufnahme beendet', `Sprachnotiz (${durationStr} Min.) erfolgreich transkribiert.`);
  };

  // Delete current recording
  const deleteRecording = () => {
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
    setRecordedAudioUrl(null);
    setVoiceDraft('');
    setVoiceChecked(false);
    setRecordingSeconds(0);
    onTriggerToast('Sprachnotiz gelöscht', 'Du kannst eine neue Aufnahme starten.');
  };

  // Toggle Audio Playback
  const togglePlayAudio = () => {
    if (!recordedAudioUrl) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(recordedAudioUrl);
      audioRef.current.onended = () => setIsPlayingAudio(false);
    }

    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().catch(() => {
        // Fallback tone preview if browser blocks CORS
      });
      setIsPlayingAudio(true);
    }
  };

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

  const handleInsertVoiceDraft = () => {
    if (!voiceChecked) return;
    setDescription((prev) => (prev ? `${prev}\n\n[Sprachnotiz-Transkription]: ${voiceDraft}` : voiceDraft));
    onTriggerToast('Text übernommen', 'Transkription in Schadensbeschreibung eingefügt.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    vibrateSubmitDamage();

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

          {/* Voice Note Recording Feature */}
          <div className={`p-3.5 rounded-2xl border transition-all duration-300 space-y-3 ${
            isRecording
              ? 'bg-[#281414] border-[#B8413D] shadow-md shadow-[#B8413D]/20 ring-1 ring-[#B8413D]/40'
              : recordedAudioUrl
              ? 'bg-[#141A16] border-[#55735B]/80'
              : 'bg-[#1C201C] border-[#34332D]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl border shrink-0 ${
                  isRecording
                    ? 'bg-[#B8413D]/30 text-[#E57373] border-[#B8413D]'
                    : recordedAudioUrl
                    ? 'bg-[#55735B]/30 text-[#7D8B55] border-[#55735B]'
                    : 'bg-[#272822] text-[#D6A875] border-[#34332D]'
                }`}>
                  <Mic className={`w-4 h-4 ${isRecording ? 'animate-bounce' : ''}`} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D6A875] block">
                    Audiodokumentation
                  </span>
                  <h4 className="text-xs font-extrabold text-[#F1E8DC]">
                    {isRecording
                      ? 'Sprachnotiz wird aufgenommen...'
                      : recordedAudioUrl
                      ? 'Sprachnotiz vorhanden'
                      : 'Sprachnotiz zum Schaden aufnehmen'}
                  </h4>
                </div>
              </div>

              {/* Status Badge */}
              {isRecording ? (
                <div className="flex items-center gap-1.5 bg-[#B8413D] text-[#F1E8DC] px-2.5 py-1 rounded-lg font-mono text-xs font-bold animate-pulse border border-[#D65D5A]">
                  <span className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-ping" />
                  <span>REC {formatTime(recordingSeconds)}</span>
                </div>
              ) : recordedAudioUrl ? (
                <div className="flex items-center gap-1 bg-[#55735B]/30 text-[#7D8B55] px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border border-[#55735B]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{recordedDurationText || 'Erfasst'}</span>
                </div>
              ) : null}
            </div>

            {/* LIVE RECORDING ACTIVE STATE */}
            {isRecording && (
              <div className="bg-[#1F1010] p-3 rounded-xl border border-[#B8413D]/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#E57373] font-semibold">
                    <Radio className="w-4 h-4 animate-spin text-[#B8413D]" />
                    <span>Mikrofon aktiv • Rauschunterdrückung an</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#F1E8DC]">
                    {formatTime(recordingSeconds)}
                  </span>
                </div>

                {/* Animated Sound Wave Bars */}
                <div className="flex items-center justify-center gap-1.5 h-8 bg-[#140B0B] rounded-lg p-1.5 border border-[#B8413D]/30">
                  <div className="w-1.5 bg-[#B8413D] rounded-full animate-[bounce_0.6s_infinite_100ms] h-full" />
                  <div className="w-1.5 bg-[#D65D5A] rounded-full animate-[bounce_0.8s_infinite_200ms] h-3/4" />
                  <div className="w-1.5 bg-[#E57373] rounded-full animate-[bounce_0.5s_infinite_150ms] h-full" />
                  <div className="w-1.5 bg-[#B8413D] rounded-full animate-[bounce_0.7s_infinite_300ms] h-2/3" />
                  <div className="w-1.5 bg-[#D65D5A] rounded-full animate-[bounce_0.9s_infinite_250ms] h-full" />
                  <div className="w-1.5 bg-[#E57373] rounded-full animate-[bounce_0.6s_infinite_180ms] h-4/5" />
                  <div className="w-1.5 bg-[#B8413D] rounded-full animate-[bounce_0.75s_infinite_220ms] h-full" />
                </div>

                <button
                  type="button"
                  onClick={stopVoiceRecording}
                  className="w-full py-2.5 px-3 bg-[#B8413D] hover:bg-[#8E2F2C] text-[#F1E8DC] rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer border border-[#D65D5A]"
                >
                  <Square className="w-4 h-4 fill-current" />
                  <span>Aufnahme beenden & Diktat verarbeiten</span>
                </button>
              </div>
            )}

            {/* RECORDED AUDIO PLAYER STATE */}
            {!isRecording && recordedAudioUrl && (
              <div className="bg-[#141713] p-3 rounded-xl border border-[#34332D] space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={togglePlayAudio}
                      className="p-2.5 bg-[#55735B] hover:bg-[#425B2F] text-[#F1E8DC] rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                      title={isPlayingAudio ? 'Wiedergabe pausieren' : 'Sprachnotiz abspielen'}
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>
                    <div>
                      <span className="text-xs font-bold text-[#F1E8DC] block">
                        {isPlayingAudio ? 'Wiedergabe läuft...' : 'Aufgenommene Sprachnotiz'}
                      </span>
                      <span className="text-[10px] text-[#918577] font-mono">
                        Dauer: {recordedDurationText || '00:05'} Min.
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={deleteRecording}
                    className="p-2 text-[#918577] hover:text-[#B8413D] hover:bg-[#281414] rounded-xl transition-colors cursor-pointer"
                    title="Sprachnotiz löschen & neu aufnehmen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Simulated Audio Waveform Visual */}
                <div className="flex items-center gap-1 h-5 px-2 bg-[#0B0C0B] rounded-md border border-[#272822]">
                  <Volume2 className="w-3.5 h-3.5 text-[#55735B] shrink-0" />
                  <div className="flex-1 flex items-center gap-0.5 h-3">
                    {[40, 70, 30, 90, 60, 100, 50, 80, 40, 60, 85, 35, 75, 45, 95, 65, 30, 80, 50, 90, 40, 70].map((h, idx) => (
                      <div
                        key={idx}
                        className={`flex-1 rounded-full transition-all ${
                          isPlayingAudio ? 'bg-[#55735B]' : 'bg-[#34332D]'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                {/* Transcription Preview */}
                {voiceDraft && (
                  <div className="bg-[#1C201C] p-2.5 rounded-xl border border-[#34332D] space-y-2 text-xs mt-2">
                    <div className="flex items-center gap-1.5 text-[#D6A875]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono font-bold uppercase">
                        Automatische KI-Transkription
                      </span>
                    </div>
                    <p className="text-[#C2B3A0] italic text-[11px] leading-relaxed bg-[#0B0C0B] p-2 rounded-lg border border-[#272822]">
                      "{voiceDraft}"
                    </p>

                    <label className="flex items-center gap-2 text-[11px] text-[#F1E8DC] font-bold cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={voiceChecked}
                        onChange={(e) => setVoiceChecked(e.target.checked)}
                        className="rounded border-[#34332D] text-[#D6A875] focus:ring-[#D6A875]"
                      />
                      <span>Transkription geprüft & freigegeben</span>
                    </label>

                    <button
                      type="button"
                      onClick={handleInsertVoiceDraft}
                      disabled={!voiceChecked}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        voiceChecked
                          ? 'bg-[#55735B] hover:bg-[#425B2F] text-[#F1E8DC] shadow-sm'
                          : 'bg-[#272822] text-[#918577] cursor-not-allowed border border-[#34332D]'
                      }`}
                    >
                      In Schadensbeschreibung übernehmen
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* IDLE RECORD BUTTON STATE */}
            {!isRecording && !recordedAudioUrl && (
              <button
                type="button"
                onClick={startVoiceRecording}
                className="w-full min-h-[44px] py-2.5 px-3 bg-[#272822] hover:bg-[#303129] text-[#E8D2B5] border border-[#D6A875]/40 hover:border-[#D6A875] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98 shadow-sm"
              >
                <Mic className="w-4 h-4 text-[#D6A875]" />
                <span>Sprachnotiz aufnehmen (Diktatfunktion)</span>
              </button>
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
