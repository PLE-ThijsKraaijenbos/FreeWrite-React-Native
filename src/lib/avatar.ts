import { AvatarItem } from '@/types/user';

const DICEBEAR_BASE = 'https://api.dicebear.com/9.x/avataaars';

export type AvatarUrlOptions = { png?: boolean; size?: number };

export const PLAIN_PARAMS = new Set(['facialHairProbability', 'accessoriesProbability']);

export const PROBABILITY_PARAM: Record<string, string> = {
  facialHair: 'facialHairProbability',
  accessories: 'accessoriesProbability',
};

export function buildAvatarUrl(params: Record<string, string>, opts: AvatarUrlOptions = {}): string {
  const parts = Object.entries(params).map(([k, v]) =>
    PLAIN_PARAMS.has(k) ? `${k}=${encodeURIComponent(v)}` : `${k}[]=${encodeURIComponent(v)}`
  );
  if (opts.png && opts.size) parts.push(`size=${opts.size}`);
  const base = `${DICEBEAR_BASE}/${opts.png ? 'png' : 'svg'}`;
  const qs = parts.join('&');
  return qs ? `${base}?${qs}` : base;
}

export function applyItem(
  params: Record<string, string>,
  item: AvatarItem
): Record<string, string> {
  const probKey = PROBABILITY_PARAM[item.param_key];
  const next = { ...params, [item.param_key]: item.param_value };
  if (probKey) next[probKey] = '100';
  const dependent = dependentDefault(next, item.param_key, item.param_value);
  if (dependent && next[dependent.key] === undefined) next[dependent.key] = dependent.value;
  return next;
}

export function previewItemUrl(
  baseParams: Record<string, string>,
  item: AvatarItem,
  opts?: AvatarUrlOptions
): string {
  return buildAvatarUrl(applyItem(baseParams, item), opts);
}

// `top` values that are head coverings rather than hair (so hatColor applies).
export const HAT_TOPS = new Set(['hat', 'hijab', 'turban', 'winterHat1', 'winterHat02', 'winterHat03', 'winterHat04']);

const DEFAULT_ACCESSORIES_COLOR = '262e33';
const DEFAULT_CLOTHING_GRAPHIC = 'skullOutline';
const DEFAULT_HAT_COLOR = '262e33';
const DEFAULT_HAIR_COLOR = '4a312c';

type DependentRule = {
  parentKey: string;
  appliesTo?: (value: string) => boolean;
  dependentKey: string;
  defaultValue: (params: Record<string, string>) => string;
  hint: string;
};

const DEPENDENT_RULES: DependentRule[] = [
  {
    parentKey: 'accessories',
    dependentKey: 'accessoriesColor',
    defaultValue: () => DEFAULT_ACCESSORIES_COLOR,
    hint: 'Equip an accessory first',
  },
  {
    parentKey: 'clothing',
    appliesTo: (v) => v === 'graphicShirt',
    dependentKey: 'clothingGraphic',
    defaultValue: () => DEFAULT_CLOTHING_GRAPHIC,
    hint: 'Equip the Graphic Shirt first',
  },
  {
    parentKey: 'facialHair',
    dependentKey: 'facialHairColor',
    defaultValue: (p) => p.hairColor ?? DEFAULT_HAIR_COLOR,
    hint: 'Equip facial hair first',
  },
  {
    parentKey: 'top',
    appliesTo: (v) => HAT_TOPS.has(v),
    dependentKey: 'hatColor',
    defaultValue: () => DEFAULT_HAT_COLOR,
    hint: 'Equip a hat first',
  },
];

function dependentDefault(
  params: Record<string, string>,
  paramKey: string,
  paramValue: string
): { key: string; value: string } | null {
  const rule = DEPENDENT_RULES.find(
    (r) => r.parentKey === paramKey && (!r.appliesTo || r.appliesTo(paramValue))
  );
  if (!rule) return null;
  return { key: rule.dependentKey, value: rule.defaultValue(params) };
}

// Hint shown when `paramKey`'s parent isn't equipped; null for keys with no rule.
export function prerequisiteHint(
  paramKey: string,
  params: Record<string, string>
): string | null {
  const rule = DEPENDENT_RULES.find((r) => r.dependentKey === paramKey);
  if (!rule) return null;
  const parentValue = params[rule.parentKey];
  const probKey = PROBABILITY_PARAM[rule.parentKey];
  const met =
    parentValue !== undefined &&
    (!rule.appliesTo || rule.appliesTo(parentValue)) &&
    (!probKey || params[probKey] === '100');
  return met ? null : rule.hint;
}

// Shop/editor sections. Most map 1:1 to a param_key, but `top` (hair AND hats in
// DiceBear) splits into two; the items' param_key stays 'top' either way.
export type DisplayCategory = { id: string; title: string; match: (item: AvatarItem) => boolean };

const byKey = (key: string) => (item: AvatarItem) => item.param_key === key;

export const DISPLAY_CATEGORIES: DisplayCategory[] = [
  { id: 'accessories', title: 'Accessories', match: byKey('accessories') },
  { id: 'accessoriesColor', title: 'Accessory Colors', match: byKey('accessoriesColor') },
  { id: 'clothing', title: 'Clothing', match: byKey('clothing') },
  { id: 'clothesColor', title: 'Clothing Colors', match: byKey('clothesColor') },
  { id: 'clothingGraphic', title: 'Clothing Graphics', match: byKey('clothingGraphic') },
  { id: 'eyebrows', title: 'Eyebrows', match: byKey('eyebrows') },
  { id: 'eyes', title: 'Eyes', match: byKey('eyes') },
  { id: 'facialHair', title: 'Facial Hair', match: byKey('facialHair') },
  { id: 'facialHairColor', title: 'Facial Hair Colors', match: byKey('facialHairColor') },
  { id: 'mouth', title: 'Mouths', match: byKey('mouth') },
  { id: 'hair', title: 'Hair', match: (i) => i.param_key === 'top' && !HAT_TOPS.has(i.param_value) },
  { id: 'hats', title: 'Hats', match: (i) => i.param_key === 'top' && HAT_TOPS.has(i.param_value) },
  { id: 'hairColor', title: 'Hair Colors', match: byKey('hairColor') },
  { id: 'hatColor', title: 'Hat Colors', match: byKey('hatColor') },
  { id: 'skinColor', title: 'Skin Colors', match: byKey('skinColor') },
];
