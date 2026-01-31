/**
 * Кэш path -> href для ссылок Яндекс.Диска.
 * Позволяет избежать повторного getDownloadLink при загрузке изображений.
 */

const CACHE_TTL_MS = 25 * 60 * 1000;

const cache = new Map();

function set(path, href) {
  cache.set(path, { href, expires: Date.now() + CACHE_TTL_MS });
}

function get(path) {
  const entry = cache.get(path);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(path);
    return null;
  }
  return entry.href;
}

module.exports = { get, set };
