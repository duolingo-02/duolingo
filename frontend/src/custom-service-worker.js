import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";

// Met en cache les fichiers statiques générés lors du build (HTML, JS, CSS, images)
precacheAndRoute(self.__WB_MANIFEST);

// Cache les fichiers CSS, JS et les images avec StaleWhileRevalidate (mise à jour en arrière-plan)
registerRoute(
  ({ request }) =>
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "static-resources",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60, // Limite le nombre de fichiers statiques en cache à 60
        maxAgeSeconds: 30 * 24 * 60 * 60, // Garde ces fichiers pendant 30 jours
      }),
    ],
  })
);

// Utilise NetworkFirst pour les documents HTML pour permettre un cache hors-ligne
registerRoute(
  ({ request }) => request.destination === "document",
  new NetworkFirst({
    cacheName: "html-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Seules les réponses avec un statut 0 ou 200 seront mises en cache
      }),
    ],
  })
);

// Utilise NetworkFirst pour tous les appels API afin de garder les données récentes avec un fallback en cache
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"), // Modifie selon le chemin de tes API
  new NetworkFirst({
    cacheName: "api-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Seules les réponses avec un statut 0 ou 200 seront mises en cache
      }),
      new ExpirationPlugin({
        maxEntries: 50, // Limite à 50 réponses d'API mises en cache
        maxAgeSeconds: 5 * 60, // Les réponses API seront gardées en cache pendant 5 minutes
      }),
    ],
  })
);

// Utilise CacheFirst pour les appels API si tu veux prioriser les données en cache, et utiliser le réseau en fallback
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"), // Modifie selon le chemin de tes API
  new CacheFirst({
    cacheName: "api-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200], // Seules les réponses avec un statut 0 ou 200 seront mises en cache
      }),
      new ExpirationPlugin({
        maxEntries: 50, // Limite à 50 réponses d'API en cache
        maxAgeSeconds: 5 * 60, // Les réponses API seront gardées en cache pendant 5 minutes
      }),
    ],
  })
);
