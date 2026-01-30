/**
 * Vercel Serverless: GET /api/places/:placeId/images — список (JSON) или одно изображение при ?index=N.
 * Также картинки по пути /api/places/:placeId/images/:index (отдельный обработчик).
 * Переменная окружения: YANDEX_DISK_TOKEN.
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

function getDownloadLink(filePath, token) {
  const url = `${API_BASE}/resources/download?path=${encodeURIComponent(filePath)}`;
  return apiRequest(url, token).then((data) => data.href);
}

function pipeToResponse(downloadUrl, res, contentType) {
  return new Promise((resolve, reject) => {
    const follow = (url) => {
      https
        .get(url, (response) => {
          const isRedirect = response.statusCode >= 300 && response.statusCode < 400;
          const location = response.headers.location;
          if (isRedirect && location) {
            const nextUrl = location.startsWith('http') ? location : new URL(location, url).href;
            follow(nextUrl);
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
        })
        .on('error', reject);
    };
    follow(downloadUrl);
  });
}

/**
 * Список файлов-изображений в папке места (отсортированы по имени).
 */
async function getImageFiles(placeId, token) {
  const diskPath = `app:/${placeId}`;
  const listUrl = `${API_BASE}/resources?path=${encodeURIComponent(diskPath)}&limit=500`;
  const data = await apiRequest(listUrl, token);
  const items = (data._embedded && data._embedded.items) || [];
  const files = items.filter(
    (item) => item.type === 'file' && (item.mime_type || '').startsWith(IMAGE_MIME_PREFIX),
  );
  files.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  return files;
}

/**
 * Метаданные для списка: id, src (URL с индексом в пути: .../images/0), alt.
 */
function buildImagesList(placeId, filesCount, baseUrl) {
  const title = PLACE_TITLES[placeId] || placeId;
  const images = [];
  const path = `/api/places/${encodeURIComponent(placeId)}/images`;
  const prefix = baseUrl || '';
  for (let i = 0; i < filesCount; i += 1) {
    images.push({
      id: `${placeId}-${i + 1}`,
      src: `${prefix}${path}/${i}`,
      alt: `${title}. Фото ${i + 1}`,
    });
  }
  return images;
}

function getPathSegments(req) {
  const raw = req.url || '';
  let pathname = raw.includes('?') ? raw.slice(0, raw.indexOf('?')) : raw;
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    try {
      pathname = new URL(pathname).pathname;
    } catch (_) {}
  }
  return pathname.split('/').filter(Boolean);
}

function getQuery(req) {
  const raw = req.url || '';
  const q = {};
  const query = req.query;
  if (query && typeof query === 'object') {
    Object.assign(q, query);
  }
  const idx = raw.indexOf('?');
  if (idx !== -1) {
    const search = raw.slice(idx + 1);
    search.split('&').forEach((pair) => {
      const eq = pair.indexOf('=');
      const k = eq === -1 ? decodeURIComponent(pair) : decodeURIComponent(pair.slice(0, eq));
      const v = eq === -1 ? '' : decodeURIComponent(pair.slice(eq + 1));
      if (k) q[k] = v;
    });
  }
  return q;
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

  const segments = getPathSegments(req);
  const placeId = segments[2];
  if (!placeId) {
    res.status(400).json({ error: 'placeId не указан.' });
    return;
  }

  const query = getQuery(req);
  const indexParam = query.index;
  const wantsImage = indexParam !== undefined && indexParam !== '';

  if (wantsImage) {
    const index = parseInt(indexParam, 10);
    if (Number.isNaN(index) || index < 0) {
      res.status(400).json({ error: 'Некорректный index.' });
      return;
    }
    try {
      const files = await getImageFiles(placeId, token);
      const file = files[index];
      if (!file) {
        res.status(404).json({ error: 'Изображение не найдено.' });
        return;
      }
      const filePath = file.path || `app:/${placeId}/${file.name}`;
      const downloadUrl = await getDownloadLink(filePath, token);
      if (!downloadUrl) {
        res.status(502).json({ error: 'Не удалось получить ссылку на файл.' });
        return;
      }
      const contentType = (file.mime_type && file.mime_type.startsWith(IMAGE_MIME_PREFIX))
        ? file.mime_type
        : DEFAULT_MIME;
      await pipeToResponse(downloadUrl, res, contentType);
    } catch (err) {
      const notFound = [404, 'Не найдено', 'Не удалось найти'].some((p) =>
        (err.message || '').includes(String(p)),
      );
      res
        .status(notFound ? 404 : 500)
        .json({ error: err.message || 'Ошибка загрузки изображения.' });
    }
    return;
  }

  try {
    const protocol = (req.headers['x-forwarded-proto'] || '').toLowerCase() === 'https' ? 'https' : 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host || '';
    const baseUrl = host ? `${protocol}://${host}` : '';
    const files = await getImageFiles(placeId, token);
    const images = buildImagesList(placeId, files.length, baseUrl);
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
