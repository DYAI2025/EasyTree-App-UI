export interface TeamMember {
  id: string;
  name: string;
  role: string;
  isLead?: boolean;
  phone?: string;
  avatarInitials: string;
}

export interface Resource {
  id: string;
  name: string;
  code: string;
  category: 'Fahrzeug' | 'Hubarbeitsbühne' | 'Häcksler' | 'Motorsäge' | 'Gerät';
  status: 'OK' | 'Eingeschränkt' | 'Sperrung';
  details?: string;
}

export interface WeatherSegment {
  timeSlot: '05–08 Uhr' | '08–11 Uhr' | '11–14 Uhr' | '14–18 Uhr' | '18–22 Uhr' | '22–05 Uhr';
  condition: string;
  iconType: 'cloudy' | 'partly-cloudy' | 'rain' | 'wind' | 'sun';
  tempMin: number;
  tempMax: number;
  rainProb: number;
  rainAmountMm: number;
  windKmH: number;
  gustsKmH: number;
  isAssignmentTime?: boolean;
}

export interface WeatherWarning {
  id: string;
  event: string;
  level: 1 | 2 | 3 | 4;
  levelColor: 'gelb' | 'orange' | 'rot' | 'violett';
  validFrom: string;
  validTo: string;
  source: string;
  description: string;
  informativeOnly: boolean;
}

export interface WeatherData {
  condition: string;
  tempCurrent: number;
  tempMin: number;
  tempMax: number;
  humidityPct: number;
  rainProbPct: number;
  rainAmountMm: number;
  windKmH: number;
  gustsKmH: number;
  ozoneForecast: string; // e.g. "118 µg/m³"
  updatedAt: string; // e.g. "heute, 06:10 Uhr"
  status: 'aktuell' | 'veraltet' | 'nicht_verfuegbar';
  warning?: WeatherWarning;
  segmentsToday: WeatherSegment[];
  segmentsTomorrow: WeatherSegment[];
}

export interface Assignment {
  id: string;
  siteCode: string; // e.g. "PS"
  siteName: string; // e.g. "Park Sanssouci"
  activity: string; // e.g. "Kronenpflege und Baumkontrolle"
  task: string; // e.g. "Totholzentnahme und Sichtkontrolle der Lindenreihe"
  date: string; // "Montag, 27. Juli 2026"
  dateISO: string; // "2026-07-27"
  startTime: string; // "08:00"
  endTime: string; // "15:30"
  address: string; // "Zur Historischen Mühle 1, 14469 Potsdam"
  drivingMinutes: number; // 24
  status: 'veröffentlicht' | 'geändert' | 'abgesagt';
  confirmationStatus: 'bestätigt' | 'offen' | 'abgelehnt';
  urgency: 'normal' | 'dringend';
  team: TeamMember[];
  resources: Resource[];
  briefingNotes: string[];
  weather: WeatherData;
}

export interface WeekDayPlan {
  id: string;
  dayName: string; // "Montag", "Dienstag", ...
  dateStr: string; // "27.07."
  dateISO: string;
  siteCode?: string;
  siteName?: string;
  activity?: string;
  timeRange?: string;
  status: 'bestätigt' | 'offen' | 'geändert' | 'dringend' | 'frei' | 'abwesend' | 'abgelehnt';
  isChanged?: boolean;
  assignmentId?: string;
  rejectionReasonCategory?: string;
  rejectionReasonText?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export interface NotificationItem {
  id: string;
  category: 'Planung' | 'Wetter' | 'Arbeitszeit' | 'Schäden';
  title: string;
  timestamp: string;
  description: string;
  read: boolean;
  targetView?: 'heute' | 'woche' | 'baustelle' | 'meldungen' | 'abwesenheit' | 'profil';
}

export interface DamageReport {
  id: string;
  resourceId: string;
  resourceName: string;
  siteName: string;
  timestamp: string;
  description: string;
  incident: string;
  damageType: string;
  affectedArea: string;
  severity: 'leicht' | 'mittel' | 'schwer' | 'sicherheitskritisch';
  usable: 'ja' | 'eingeschränkt' | 'nein';
  photoUrl?: string;
  voiceTranscript?: string;
  voiceChecked: boolean;
  statusText: string;
}

export interface AbsenceRequest {
  id: string;
  type: 'Urlaub' | 'Krankheit' | 'Sonstige';
  startDate: string;
  endDate: string;
  isFullDay: boolean;
  note?: string;
  status: 'beantragt' | 'genehmigt' | 'abgelehnt' | 'nicht_verfuegbar';
  submittedAt: string;
}

export interface TimerState {
  isRunning: boolean;
  startTime: string | null;
  elapsedSeconds: number;
  siteName: string | null;
  activityName: string | null;
  history: {
    id: string;
    siteName: string;
    date: string;
    startTime: string;
    endTime: string;
    durationStr: string;
    status: 'Zur Freigabe' | 'Freigegeben';
  }[];
}
