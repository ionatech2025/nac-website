/** Upper bound for any public list, whatever the caller asks for (B9-01). */
export const MAX_PAGE_SIZE = 100;

export function boundedTake(limit: number, max = MAX_PAGE_SIZE): number {
  const n = Math.floor(Number(limit));
  return Number.isFinite(n) ? Math.min(Math.max(n, 1), max) : max;
}

export type PageRequest = { page?: number; pageSize?: number };

export type Page<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

/** Normalises ?page= input (1-based; junk → page 1) into skip/take. */
export function pageWindow({ page = 1, pageSize = 12 }: PageRequest = {}) {
  const size = boundedTake(pageSize);
  const current = Math.max(1, Math.floor(Number(page)) || 1);
  return { page: current, pageSize: size, skip: (current - 1) * size, take: size };
}

export function toPage<T>(
  items: T[],
  total: number,
  window: { page: number; pageSize: number },
): Page<T> {
  return {
    items,
    total,
    page: window.page,
    pageSize: window.pageSize,
    pageCount: Math.max(1, Math.ceil(total / window.pageSize)),
  };
}
