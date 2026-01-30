/**
 * Общая логика работы с API Яндекс.Диска (список, ссылка на скачивание, стрим).
 * Используется в api/places/[placeId]/images.js и image.js.
 */

const https = require('https');

const API_BASE = 'https://cloud-api.yandex.net/v1/disk';
const IMAGE_MIME_PREFIX = 'image/';
const DEFAULT_MIME = 'image/jpeg';

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
          response.on('data', (chunk) => { body += chunk; });
          response.on('end', () => {
            try {
              const data = body ? JSON.parse(body) : {};
              if (response.statusCode >= 400) {
                reject(new Error(data.message || data.description || `HTTP ${response.statusCode}`));
              } else {
                resolve(data);
              }
            } catch (e) {
              reject(new Error(body || e.message));
            }
          });
        },
      )
      .on('error', reject)
      .end();
  });
}

function getDownloadLink(filePath, token) {
  const url = `${API_BASE}/resources/download?path=${encodeURIComponent(filePath)}`;
  return apiRequest(url, token).then((data) => data.href);
}

function getImageFiles(placeId, token) {
  const diskPath = `app:/${placeId}`;
  const listUrl = `${API_BASE}/resources?path=${encodeURIComponent(diskPath)}&limit=500`;
  return apiRequest(listUrl, token).then((data) => {
    const items = (data._embedded && data._embedded.items) || [];
    const files = items.filter(
      (item) => item.type === 'file' && (item.mime_type || '').startsWith(IMAGE_MIME_PREFIX),
    );
    files.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    return files;
  });
}

function pipeToResponse(downloadUrl, res, contentType) {
  return new Promise((resolve, reject) => {
    const follow = (url) => {
      https.get(url, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          const loc = response.headers.location;
          follow(loc.startsWith('http') ? loc : new URL(loc, url).href);
          return;
        }
        if (response.statusCode >= 400) {
          reject(new Error(`Download: HTTP ${response.statusCode}`));
          return;
        }
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate');
        res.status(200);
        response.pipe(res);
        response.on('end', resolve);
        response.on('error', reject);
      }).on('error', reject);
    };
    follow(downloadUrl);
  });
}

module.exports = {
  API_BASE,
  IMAGE_MIME_PREFIX,
  DEFAULT_MIME,
  PLACE_TITLES,
  apiRequest,
  getDownloadLink,
  getImageFiles,
  pipeToResponse,
};
