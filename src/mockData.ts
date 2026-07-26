import {
  Assignment,
  WeekDayPlan,
  ChecklistItem,
  NotificationItem,
  DamageReport,
  AbsenceRequest,
  TeamMember,
  Resource,
  WeatherData
} from './types';

export const currentUser = {
  name: 'Mika Schneider',
  role: 'Baumpfleger',
  avatarInitials: 'MS',
  phone: '+49 171 8923410',
  qualifications: ['SKT-A', 'Hubarbeitsbühne', 'Motorsäge'],
  weekConfirmedStatus: '4 von 5 Einsätzen bestätigt',
  appVersion: 'v1.4.2-timber',
  lastSynced: 'Heute, 06:10 Uhr'
};

export const sampleTeam: TeamMember[] = [
  { id: 'tm-1', name: 'Jana Krüger', role: 'Teamleitung', isLead: true, phone: '+49 172 3344120', avatarInitials: 'JK' },
  { id: 'tm-2', name: 'Erik Wagner', role: 'Baumpfleger', isLead: false, phone: '+49 173 5566778', avatarInitials: 'EW' },
  { id: 'tm-3', name: 'Samir Haddad', role: 'Bodenpersonal', isLead: false, phone: '+49 174 9900112', avatarInitials: 'SH' },
  { id: 'tm-4', name: 'Mika Schneider', role: 'Baumpfleger', isLead: false, phone: '+49 171 8923410', avatarInitials: 'MS' }
];

export const sampleResources: Resource[] = [
  { id: 'res-1', name: 'Fahrzeug P-AB 412', code: 'P-AB 412', category: 'Fahrzeug', status: 'OK', details: 'Transporter mit Pritsche' },
  { id: 'res-2', name: 'Hubarbeitsbühne HB-03', code: 'HB-03', category: 'Hubarbeitsbühne', status: 'OK', details: '21m Arbeitshöhe' },
  { id: 'res-3', name: 'Häcksler H-07', code: 'H-07', category: 'Häcksler', status: 'OK', details: 'Anhänger-Holzhäcksler' },
  { id: 'res-4', name: 'Motorsäge MS-12', code: 'MS-12', category: 'Motorsäge', status: 'OK', details: 'Stihl MS 261 C-M' }
];

