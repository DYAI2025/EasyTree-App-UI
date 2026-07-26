import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  CloudSun,
  Clock,
  AlertTriangle,
  CheckCheck,
  ChevronRight,
  Filter,
  X,
  ExternalLink,
  Check
} from 'lucide-react';
import { NotificationItem } from '../types';

interface MessagesViewProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigateView: (target: NotificationItem['targetView']) => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigateView
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [activeMessage, setActiveMessage] = useState<NotificationItem | null>(null);

  const categories = ['Alle', 'Planung', 'Wetter', 'Arbeitszeit', 'Schäden'];

  const filtered = selectedCategory === 'Alle'
    ? notifications
    : notifications.filter(n => n.category === selectedCategory);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'Wetter':
        return <CloudSun className="w-4 h-4 text-[#C48A4A]" />;
      case 'Planung':
        return <Calendar className="w-4 h-4 text-[#D6A875]" />;
      case 'Arbeitszeit':
        return <Clock className="w-4 h-4 text-[#7D8B55]" />;
      case 'Schäden':
        return <AlertTriangle className="w-4 h-4 text-[#B8413D]" />;
      default:
        return <Bell className="w-4 h-4 text-[#5B7E86]" />;
    }
  };

  const handleOpenMessage = (item: NotificationItem) => {
    setActiveMessage(item);
    if (!item.read) {
      onMarkRead(item.id);
    }
  };

  return (
    <div className="space-y-4 pb-24 px-4 pt-4">
      {/* Header Banner */}
      <section className="bg-[#1C201C] rounded-[20px] p-4 border border-[#34332D] space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#D6A875]">In-App Mitteilungen</span>
            <h2 className="text-xl font-extrabold text-[#F1E8DC]">Meldungen ({unreadCount} ungelesen)</h2>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-xs text-[#D6A875] hover:underline flex items-center gap-1 font-semibold bg-[#272822] px-2.5 py-1.5 rounded-lg border border-[#34332D]"
            >
              <CheckCheck className="w-4 h-4 text-[#7D8B55]" />
              <span>Alle gelesen</span>
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <Filter className="w-3.5 h-3.5 text-[#918577] shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#D6A875] text-[#2B211A] shadow-xs font-extrabold'
                  : 'bg-[#141713] text-[#C2B3A0] border border-[#34332D] hover:border-[#D6A875]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Notifications List Cards */}
      <section className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-[#141713] p-8 rounded-2xl border border-[#34332D] text-center space-y-2">
            <Bell className="w-8 h-8 text-[#918577] mx-auto opacity-50" />
            <p className="text-xs text-[#C2B3A0]">Keine Benachrichtigungen in der Kategorie "{selectedCategory}" vorhanden.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenMessage(item)}
              className={`p-4 rounded-[18px] border transition-all cursor-pointer relative ${
                !item.read
                  ? 'bg-[#1C201C] border-[#D6A875]/80 shadow-md'
                  : 'bg-[#141713] border-[#34332D] opacity-85 hover:opacity-100'
              }`}
            >
              {/* Unread indicator dot */}
              {!item.read && (
                <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-[#C48A4A] rounded-full border border-[#141713] animate-pulse" />
              )}

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-[#272822] rounded-xl border border-[#34332D] shrink-0 mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#D6A875] bg-[#272822] px-1.5 py-0.5 rounded border border-[#34332D]">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-[#918577] font-mono">• {item.timestamp}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#F1E8DC] leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#C2B3A0] mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-[#34332D]/60">
                    <span className="text-[#918577] font-mono">
                      Status: {item.read ? 'Gelesen' : 'Ungelesen'}
                    </span>
                    <span className="text-[#D6A875] font-semibold flex items-center gap-1">
                      <span>Meldung öffnen</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Message Detail Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 bg-[#0B0C0B]/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-[410px] bg-[#141713] border border-[#34332D] rounded-3xl p-5 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-6 duration-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#34332D] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#272822] rounded-xl border border-[#34332D]">
                  {getCategoryIcon(activeMessage.category)}
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#D6A875] font-bold">
                    {activeMessage.category} • {activeMessage.timestamp}
                  </span>
                  <h3 className="text-base font-extrabold text-[#F1E8DC] leading-tight">
                    {activeMessage.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setActiveMessage(null)}
                className="p-1 rounded-lg text-[#918577] hover:text-[#F1E8DC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#1C201C] p-4 rounded-2xl border border-[#34332D] space-y-2">
              <p className="text-xs text-[#F1E8DC] leading-relaxed">
                {activeMessage.description}
              </p>
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#918577]">
                <span>Mitteilungs-ID: {activeMessage.id}</span>
                <span className="text-[#7D8B55] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Als gelesen markiert
                </span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              {activeMessage.targetView && (
                <button
                  onClick={() => {
                    const target = activeMessage.targetView;
                    setActiveMessage(null);
                    if (target) onNavigateView(target);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#D6A875] hover:bg-[#c39766] text-[#2B211A] text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all"
                >
                  <span>Direkt zur Ansicht wechseln</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={() => setActiveMessage(null)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#272822] text-[#C2B3A0] hover:text-[#F1E8DC] border border-[#34332D] text-xs font-semibold text-center"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
