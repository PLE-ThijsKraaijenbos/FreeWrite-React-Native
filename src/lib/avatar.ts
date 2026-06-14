import { AvatarItem } from '@/types/user';

const DICEBEAR_BASE = 'https://api.dicebear.com/9.x/avataaars';

// SVG is crisp but expensive to parse/render — fine for the one big avatar on a
// screen. For the many small shop thumbnails, request a small PNG instead: it
// decodes to a cheap, cacheable bitmap. `size` only applies to the raster PNG.
export type AvatarUrlOptions = { png?: boolean; size?: number };

// DiceBear probability params are plain integers, not arrays — no [] suffix.
export const PLAIN_PARAMS = new Set(['facialHairProbability', 'accessoriesProbability']);

// Selecting these param_keys requires forcing the paired probability to 100
// so DiceBear actually renders the item (defaults are 10%).
export const PROBABILITY_COMPANION: Record<string, string> = {
  facialHair: 'facialHairProbability',
  accessories: 'accessoriesProbability',
};

// Handles both "key[]=value" and legacy "key=value" DiceBear formats.
export function parseAvatarParams(url: string): Record<string, string> {
  const qs = url.split('?')[1] ?? '';
  return Object.fromEntries(
    [...new URLSearchParams(qs)].map(([k, v]) => [k.replace('[]', ''), v])
  );
}

export function buildAvatarUrl(params: Record<string, string>, opts: AvatarUrlOptions = {}): string {
  const parts = Object.entries(params).map(([k, v]) =>
    PLAIN_PARAMS.has(k) ? `${k}=${encodeURIComponent(v)}` : `${k}[]=${encodeURIComponent(v)}`
  );
  if (opts.png && opts.size) parts.push(`size=${opts.size}`);
  const base = `${DICEBEAR_BASE}/${opts.png ? 'png' : 'svg'}`;
  const qs = parts.join('&');
  return qs ? `${base}?${qs}` : base;
}

// Selects a single item into a params map: sets its value and, when the item is
// gated behind a probability param, forces that to 100 so it always renders.
// Mirrors the "select" branch of the avatar editor's toggle.
export function applyItem(
  params: Record<string, string>,
  item: AvatarItem
): Record<string, string> {
  const probKey = PROBABILITY_COMPANION[item.param_key];
  const next = { ...params, [item.param_key]: item.param_value };
  if (probKey) next[probKey] = '100';
  return next;
}

// Builds a preview URL of `item` worn on top of the avatar described by `baseUrl`.
export function previewItemUrl(
  baseUrl: string | undefined,
  item: AvatarItem,
  opts?: AvatarUrlOptions
): string {
  return buildAvatarUrl(applyItem(parseAvatarParams(baseUrl ?? ''), item), opts);
}

// DiceBear renders SVG; some stored urls point at the legacy /png endpoint.
export const toSvgUrl = (url: string | null | undefined) => url?.replace('/png', '/svg') ?? null;

// `top` values that are head coverings rather than hair (so hatColor applies).
const HAT_TOPS = new Set(['hat', 'hijab', 'turban', 'winterHat1', 'winterHat02', 'winterHat03', 'winterHat04']);

// Some params only render when another item is equipped — e.g. an accessory
// colour does nothing without an accessory, a clothing graphic needs the Graphic
// Shirt. Each entry reports whether its prerequisite is met by a params map and
// the hint to show when it isn't. Keys not listed here always render (e.g.
// hairColor / clothesColor, since top and clothing are always set).
type Prerequisite = { hint: string; met: (params: Record<string, string>) => boolean };

export const ITEM_PREREQUISITES: Record<string, Prerequisite> = {
  accessoriesColor: {
    hint: 'Equip an accessory first',
    met: (p) => !!p.accessories && p.accessoriesProbability === '100',
  },
  clothingGraphic: {
    hint: 'Equip the Graphic Shirt first',
    met: (p) => p.clothing === 'graphicShirt',
  },
  facialHairColor: {
    hint: 'Equip facial hair first',
    met: (p) => !!p.facialHair && p.facialHairProbability === '100',
  },
  hatColor: {
    hint: 'Equip a hat first',
    met: (p) => HAT_TOPS.has(p.top),
  },
};

// Returns a hint when `paramKey`'s prerequisite is NOT met by `params`, else null.
export function prerequisiteHint(
  paramKey: string,
  params: Record<string, string>
): string | null {
  const req = ITEM_PREREQUISITES[paramKey];
  if (!req) return null;
  return req.met(params) ? null : req.hint;
}
