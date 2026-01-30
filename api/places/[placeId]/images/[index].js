/**
 * Vercel Serverless: GET /api/places/:placeId/images/:index — прокси одного изображения с Яндекс.Диска.
 * Индекс в пути, чтобы Vercel надёжно маршрутизировал запрос.
 * Переменная окружения: YANDEX_DISK_TOKEN.
 */

const https = require('https');

const API_BASE = 'https://cloud-api.yandex.net/v1/disk';
const IMAGE_MIME_PREFIX = 'image/';
const DEFAULT_MIME = 'image/jpeg';

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
  const indexStr = segments[4];
  if (!placeId || indexStr === undefined) {
    res.status(400).json({ error: 'placeId или index не указан.' });
    return;
  }

  const index = parseInt(indexStr, 10);
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
};