export const sampleWeather: WeatherData = {
  condition: 'wechselnd bewölkt',
  tempCurrent: 22,
  tempMin: 18,
  tempMax: 25,
  humidityPct: 61,
  rainProbPct: 35,
  rainAmountMm: 0.8,
  windKmH: 18,
  gustsKmH: 54,
  ozoneForecast: '118 µg/m³',
  updatedAt: 'heute, 06:10 Uhr',
  status: 'aktuell',
  warning: {
    id: 'warn-1',
    event: 'starke Windböen',
    level: 2,
    levelColor: 'orange',
    validFrom: '14:00 Uhr',
    validTo: '18:00 Uhr',
    source: 'Deutscher Wetterdienst',
    description: 'Böen zwischen 50 und 60 km/h aus Südwest möglich.',
    informativeOnly: true
  },
  segmentsToday: [
    { timeSlot: '05–08 Uhr', condition: 'bewölkt', iconType: 'cloudy', tempMin: 18, tempMax: 20, rainProb: 20, rainAmountMm: 0.1, windKmH: 12, gustsKmH: 28, isAssignmentTime: false },
    { timeSlot: '08–11 Uhr', condition: 'wechselnd bewölkt', iconType: 'partly-cloudy', tempMin: 20, tempMax: 23, rainProb: 30, rainAmountMm: 0.3, windKmH: 16, gustsKmH: 38, isAssignmentTime: true },
    { timeSlot: '11–14 Uhr', condition: 'wolkig', iconType: 'cloudy', tempMin: 23, tempMax: 25, rainProb: 35, rainAmountMm: 0.4, windKmH: 18, gustsKmH: 45, isAssignmentTime: true },
    { timeSlot: '14–18 Uhr', condition: 'Windböen & Schauer', iconType: 'wind', tempMin: 22, tempMax: 24, rainProb: 40, rainAmountMm: 0.8, windKmH: 24, gustsKmH: 54, isAssignmentTime: true },
    { timeSlot: '18–22 Uhr', condition: 'leicht bewölkt', iconType: 'partly-cloudy', tempMin: 18, tempMax: 21, rainProb: 15, rainAmountMm: 0.0, windKmH: 14, gustsKmH: 30, isAssignmentTime: false },
    { timeSlot: '22–05 Uhr', condition: 'klar', iconType: 'sun', tempMin: 15, tempMax: 17, rainProb: 10, rainAmountMm: 0.0, windKmH: 10, gustsKmH: 20, isAssignmentTime: false }
  ],
  segmentsTomorrow: [
    { timeSlot: '05–08 Uhr', condition: 'sonnig', iconType: 'sun', tempMin: 16, tempMax: 19, rainProb: 5, rainAmountMm: 0.0, windKmH: 10, gustsKmH: 20, isAssignmentTime: false },
    { timeSlot: '08–11 Uhr', condition: 'heiter', iconType: 'sun', tempMin: 19, tempMax: 23, rainProb: 10, rainAmountMm: 0.0, windKmH: 12, gustsKmH: 22, isAssignmentTime: true },
    { timeSlot: '11–14 Uhr', condition: 'sonnig', iconType: 'sun', tempMin: 23, tempMax: 26, rainProb: 15, rainAmountMm: 0.0, windKmH: 14, gustsKmH: 25, isAssignmentTime: true },
    { timeSlot: '14–18 Uhr', condition: 'leicht bewölkt', iconType: 'partly-cloudy', tempMin: 25, tempMax: 27, rainProb: 20, rainAmountMm: 0.0, windKmH: 15, gustsKmH: 28, isAssignmentTime: true },
    { timeSlot: '18–22 Uhr', condition: 'klar', iconType: 'sun', tempMin: 20, tempMax: 24, rainProb: 10, rainAmountMm: 0.0, windKmH: 11, gustsKmH: 20, isAssignmentTime: false },
    { timeSlot: '22–05 Uhr', condition: 'sternenklar', iconType: 'sun', tempMin: 16, tempMax: 18, rainProb: 5, rainAmountMm: 0.0, windKmH: 8, gustsKmH: 15, isAssignmentTime: false }
  ]
};

export const sampleAssignment: Assignment = {
  id: 'assign-today',
  siteCode: 'PS',
  siteName: 'Park Sanssouci',
  activity: 'Kronenpflege und Baumkontrolle',
  task: 'Totholzentnahme und Sichtkontrolle der Lindenreihe',
  date: 'Montag, 27. Juli 2026',
  dateISO: '2026-07-27',
  startTime: '08:00',
  endTime: '15:30',
  address: 'Zur Historischen Mühle 1, 14469 Potsdam',
  drivingMinutes: 24,
  status: 'veröffentlicht',
  confirmationStatus: 'bestätigt',
  urgency: 'normal',
  team: sampleTeam,
  resources: sampleResources,
  briefingNotes: [
    'Zufahrt über Wirtschaftstor Nord',
    'Schlüssel bei der Parkverwaltung abholen',
    'Besucherbetrieb ab 10:00 Uhr beachten',
    'Absperrbereich vollständig kennzeichnen'
  ],
  weather: sampleWeather
};

