import apiClient from './client';

// A runaway guard, not a real limit: at 50-100 rows a page this is thousands of rows.
const MAX_PAGES = 50;

/**
 * Every row of a paginated list endpoint.
 *
 * List routes answer one page at a time ({ [key]: [...], total }) and cap
 * `limit` per route (50 or 100); a larger value is rejected outright. Pages
 * that list, filter or count everything need every row, so this walks the
 * pages until `total` is reached. Pass the route's maximum as `pageSize`.
 */
export async function fetchAllPages(path, key, { pageSize = 100, params = {} } = {}) {
  const items = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const res = await apiClient.get(path, { params: { ...params, page, limit: pageSize } });
    const data = res.data?.data || {};
    const batch = data[key] || [];
    items.push(...batch);
    if (batch.length < pageSize || items.length >= (data.total ?? items.length)) break;
  }
  return items;
}
