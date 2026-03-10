import type {
  BitCatalogResolution,
  FindBitsOptions,
  RemotionBitCatalogSummary,
} from './contracts';
import { sharedBitInventory } from './inventory.generated';

const normalizeText = (value: string): string => value.trim().toLowerCase();

const tokenizeQuery = (value: string): string[] =>
  Array.from(new Set(normalizeText(value).split(/\s+/).filter(Boolean)));

const cloneSummary = (entry: RemotionBitCatalogSummary): RemotionBitCatalogSummary => ({
  ...entry,
  tags: [...entry.tags],
  componentNames: [...entry.componentNames],
  registryDependencies: [...entry.registryDependencies],
});

const normalizeTags = (tags: string[] | undefined): string[] =>
  Array.from(new Set((tags ?? []).map((tag) => normalizeText(tag)).filter(Boolean)));

const validateLimit = (limit: number | undefined): number | undefined => {
  if (limit === undefined) {
    return undefined;
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error('findBits limit must be a positive integer.');
  }

  return limit;
};

const filterByTags = (
  entries: RemotionBitCatalogSummary[],
  tags: string[]
): RemotionBitCatalogSummary[] => {
  if (tags.length === 0) {
    return entries;
  }

  return entries.filter((entry) => {
    const entryTags = entry.tags.map(normalizeText);
    return tags.every((tag) => entryTags.includes(tag));
  });
};

const scoreBitCatalogEntry = (entry: RemotionBitCatalogSummary, query: string): number => {
  if (!query) {
    return 0;
  }

  const terms = tokenizeQuery(query);
  const normalizedId = normalizeText(entry.id);
  const normalizedName = normalizeText(entry.name);
  const normalizedDescription = normalizeText(entry.description);
  const normalizedTags = entry.tags.map(normalizeText);
  const normalizedDependencies = entry.registryDependencies.map(normalizeText);

  let score = 0;

  if (normalizedId === query) {
    score += 1400;
  } else if (normalizedId.includes(query)) {
    score += 500;
  }

  if (normalizedName === query) {
    score += 1200;
  } else if (normalizedName.startsWith(query)) {
    score += 800;
  } else if (normalizedName.includes(query)) {
    score += 650;
  }

  if (normalizedTags.some((tag) => tag === query)) {
    score += 420;
  } else if (normalizedTags.some((tag) => tag.includes(query))) {
    score += 280;
  }

  if (normalizedDescription.includes(query)) {
    score += 240;
  }

  if (normalizedDependencies.some((dependency) => dependency === query)) {
    score += 200;
  } else if (normalizedDependencies.some((dependency) => dependency.includes(query))) {
    score += 120;
  }

  for (const term of terms) {
    if (normalizedName.includes(term)) {
      score += 60;
    }

    if (normalizedTags.some((tag) => tag.includes(term))) {
      score += 40;
    }

    if (normalizedDescription.includes(term)) {
      score += 25;
    }

    if (normalizedDependencies.some((dependency) => dependency.includes(term))) {
      score += 20;
    }
  }

  return score;
};

const catalogSummaries: RemotionBitCatalogSummary[] = sharedBitInventory.map((entry) => ({
  exportName: entry.exportName,
  id: entry.id,
  name: entry.name,
  description: entry.description,
  tags: [...entry.tags],
  duration: entry.duration,
  width: 'width' in entry ? entry.width : undefined,
  height: 'height' in entry ? entry.height : undefined,
  sourcePath: entry.sourcePath,
  componentNames: [...entry.componentNames],
  registryDependencies: [...entry.registryDependencies],
}));

const catalogOrder = new Map(catalogSummaries.map((entry, index) => [entry.id, index]));

export const listBitCatalog = (): RemotionBitCatalogSummary[] =>
  catalogSummaries.map((entry) => cloneSummary(entry));

export const getBitCatalogSummaries = (): RemotionBitCatalogSummary[] => listBitCatalog();

export const getBitCatalogTags = (): string[] =>
  Array.from(new Set(catalogSummaries.flatMap((entry) => entry.tags))).sort((left, right) =>
    left.localeCompare(right)
  );

export const getDocsBitCatalogData = () => ({
  items: listBitCatalog(),
  tags: getBitCatalogTags(),
  total: catalogSummaries.length,
  defaultOrder: catalogSummaries.map((entry) => entry.id),
});

export const findBits = (options: FindBitsOptions = {}): RemotionBitCatalogSummary[] => {
  const normalizedQuery = normalizeText(options.query ?? '');
  const normalizedTags = normalizeTags(options.tags);
  const limit = validateLimit(options.limit);

  const filteredEntries = filterByTags(catalogSummaries, normalizedTags);
  const matchedEntries = normalizedQuery
    ? filteredEntries
        .map((entry) => ({
          entry,
          score: scoreBitCatalogEntry(entry, normalizedQuery),
          order: catalogOrder.get(entry.id) ?? Number.MAX_SAFE_INTEGER,
        }))
        .filter((entry) => entry.score > 0)
        .sort((left, right) => {
          if (right.score !== left.score) {
            return right.score - left.score;
          }

          if (left.order !== right.order) {
            return left.order - right.order;
          }

          return left.entry.id.localeCompare(right.entry.id);
        })
        .map(({ entry }) => cloneSummary(entry))
    : filteredEntries.map((entry) => cloneSummary(entry));

  return limit === undefined ? matchedEntries : matchedEntries.slice(0, limit);
};

export const resolveBitCatalogIdentifier = (identifier: string): BitCatalogResolution => {
  const normalizedIdentifier = normalizeText(identifier);
  const byId = catalogSummaries.find((entry) => normalizeText(entry.id) === normalizedIdentifier);

  if (byId) {
    return {
      entry: cloneSummary(byId),
      reason: 'id',
    };
  }

  const nameMatches = catalogSummaries.filter(
    (entry) => normalizeText(entry.name) === normalizedIdentifier
  );

  if (nameMatches.length === 1) {
    return {
      entry: cloneSummary(nameMatches[0]),
      reason: 'name',
    };
  }

  if (nameMatches.length > 1) {
    return {
      entry: null,
      reason: 'ambiguous-name',
      matches: nameMatches.map((entry) => entry.id),
    };
  }

  return {
    entry: null,
    reason: 'not-found',
  };
};