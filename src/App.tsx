import React, { useState, useEffect } from 'react';
import { ActiveTab, BottomNav } from './components/BottomNav';
import { TopBar } from './components/TopBar';
import { Toast, ToastMessage } from './components/Toast';
import { OnboardingModal } from './components/OnboardingModal';
import { TodayView } from './views/TodayView';
import { WeekView } from './views/WeekView';
import { SiteDetailView } from './views/SiteDetailView';
import { MessagesView } from './views/MessagesView';
import { DamageReportModal } from './views/DamageReportModal';
import { AbsenceView } from './views/AbsenceView';
import { ProfileView } from './views/ProfileView';
import { ErrorBoundary } from './components/ErrorBoundary';

import {
  currentUser,
  sampleAssignment,
  sampleWeekPlan,
  initialChecklist,
  initialNotifications,
  initialDamageReports,
  initialAbsences
} from './mockData';

import {
  TimerState,
  WeekDayPlan,
  ChecklistItem,
  NotificationItem,
  DamageReport,
  AbsenceRequest
} from './types';

const STORAGE_KEYS = {
  TIMER: 'arboscus_timer_state_v1',
  WEEK: 'arboscus_week_plan_v1',
  CHECKLIST: 'arboscus_checklist_v1',
  NOTIFICATIONS: 'arboscus_notifs_v1',
  DAMAGES: 'arboscus_damages_v1',
  ABSENCES: 'arboscus_absences_v1',
  OFFLINE: 'arboscus_offline_mode_v1',
  ONBOARDING: 'arboscus_onboarding_seen_v1'
};

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab | 'baustelle'>('heute');

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING) !== 'true';
  });

  // Local Storage State Initialization
  const [timer, setTimer] = useState<TimerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIMER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return {
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      siteName: null,
      activityName: null,
      history: []
    };
  });

  const [weekPlan, setWeekPlan] = useState<WeekDayPlan[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.WEEK);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return sampleWeekPlan;
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialChecklist;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialNotifications;
  });

  const [damageReports, setDamageReports] = useState<DamageReport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAMAGES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialDamageReports;
  });

  const [absences, setAbsences] = useState<AbsenceRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ABSENCES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return initialAbsences;
  });

  const [isOffline, setIsOffline] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.OFFLINE) === 'true';
  });

  const [showDamageModal, setShowDamageModal] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMER, JSON.stringify(timer));
  }, [timer]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WEEK, JSON.stringify(weekPlan));
  }, [weekPlan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(checklist));
  }, [checklist]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAMAGES, JSON.stringify(damageReports));
  }, [damageReports]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ABSENCES, JSON.stringify(absences));
  }, [absences]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OFFLINE, String(isOffline));
  }, [isOffline]);

  // Live Timer Ticking Interval
  useEffect(() => {
    let interval: any = null;
    if (timer.isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => ({
          ...prev,
          elapsedSeconds: prev.elapsedSeconds + 1
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning]);

  // Trigger Toast helper
  const triggerToast = (title: string, message?: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({
      id: Date.now().toString(),
      title,
      message,
      type
    });
  };

  // Onboarding handlers
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
  };

  const handleCompleteOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
    triggerToast('Willkommen bei Arboscus!', 'Arbeitsbereich bereit. Starte jetzt deinen ersten Einsatz.');
  };

  const handleStartOnboarding = () => {
    setShowOnboarding(true);
  };

  // Timer Actions
  const handleStartTimer = () => {
    if (isOffline) {
      triggerToast('Aktion gesperrt', 'Im Offline-Modus können keine Timer gestartet werden.', 'warning');
      return;
    }
    const nowStr = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
    setTimer((prev) => ({
      ...prev,
      isRunning: true,
      startTime: prev.startTime || nowStr,
      siteName: sampleAssignment.siteName,
      activityName: sampleAssignment.activity
    }));
    triggerToast('Arbeitszeit gestartet', `Einsatz auf ${sampleAssignment.siteName} läuft.`);
  };

  const handleStopTimer = () => {
    if (isOffline) {
      triggerToast('Aktion gesperrt', 'Im Offline-Modus können keine Timer gestoppt werden.', 'warning');
      return;
    }
    const stopTimeStr = new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' Uhr';
    const hours = Math.floor(timer.elapsedSeconds / 3600);
    const minutes = Math.floor((timer.elapsedSeconds % 3600) / 60);
    const durationStr = `${hours}h ${minutes}m`;

    const newEntry = {
      id: `time-${Date.now()}`,
      siteName: timer.siteName || sampleAssignment.siteName,
      date: 'Heute',
      startTime: timer.startTime || '08:00 Uhr',
      endTime: stopTimeStr,
      durationStr,
      status: 'Zur Freigabe' as const
    };

    setTimer((prev) => ({
      ...prev,
      isRunning: false,
      history: [newEntry, ...prev.history]
    }));

    triggerToast('Arbeitszeit gestoppt', `Dauer: ${durationStr}. Der Eintrag wurde zur Freigabe eingereicht.`);
  };

  // Checklist Action
  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  };

  // Week Actions
  const handleConfirmWeek = () => {
    if (isOffline) {
      triggerToast('Aktion gesperrt', 'Im Offline-Modus können keine Einsätze bestätigt werden.', 'warning');
      return;
    }
    setWeekPlan((prev) =>
      prev.map((day) => ({
        ...day,
        status: 'bestätigt',
        isChanged: false
      }))
    );
    triggerToast('Woche bestätigt', 'Alle Termine für KW 31 wurden verbindlich bestätigt.');
  };

  const handleConfirmDay = (id: string) => {
    if (isOffline) {
      triggerToast('Aktion gesperrt', 'Im Offline-Modus können keine Einsätze bestätigt werden.', 'warning');
      return;
    }
    setWeekPlan((prev) =>
      prev.map((day) => (day.id === id ? { ...day, status: 'bestätigt', isChanged: false } : day))
    );
    triggerToast('Einsatz bestätigt', 'Der Termin wurde verbindlich bestätigt.');
  };

  const handleRejectDay = (id: string, category: string, text: string) => {
    if (isOffline) {
      triggerToast('Aktion gesperrt', 'Im Offline-Modus können keine Ablehnungen gesendet werden.', 'warning');
      return;
    }
    setWeekPlan((prev) =>
      prev.map((day) =>
        day.id === id
          ? {
              ...day,
              status: 'abgelehnt',
              rejectionReasonCategory: category,
              rejectionReasonText: text
            }
          : day
      )
    );
    triggerToast('Ablehnung gesendet', `Grund: ${category}. Die Disposition wurde benachrichtigt.`, 'warning');
  };

  // Notifications Actions
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    triggerToast('Alle Meldungen gelesen', 'Alle In-App Mitteilungen als gelesen markiert.');
  };

  // Damage Submit
  const handleSubmitDamageReport = (report: DamageReport) => {
    setDamageReports((prev) => [report, ...prev]);
    setShowDamageModal(false);
    triggerToast(
      'Schadensmeldung eingereicht',
      `Meldungs-ID: ${report.id}. Weiterleitung an Werkstatt & Disposition erfolgt.`
    );
  };

  // Absence Submit
  const handleSubmitAbsence = (absence: AbsenceRequest) => {
    setAbsences((prev) => [absence, ...prev]);
  };

  // Offline Mode Toggle
  const handleToggleOffline = () => {
    const nextState = !isOffline;
    setIsOffline(nextState);
    if (nextState) {
      triggerToast('Offline-Modus aktiv', 'Lesende Funktionen verfügbar. Schreibzugriffe deaktiviert.', 'warning');
    } else {
      triggerToast('Online-Modus aktiv', 'Verbindung wiederhergestellt. Synchronisiert.');
    }
  };

  // Reset Demo State
  const handleResetDemoState = () => {
    localStorage.clear();
    setTimer({
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      siteName: null,
      activityName: null,
      history: []
    });
    setWeekPlan(sampleWeekPlan);
    setChecklist(initialChecklist);
    setNotifications(initialNotifications);
    setDamageReports(initialDamageReports);
    setAbsences(initialAbsences);
    setIsOffline(false);
    setShowOnboarding(true);
    triggerToast('Demo zurückgesetzt', 'Alle Speicherzustände wurden auf Werkseinstellungen zurückgesetzt.');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#050505] text-[#F1E8DC] font-sans antialiased flex items-center justify-center sm:p-4">
      {/* Mobile Device Canvas Container */}
      <main className="w-full max-w-[410px] min-h-screen sm:min-h-[820px] sm:h-[820px] bg-[#0B0C0B] sm:rounded-[48px] border-0 sm:border-[10px] sm:border-[#1C201C] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden">

        {/* App Top Bar */}
        <TopBar
          userName={currentUser.name}
          avatarInitials={currentUser.avatarInitials}
          unreadCount={unreadCount}
          isOffline={isOffline}
          lastSynced={currentUser.lastSynced}
          onOpenNotifications={() => setActiveTab('meldungen')}
          onOpenProfile={() => setActiveTab('profil')}
        />

        {/* Toast Notification Engine */}
        <Toast toast={toast} onClose={() => setToast(null)} />

        {/* User Onboarding Flow Modal */}
        <OnboardingModal
          isOpen={showOnboarding}
          onClose={handleCloseOnboarding}
          onComplete={handleCompleteOnboarding}
        />

        {/* Main Content Area depending on Active View */}
        <div className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            {activeTab === 'heute' && (
              <TodayView
                assignment={sampleAssignment}
                timer={timer}
                checklist={checklist}
                isOffline={isOffline}
                onStartTimer={handleStartTimer}
                onStopTimer={handleStopTimer}
                onToggleChecklist={handleToggleChecklist}
                onOpenSiteDetail={() => setActiveTab('baustelle')}
                onOpenDamageReport={() => setShowDamageModal(true)}
                onOpenAbsence={() => setActiveTab('abwesenheit')}
                onOpenMessages={() => setActiveTab('meldungen')}
                onTriggerToast={triggerToast}
              />
            )}

            {activeTab === 'woche' && (
              <WeekView
                weekPlan={weekPlan}
                isOffline={isOffline}
                onConfirmWeek={handleConfirmWeek}
                onConfirmDay={handleConfirmDay}
                onRejectDay={handleRejectDay}
                onOpenSiteDetail={() => setActiveTab('baustelle')}
                onTriggerToast={triggerToast}
              />
            )}

            {activeTab === 'baustelle' && (
              <SiteDetailView
                assignment={sampleAssignment}
                checklist={checklist}
                onToggleChecklist={handleToggleChecklist}
                onBack={() => setActiveTab('heute')}
                onTriggerToast={triggerToast}
              />
            )}

            {activeTab === 'meldungen' && (
              <MessagesView
                notifications={notifications}
                onMarkRead={handleMarkNotificationRead}
                onMarkAllRead={handleMarkAllNotificationsRead}
                onNavigateView={(target) => {
                  if (target) setActiveTab(target);
                }}
              />
            )}

            {activeTab === 'abwesenheit' && (
              <AbsenceView
                absences={absences}
                isOffline={isOffline}
                onSubmitAbsence={handleSubmitAbsence}
                onTriggerToast={triggerToast}
              />
            )}

            {activeTab === 'profil' && (
              <ProfileView
                isOffline={isOffline}
                onToggleOffline={handleToggleOffline}
                onResetDemoState={handleResetDemoState}
                onStartOnboarding={handleStartOnboarding}
                onTriggerToast={triggerToast}
              />
            )}
          </ErrorBoundary>
        </div>

          {/* Damage Report Modal / Bottom Sheet */}
          {showDamageModal && (
            <DamageReportModal
              resources={sampleAssignment.resources}
              siteName={sampleAssignment.siteName}
              isOffline={isOffline}
              onClose={() => setShowDamageModal(false)}
              onSubmit={handleSubmitDamageReport}
              onTriggerToast={triggerToast}
            />
          )}

          {/* Fixed Bottom Navigation */}
          <BottomNav
            activeTab={activeTab === 'baustelle' ? 'heute' : activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            unreadNotificationsCount={unreadCount}
          />
        </main>
    </div>
  );
}
