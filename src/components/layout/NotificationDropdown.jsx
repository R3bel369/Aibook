import React from 'react';
import { Bell, CheckCheck, AlertTriangle, FileSpreadsheet, Repeat, Sparkles, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function NotificationDropdown({ onClose, onNavigate }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card rounded-2xl p-4 shadow-2xl z-50 border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-slate-500 hover:text-emerald-500 font-medium"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto py-2 space-y-2">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No notifications available
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                markAsRead(n.id);
                if (n.link) onNavigate(n.link.replace('/', ''));
                onClose();
              }}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                n.read
                  ? "bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/50 dark:border-slate-800/50 opacity-75"
                  : "bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/20"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />}
                  {n.title}
                </h4>
                <span className="text-[10px] text-slate-400 shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{n.message}</p>
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-center">
          <button
            onClick={clearNotifications}
            className="text-[11px] font-semibold text-rose-500 hover:text-rose-600"
          >
            Clear all notifications
          </button>
        </div>
      )}
    </div>
  );
}
