// Service Worker for Hajaj Law Firm Web Push Notifications
const CACHE_NAME = 'hajaj-crm-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for Push events from server
self.addEventListener('push', (event) => {
  let data = {
    title: 'شركة حجاج عبدالرحمن الضويحي للمحاماة',
    body: 'لديك تحديث جديد على طلبك القانوني',
    url: '/track',
    icon: '/logo.png',
    badge: '/logo.png'
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || '/logo.png',
    badge: data.badge || '/logo.png',
    vibrate: [200, 100, 200, 100, 200],
    tag: data.tag || 'hajaj-update-' + Date.now(),
    renotify: true,
    data: {
      url: data.url || '/track'
    },
    actions: [
      { action: 'view', title: 'عرض التفاصيل الآن' },
      { action: 'close', title: 'إغلاق' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data && event.notification.data.url 
    ? event.notification.data.url 
    : '/track';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('hajaj-lawfirm.com') && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
