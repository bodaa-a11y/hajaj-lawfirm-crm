// Service for Managing Web Push Notifications & Realtime Alerts to Client Devices

export interface DeviceNotification {
  id: string;
  orderNumber: string;
  title: string;
  body: string;
  type?: 'appointment' | 'status_update' | 'message';
  url?: string;
  isRead?: number | boolean;
  createdAt: string;
}

class NotificationService {
  private registered = false;
  private permission: NotificationPermission = 'default';
  private soundAudio: HTMLAudioElement | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      this.permission = Notification.permission;
      this.initServiceWorker();
    }
  }

  // Initialize service worker
  async initServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return null;
    }

    try {
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      this.registered = true;
      return reg;
    } catch (e) {
      console.warn('Service worker registration failed:', e);
      return null;
    }
  }

  // Check if browser supports notifications
  isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  // Get current permission state
  getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  // Request notification permission from the client
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) return false;

    try {
      const res = await Notification.requestPermission();
      this.permission = res;
      return res === 'granted';
    } catch (e) {
      console.error('Permission request failed:', e);
      return false;
    }
  }

  // Subscribe this device to a specific Order Number (e.g. #HJ-10254)
  async subscribeDevice(orderNumber: string): Promise<boolean> {
    const granted = await this.requestPermission();
    if (!granted) return false;

    const deviceToken = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Save in localStorage for this client
    try {
      localStorage.setItem(`hajaj_notif_subscribed_${orderNumber}`, 'true');
      localStorage.setItem(`hajaj_device_token`, deviceToken);
    } catch (e) {}

    // Send subscription to server
    try {
      await fetch('/api/index.php?action=subscribe_device', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          deviceToken,
          subscription: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })
      });
      return true;
    } catch (e) {
      console.error('Failed to subscribe device to API:', e);
      return true; // Still true locally
    }
  }

  // Check if device is already subscribed
  isDeviceSubscribed(orderNumber: string): boolean {
    if (typeof window === 'undefined') return false;
    return this.getPermission() === 'granted' && 
           localStorage.getItem(`hajaj_notif_subscribed_${orderNumber}`) === 'true';
  }

  // Trigger immediate browser notification on client's device
  async showLocalNotification(title: string, options: { body: string; url?: string; tag?: string }) {
    if (this.getPermission() !== 'granted') return;

    // Play subtle audio chime
    this.playChime();

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const reg = await navigator.serviceWorker.ready;
      reg.showNotification(title, {
        body: options.body,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: options.tag || `notif-${Date.now()}`,
        data: { url: options.url || '/track' },
        vibrate: [200, 100, 200]
      } as NotificationOptions);
    } else if ('Notification' in window) {
      const notif = new Notification(title, {
        body: options.body,
        icon: '/logo.png'
      });
      notif.onclick = () => {
        window.focus();
        if (options.url) window.location.href = options.url;
      };
    }
  }

  // Play subtle chime sound
  private playChime() {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
      
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  }

  // Send Push Notification from Dashboard to a specific Client's Order
  async sendNotificationToClient(orderNumber: string, payload: {
    title: string;
    body: string;
    type?: 'appointment' | 'status_update' | 'message';
    url?: string;
  }): Promise<boolean> {
    try {
      const res = await fetch('/api/index.php?action=send_notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          title: payload.title,
          body: payload.body,
          type: payload.type || 'status_update',
          url: payload.url || `/track?order=${orderNumber}`
        })
      });

      // Also trigger local event if in same browser session for testing
      window.dispatchEvent(new CustomEvent('hajaj_new_notification', {
        detail: { orderNumber, ...payload }
      }));

      return res.ok;
    } catch (e) {
      console.error('Failed to send notification via API:', e);
      return false;
    }
  }

  // Fetch unread notifications for a client order
  async fetchNotifications(orderNumber: string): Promise<DeviceNotification[]> {
    try {
      const res = await fetch(`/api/index.php?action=get_notifications&orderNumber=${encodeURIComponent(orderNumber)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (e) {
      // Local fallback
    }
    return [];
  }

  // Mark notifications as read
  async markRead(orderNumber: string): Promise<void> {
    try {
      await fetch('/api/index.php?action=mark_notifications_read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber })
      });
    } catch (e) {}
  }
}

export const notificationService = new NotificationService();
