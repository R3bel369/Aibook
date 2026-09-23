import React, { createContext, useContext, useState } from 'react';

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif_01",
    title: "⚠️ Unusual Transaction Detected",
    message: "A debit of ₹25,000 to Unknown Merchant was flagged for review.",
    time: "10 mins ago",
    type: "warning",
    read: false,
    link: "/anomalies"
  },
  {
    id: "notif_02",
    title: "📅 Monthly P&L Report Ready",
    message: "Your financial performance summary for August 2026 is ready for download.",
    time: "2 hours ago",
    type: "info",
    read: false,
    link: "/reports"
  },
  {
    id: "notif_03",
    title: "🔄 Recurring Payment Due",
    message: "Google Workspace subscription (₹1,800) is due tomorrow.",
    time: "5 hours ago",
    type: "info",
    read: true,
    link: "/recurring"
  },
  {
    id: "notif_04",
    title: "📊 Software Expenses Increased",
    message: "Software subscriptions increased by +25% this month.",
    time: "1 day ago",
    type: "insight",
    read: true,
    link: "/insights"
  }
];

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const addNotification = (notif) => {
    setNotifications(prev => [
      { id: `notif_${Date.now()}`, time: "Just now", read: false, ...notif },
      ...prev
    ]);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      addNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
}
