"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";
import { AppNotification, NotificationsResponse } from "@/types";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch("/api/notifications", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to fetch notifications.");
        }

        const data: NotificationsResponse = await response.json();

        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } catch (error) {
        console.error("Fetch notifications error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);


async function handleMarkAllAsRead() {
  try {
    const response = await fetch("/api/notifications/read-all", {
      method: "PATCH",
    });

    if (!response.ok) {
      throw new Error("Unable to mark notifications as read.");
    }

    const readAt = new Date().toISOString();

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        readAt: notification.readAt ?? readAt,
      })),
    );

    setUnreadCount(0);
  } catch (error) {
    console.error("Mark all notifications as read error:", error);
  }
}


async function handleNotificationClick(notification: AppNotification) {
  try {
    if (!notification.readAt) {
      const response = await fetch(
        `/api/notifications/${notification.id}`,
        {
          method: "PATCH",
        },
      );

      if (!response.ok) {
        throw new Error("Unable to mark notification as read.");
      }

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notification.id
            ? { ...item, readAt: new Date().toISOString() }
            : item,
        ),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    setIsOpen(false);

    if (notification.link) {
      router.push(notification.link);
    }
  } catch (error) {
    console.error("Notification click error:", error);
  }
}

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-forest transition hover:bg-forest/5"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <Bell size={21} />

        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-sunset px-1 text-[10px] font-bold text-forest">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-[#E8E2D8] bg-[#FFF9F0] shadow-xl sm:w-96">
          <div className="flex items-center justify-between border-b border-[#E8E2D8] px-4 py-4">
            <h3 className="font-semibold text-forest">Notifications</h3>

            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-xs font-semibold text-forest transition hover:text-sunset disabled:opacity-50"
              disabled={unreadCount === 0 || loading}
            >
              Mark all as read
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <p className="px-4 py-8 text-center text-sm text-[#718078]">
                Loading notifications...
              </p>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="mx-auto mb-3 text-[#718078]" size={28} />

                <p className="font-medium text-forest">
                  You&apos;re all caught up!
                </p>

                <p className="mt-1 text-sm text-[#718078]">
                  No notifications yet.
                </p>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => {
                  const isUnread = !notification.readAt;

                  return (
                    <button
                      key={notification.id}
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className={`flex w-full gap-3 border-b border-[#E8E2D8] px-4 py-4 text-left transition hover:bg-forest/5 ${
                        isUnread ? "bg-forest/[0.03]" : ""
                      }`}
                    >
                      <div className="mt-1 shrink-0">
                        <span
                          className={`block h-2.5 w-2.5 rounded-full ${
                            isUnread ? "bg-sunset" : "bg-transparent"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-forest">
                            {notification.title}
                          </p>

                          {isUnread && (
                            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-sunset">
                              New
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm leading-relaxed text-[#718078]">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-xs text-[#718078]">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
