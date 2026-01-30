/**
 * API-сервер: отдаёт список изображений места с Яндекс.Диска по запросу.
 *
 * GET /api/places/:placeId/images — список изображений папки app:/placeId на Диске.
 * Требуется YANDEX_DISK_TOKEN в .env или окружении.
 *
 * Запуск: npm run places-api (порт 3001). В dev webpack проксирует /api/places на этот сервер.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const express = require('express');

const PORT = process.env.PLACES_API_PORT || 3001;
const API_BASE = 'https://cloud-api.yandex.net/v1/disk';
const IMAGE_MIME_PREFIX = 'image/';
const ENV_FILE = '.env';
const ENV_LINE = /^\s*([^#=]+)=(.*)$/;

const PLACE_TITLES = {
  village: 'Деревня',
  cemetery: 'Кладбище',
  quarry: 'Карьер',
  forest: 'Лес',
  kindergarten: 'Детский сад',
  playground: 'Площадка',
  'tochki-houses': 'Дома точки',
  'roof-house': 'Дома корабли',
  market: 'Рынок',
  school: 'Школа',
  pool: 'Бассейн',
  post: 'Почта',
  garages: 'Гаражи',
  stadium: 'Стадион',
  'culture-house': 'Дом культуры',
  church: 'Церковь',
  ambulatory: 'Амбулатория',
};

function loadEnv() {
  const envPath = path.join(__dirname, '..', ENV_FILE);
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const match = line.match(ENV_LINE);
    if (match) process.env[match[1].trim()] = match[2].trim();
  });
}

/**
 * GET-запрос к API Яндекс.Диска.
 */
function apiRequest(url, token) {
  return new Promise((resolve, reject) => {
    const clientRequest = https.request(
      url,
      { method: 'GET', headers: { Authorization: `OAuth ${token}` } },
      (response) => {
        let body = '';
        response.on('data', (chunk) => { body += chunk; });
        response.on('end', () => {
          try {
            const data = body ? JSON.parse(body) : {};
            if (response.statusCode >= 400) {
              reject(new Error(data.message || data.description || `HTTP ${response.statusCode}`));
            } else {
              resolve(data);
            }
          } catch (parseError) {
            reject(new Error(body || parseError.message));
          }
        });
      },
    );
    clientRequest.on('error', reject);
    clientRequest.end();
  });
}

/**
 * Возвращает список изображений места с Яндекс.Диска (прямые ссылки на скачивание).
 */
async function getPlaceImagesFromDisk(placeId, token) {
  const diskPath = `app:/${placeId}`;
  const listUrl = `${API_BASE}/resources?path=${encodeURIComponent(diskPath)}&limit=500`;
  const data = await apiRequest(listUrl, token);
  const items = (data._embedded && data._embedded.items) || [];
  const files = items.filter(
    (item) => item.type === 'file' && (item.mime_type || '').startsWith(IMAGE_MIME_PREFIX),
  );
  files.sort((fileA, fileB) => (fileA.name || '').localeCompare(fileB.name || ''));

  const title = PLACE_TITLES[placeId] || placeId;
  const images = [];
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index];
    const filePath = file.path || `${diskPath}/${file.name}`;
    const downloadUrl = `${API_BASE}/resources/download?path=${encodeURIComponent(filePath)}`;
    const linkData = await apiRequest(downloadUrl, token);
    const href = linkData.href;
    if (!href) continue;
    images.push({
      id: `${placeId}-${index + 1}`,
      src: href,
      alt: `${title}. Фото ${index + 1}`,
    });
  }
  return images;
}

loadEnv();
const token = process.env.YANDEX_DISK_TOKEN;

const app = express();
app.get('/api/places/:placeId/images', async (req, res) => {
  if (!token) {
    res.status(503).json({ error: 'YANDEX_DISK_TOKEN не задан.' });
    return;
  }
  const { placeId } = req.params;
  try {
    const images = await getPlaceImagesFromDisk(placeId, token);
    res.json({ images });
  } catch (err) {
    const notFound = [404, 'Не найдено', 'Не удалось найти'].some((p) =>
      (err.message || '').includes(String(p)),
    );
    res.status(notFound ? 404 : 500).json({ error: err.message || 'Ошибка загрузки изображений.' });
  }
});

app.listen(PORT, () => {
  console.log(`Places API: http://localhost:${PORT}, GET /api/places/:placeId/images`);
});
