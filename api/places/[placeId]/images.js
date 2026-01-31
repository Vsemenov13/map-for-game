/**
 * GET /api/places/:placeId/images — список изображений места (JSON).
 * В src — URL вида .../image?path=...&mime=...; загрузка картинки без повторного листинга.
 * width, height — размеры для резервирования места до загрузки (без скачков в masonry).
 */

const probe = require('probe-image-size');
const { getDownloadLink, getImageFiles, PLACE_TITLES } = require('../../../lib/yandex-disk');

function getPathSegments(req) {
  const raw = req.url || '';
  const pathname = raw.includes('?') ? raw.slice(0, raw.indexOf('?')) : raw;
  let path = pathname;
  if (pathname.startsWith('http')) {
    try {
      path = new URL(pathname).pathname;
    } catch (_) {}
  }
  return path.split('/').filter(Boolean);
}

function baseUrl(req) {
  const protocol = (req.headers['x-forwarded-proto'] || '').toLowerCase() === 'https' ? 'https' : 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || '';
  return host ? `${protocol}://${host}` : '';
}

function sendError(res, status, message) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.status(status).json({ error: message });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const token = process.env.YANDEX_DISK_TOKEN;
  if (!token) {
    sendError(res, 503, 'YANDEX_DISK_TOKEN не задан.');
    return;
  }

  const segments = getPathSegments(req);
  const placeId = segments[2];
  if (!placeId) {
    sendError(res, 400, 'placeId не указан.');
    return;
  }

  try {
    const files = await getImageFiles(placeId, token);
    const title = PLACE_TITLES[placeId] || placeId;
    const prefix = baseUrl(req);
    const pathPrefix = `/api/places/${encodeURIComponent(placeId)}/image`;
    const diskPath = (file) => file.path || `app:/${placeId}/${file.name}`;
    const dimensionsList = await Promise.all(
      files.map(async (file) => {
        try {
          const href = await getDownloadLink(diskPath(file), token);
          const dims = await probe(href);
          return { width: dims.width, height: dims.height };
        } catch {
          return {};
        }
      }),
    );
    const images = files.map((file, i) => {
      const { width, height } = dimensionsList[i] || {};
      return {
        id: `${placeId}-${i + 1}`,
        src: `${prefix}${pathPrefix}?path=${encodeURIComponent(diskPath(file))}&mime=${encodeURIComponent(file.mime_type || 'image/jpeg')}`,
        alt: `${title}. Фото ${i + 1}`,
        ...(width && height && { width, height }),
      };
    });
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    res.status(200).json({ images });
  } catch (err) {
    const notFound = [404, 'Не найдено', 'Не удалось найти'].some((p) =>
      (err.message || '').includes(String(p)),
    );
    sendError(res, notFound ? 404 : 500, err.message || 'Ошибка загрузки изображений.');
  }
};
