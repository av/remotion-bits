import React, { useMemo, useState, useTransition } from 'react';
import { getDocsBitCatalogData } from '../bits/catalog';

const buttonBase =
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors';

export const BitsCatalog: React.FC = () => {
  const catalogData = useMemo(() => getDocsBitCatalogData(), []);

  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredBits = useMemo(() => {
    if (!activeTag) {
      return catalogData.items;
    }
    return catalogData.items.filter((bit) => bit.tags.includes(activeTag));
  }, [activeTag, catalogData.items]);

  const handleTagClick = (tag: string | null) => {
    startTransition(() => {
      setActiveTag((current) => (current === tag ? null : tag));
    });
  };

  return (
    <div className="not-content space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          className={`${buttonBase} ${
            activeTag === null
              ? 'border-orange-400/60 bg-orange-500/20 text-orange-200'
              : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
          }`}
          onClick={() => handleTagClick(null)}
          aria-pressed={activeTag === null}
        >
          All
        </button>
        {catalogData.tags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              type="button"
              className={`${buttonBase} ${
                isActive
                  ? 'border-orange-400/60 bg-orange-500/20 text-orange-200'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
              }`}
              onClick={() => handleTagClick(tag)}
              aria-pressed={isActive}
            >
              {tag}
            </button>
          );
        })}
      </div>

      <div className="text-xs text-white/50">
        {filteredBits.length} bit{filteredBits.length === 1 ? '' : 's'}
        {activeTag ? ` tagged with “${activeTag}”` : ''}
      </div>

      <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 transition-opacity${isPending ? ' opacity-60' : ''}`}>
        {filteredBits.map((bit) => (
          <a
            key={bit.id}
            href={`/bits/${bit.id}`}
            className="rounded-xl border border-white/10 bg-[#0C0C0C] p-4 no-underline hover:border-white/30 transition-colors block"
          >
            <div className="text-base font-semibold text-white">
              {bit.name}
            </div>
            <p className="mt-2 text-sm text-white/70">
              {bit.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {bit.tags.map((tag) => {
                const isActive = activeTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    className={`${buttonBase} ${
                      isActive
                        ? 'border-orange-400/60 bg-orange-500/20 text-orange-200'
                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
                    }`}
                    onClick={(e) => { e.preventDefault(); handleTagClick(tag); }}
                    aria-pressed={isActive}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BitsCatalog;
