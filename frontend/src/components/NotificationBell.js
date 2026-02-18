import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NotificationBell.css';
import api from '../api/axios';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await api.get('/notifications/unread', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
            setUnreadCount(res.data.length);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    const markAsRead = async (notificationId, link) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(`/notifications/${notificationId}/mark-read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Optimistically update UI
            setNotifications(prev => prev.filter(n => n.notification_id !== notificationId));
            setUnreadCount(prev => Math.max(0, prev - 1));

            if (link) navigate(link);
            setShowDropdown(false);
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="notification-bell-container">
            <button
                className="notification-bell"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="Notifications"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {showDropdown && (
                <>
                    <div className="notification-backdrop" onClick={() => setShowDropdown(false)} />
                    <div className="notification-dropdown">
                        <div className="notification-header">
                            <h3>Notifications</h3>
                            {unreadCount > 0 && <span className="unread-count">{unreadCount} new</span>}
                        </div>

                        {notifications.length === 0 ? (
                            <div className="no-notifications">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                                <p>No notifications yet</p>
                            </div>
                        ) : (
                            <div className="notification-list">
                                {notifications.map(notif => (
                                    <div
                                        key={notif.notification_id}
                                        className={`notification-item ${!notif.is_read ? 'unread' : ''} ${notif.type}`}
                                        onClick={() => markAsRead(notif.notification_id, notif.link)}
                                    >
                                        {!notif.is_read && <span className="unread-dot"></span>}
                                        <div className="notification-content">
                                            <h4>{notif.title}</h4>
                                            <p>{notif.message}</p>
                                            <span className="notification-time">{formatTime(notif.created_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