export const sampleWeekPlan: WeekDayPlan[] = [
  {
    id: 'day-1',
    dayName: 'Montag',
    dateStr: '27.07.',
    dateISO: '2026-07-27',
    siteCode: 'PS',
    siteName: 'Park Sanssouci',
    activity: 'Kronenpflege & Baumkontrolle',
    timeRange: '08:00 – 15:30 Uhr',
    status: 'bestätigt',
    assignmentId: 'assign-today'
  },
  {
    id: 'day-2',
    dayName: 'Dienstag',
    dateStr: '28.07.',
    dateISO: '2026-07-28',
    siteCode: 'NG',
    siteName: 'Neuer Garten Potsdam',
    activity: 'Fällung & Totholzbeseitigung',
    timeRange: '07:30 – 15:00 Uhr',
    status: 'bestätigt'
  },
  {
    id: 'day-3',
    dayName: 'Mittwoch',
    dateStr: '29.07.',
    dateISO: '2026-07-29',
    siteCode: 'BP',
    siteName: 'Babelsberg Park',
    activity: 'Lichtraumprofilschnitt an Eichen',
    timeRange: '08:00 – 16:00 Uhr',
    status: 'geändert',
    isChanged: true
  },
  {
    id: 'day-4',
    dayName: 'Donnerstag',
    dateStr: '30.07.',
    dateISO: '2026-07-30',
    siteCode: 'PI',
    siteName: 'Pfaueninsel',
    activity: 'Baumkontrolle & Seilklettertechnik',
    timeRange: '08:00 – 15:30 Uhr',
    status: 'offen'
  },
  {
    id: 'day-5',
    dayName: 'Freitag',
    dateStr: '31.07.',
    dateISO: '2026-07-31',
    siteCode: 'VP',
    siteName: 'Volkspark Bornstedt',
    activity: 'Totholzpflege & Aufräumarbeiten',
    timeRange: '08:00 – 14:00 Uhr',
    status: 'offen'
  }
];

export const initialChecklist: ChecklistItem[] = [
  { id: 'chk-1', title: 'Fahrzeug und Geräte prüfen', completed: true },
  { id: 'chk-2', title: 'Absperrung aufbauen', completed: true },
  { id: 'chk-3', title: 'Lindenreihe kontrollieren', completed: false },
  { id: 'chk-4', title: 'Totholz dokumentieren', completed: false },
  { id: 'chk-5', title: 'Geräte nach Einsatz prüfen', completed: false }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'Wetter',
    title: 'Windwarnung für Park Sanssouci aktualisiert',
    timestamp: 'Vor 15 Minuten',
    description: 'DWD Stufe 2 (Orange): Starke Windböen bis 54 km/h zwischen 14:00 und 18:00 Uhr erwartet. Informativer Hinweis.',
    read: false,
    targetView: 'baustelle'
  },
  {
    id: 'notif-2',
    category: 'Planung',
    title: 'Einsatz am Mittwoch geändert',
    timestamp: 'Heute, 07:15 Uhr',
    description: 'Änderung der Startzeit bei Babelsberg Park auf 08:00 Uhr. Bitte erneut bestätigen.',
    read: false,
    targetView: 'woche'
  },
  {
    id: 'notif-3',
    category: 'Planung',
    title: 'Wochenplan verarbeitet & veröffentlicht',
    timestamp: 'Gestern, 18:00 Uhr',
    description: 'Der Einsatzplan für KW 31 (27.07. – 31.07.) steht zur Bestätigung bereit.',
    read: true,
    targetView: 'woche'
  },
  {
    id: 'notif-4',
    category: 'Arbeitszeit',
    title: 'Arbeitszeit zur Freigabe eingereicht',
    timestamp: '26.07. 16:45 Uhr',
    description: 'Deine Arbeitsstunden vom Freitag (7,5 Std.) wurden erfolgreich an die Disposition übermittelt.',
    read: true
  }
];

export const initialDamageReports: DamageReport[] = [
  {
    id: 'DMG-2026-089',
    resourceId: 'res-4',
    resourceName: 'Motorsäge MS-12',
    siteName: 'Park Sanssouci',
    timestamp: '24.07.2026, 14:10 Uhr',
    description: 'Kettenbremse sperrt gelegentlich nicht sauber beim Auslösen.',
    incident: 'Bei der Astpflege im Nahbereich der Krone aufgetreten.',
    damageType: 'Mechanischer Defekt',
    affectedArea: 'Kettenbrems-Hebel / Mechanik',
    severity: 'mittel',
    usable: 'eingeschränkt',
    voiceChecked: true,
    voiceTranscript: 'Kettenbremse rastet bei starker Druckbelastung verzögert ein. Bitte Überprüfung in der Werkstatt.',
    statusText: 'In Überprüfung (Werkstatt)'
  }
];

export const initialAbsences: AbsenceRequest[] = [
  {
    id: 'ABS-2026-012',
    type: 'Urlaub',
    startDate: '10.08.2026',
    endDate: '14.08.2026',
    isFullDay: true,
    note: 'Sommerurlaub Familie',
    status: 'genehmigt',
    submittedAt: '15.07.2026'
  }
];
