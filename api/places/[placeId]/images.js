/**
 * Vercel Serverless: GET /api/places/:placeId/images — список изображений места с Яндекс.Диска.
 * Переменная окружения: YANDEX_DISK_TOKEN.
 */

const https = require('https');

const API_BASE = 'https://cloud-api.yandex.net/v1/disk';
const IMAGE_MIME_PREFIX = 'image/';

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

function apiRequest(url, token) {
  return new Promise((resolve, reject) => {
    https
      .request(
        url,
        { method: 'GET', headers: { Authorization: `OAuth ${token}` } },
        (response) => {
          let body = '';
          response.on('data', (chunk) => {
            body += chunk;
          });
          response.on('end', () => {
            try {
              const data = body ? JSON.parse(body) : {};
              if (response.statusCode >= 400) {
                reject(
                  new Error(data.message || data.description || `HTTP ${response.statusCode}`),
                );
              } else {
                resolve(data);
              }
            } catch (parseError) {
              reject(new Error(body || parseError.message));
            }
          });
        },
      )
      .on('error', reject)
      .end();
  });
}

/**
 * Список изображений места: только метаданные, src — URL нашего прокси (картинки грузятся с того же origin).
 */
async function getPlaceImagesFromDisk(placeId, token) {
  const diskPath = `app:/${placeId}`;
  const listUrl = `${API_BASE}/resources?path=${encodeURIComponent(diskPath)}&limit=500`;
  const data = await apiRequest(listUrl, token);
  const items = (data._embedded && data._embedded.items) || [];
  const files = items.filter(
    (item) => item.type === 'file' && (item.mime_type || '').startsWith(IMAGE_MIME_PREFIX),
  );
  files.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  const title = PLACE_TITLES[placeId] || placeId;
  const images = [];
  for (let index = 0; index < files.length; index += 1) {
    images.push({
      id: `${placeId}-${index + 1}`,
      src: `/api/places/${encodeURIComponent(placeId)}/image/${index}`,
      alt: `${title}. Фото ${index + 1}`,
    });
  }
  return images;
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.YANDEX_DISK_TOKEN;
  if (!token) {
    res.status(503).json({ error: 'YANDEX_DISK_TOKEN не задан.' });
    return;
  }

  const pathname = req.url?.split('?')[0] || '';
  const segments = pathname.split('/').filter(Boolean);
  const placeId = segments[2]; // ['api', 'places', placeId, 'images']
  if (!placeId) {
    res.status(400).json({ error: 'placeId не указан.' });
    return;
  }

  try {
    const images = await getPlaceImagesFromDisk(placeId, token);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json({ images });
  } catch (err) {
    const notFound = [404, 'Не найдено', 'Не удалось найти'].some((p) =>
      (err.message || '').includes(String(p)),
    );
    res
      .status(notFound ? 404 : 500)
      .json({ error: err.message || 'Ошибка загрузки изображений.' });
  }
};
