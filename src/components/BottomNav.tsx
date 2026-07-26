import React from 'react';
import { Sun, CalendarRange, Bell, Umbrella, User } from 'lucide-react';

export type ActiveTab = 'heute' | 'woche' | 'meldungen' | 'abwesenheit' | 'profil';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  unreadNotificationsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadNotificationsCount = 0
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'heute',
      label: 'Heute',
      icon: <Sun className="w-5 h-5 shrink-0" />
    },
    {
      id: 'woche',
      label: 'Woche',
      icon: <CalendarRange className="w-5 h-5 shrink-0" />
    },
    {
      id: 'meldungen',
      label: 'Meldungen',
      icon: <Bell className="w-5 h-5 shrink-0" />
    },
    {
      id: 'abwesenheit',
      label: 'Abwesenheit',
      icon: <Umbrella className="w-5 h-5 shrink-0" />
    },
    {
      id: 'profil',
      label: 'Profil',
      icon: <User className="w-5 h-5 shrink-0" />
    }
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-[#141713] border-t border-[#080908] h-20 flex items-center justify-around px-2 pb-2 w-full shrink-0 shadow-2xl">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`min-h-[48px] min-w-[56px] flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer active:scale-95 ${
              isActive
                ? 'bg-[#D6A875] text-[#2B211A] px-3.5 py-1.5 rounded-2xl font-bold shadow-md'
                : 'text-[#918577] hover:text-[#F1E8DC] px-2 py-1'
            }`}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className="relative">
              {item.icon}
              {item.id === 'meldungen' && unreadNotificationsCount > 0 && !isActive && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C48A4A] rounded-full border border-[#141713]" />
              )}
            </div>
            <span className="text-[10px] uppercase tracking-tighter font-semibold">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

