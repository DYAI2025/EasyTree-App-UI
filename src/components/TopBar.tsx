import React from 'react';
import { Bell, WifiOff } from 'lucide-react';

interface TopBarProps {
  userName: string;
  avatarInitials: string;
  unreadCount: number;
  isOffline: boolean;
  lastSynced: string;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  userName,
  avatarInitials,
  unreadCount,
  isOffline,
  lastSynced,
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

      {/* Right Section: Sync Status & Bell Button */}
      <div className="flex items-center gap-2.5">
        {isOffline ? (
          <div className="flex items-center gap-1 bg-[#B8413D]/20 border border-[#B8413D]/40 text-[#F1E8DC] text-[10px] px-2 py-1 rounded-lg">
            <WifiOff className="w-3 h-3 text-[#B8413D]" />
            <span className="font-mono text-[#B8413D]">Offline</span>
          </div>
        ) : (
          <div className="flex flex-col items-end leading-tight">
            <span className="text-[9px] uppercase font-mono text-[#7D8B55] font-semibold">Online ●</span>
            <span className="text-[9px] text-[#918577] font-mono">{lastSynced} Sync</span>
          </div>
        )}

        {/* Bell Button */}
        <button
          onClick={onOpenNotifications}
          className="relative w-8 h-8 rounded-lg bg-[#1C201C] flex items-center justify-center border border-[#34332D] text-[#C2B3A0] hover:text-[#F1E8DC] hover:border-[#D6A875]/40 transition-colors"
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

