import React from 'react';
import { Bell, WifiOff, Sun, Moon } from 'lucide-react';

interface TopBarProps {
  userName: string;
  avatarInitials: string;
  unreadCount: number;
  isOffline: boolean;
  lastSynced: string;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  userName,
  avatarInitials,
  unreadCount,
  isOffline,
  lastSynced,
  isDarkMode = true,
  onToggleDarkMode,
  onOpenNotifications,
  onOpenProfile
}) => {
  return (
    <header className="sticky top-0 z-30 px-5 pt-6 pb-4 bg-[#141713] border-b border-[#080908] flex items-center justify-between shrink-0">
      {/* Left: Avatar & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full bg-[#272822] flex items-center justify-center border border-[#34332D] text-[#D6A875] font-bold text-sm tracking-tighter shrink-0 cursor-pointer hover:border-[#D6A875]/50 transition-colors"
          title="Profil & Einstellungen"
          aria-label="Profil"
        >
          {avatarInitials}
        </button>

        <div>
          <h2 className="text-[11px] uppercase tracking-widest text-[#918577] font-semibold">Guten Morgen</h2>
          <p className="text-[15px] font-medium leading-none text-[#F1E8DC] mt-0.5">{userName}</p>
        </div>
      </div>

      {/* Right Section: Sync Status, Theme Toggle & Bell Button */}
      <div className="flex items-center gap-2">
        {isOffline ? (
          <div className="flex items-center gap-1 bg-[#B8413D]/20 border border-[#B8413D]/40 text-[#F1E8DC] text-[10px] px-2 py-1 rounded-lg">
            <WifiOff className="w-3 h-3 text-[#B8413D]" />
            <span className="font-mono text-[#B8413D]">Offline</span>
          </div>
        ) : (
          <div className="flex flex-col items-end leading-tight mr-0.5">
            <span className="text-[9px] uppercase font-mono text-[#7D8B55] font-semibold">Online ●</span>
            <span className="text-[9px] text-[#918577] font-mono">{lastSynced} Sync</span>
          </div>
        )}

        {/* Theme Toggle Switch Button */}
        {onToggleDarkMode && (
          <button
            onClick={onToggleDarkMode}
            className="w-8 h-8 rounded-lg bg-[#1C201C] flex items-center justify-center border border-[#34332D] text-[#D6A875] hover:text-[#F1E8DC] hover:border-[#D6A875]/60 transition-all cursor-pointer active:scale-95"
            aria-label={isDarkMode ? 'Zu Hellmodus umschalten' : 'Zu Dunkelmodus umschalten'}
            title={isDarkMode ? 'Hellmodus aktivieren (#E9F4EA)' : 'Dunkelmodus aktivieren'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-[#D6A875]" />
            ) : (
              <Moon className="w-4 h-4 text-[#3B4A3B]" />
            )}
          </button>
        )}

        {/* Bell Button */}
        <button
          onClick={onOpenNotifications}
          className="relative w-8 h-8 rounded-lg bg-[#1C201C] flex items-center justify-center border border-[#34332D] text-[#C2B3A0] hover:text-[#F1E8DC] hover:border-[#D6A875]/40 transition-colors cursor-pointer active:scale-95"
          aria-label={`Benachrichtigungen (${unreadCount} ungelesen)`}
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] bg-[#C48A4A] text-[#2B211A] text-[9px] font-extrabold flex items-center justify-center rounded-full px-0.5 border border-[#141713]">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};


