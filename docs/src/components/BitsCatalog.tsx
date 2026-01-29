import React, { useMemo, useState } from 'react';
import { getAllBits } from '@bits';

const buttonBase =
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors';

export const BitsCatalog: React.FC = () => {
  const allBits = useMemo(() => getAllBits(), []);
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const bit of allBits) {
      for (const tag of bit.metadata.tags) {
        tags.add(tag);
      }
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [allBits]);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredBits = useMemo(() => {
    if (!activeTag) {
      return allBits;
    }
    return allBits.filter((bit) => bit.metadata.tags.includes(activeTag));
  }, [allBits, activeTag]);

  const handleTagClick = (tag: string | null) => {
    setActiveTag((current) => (current === tag ? null : tag));
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
        {allTags.map((tag) => {
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filteredBits.map((bit) => (
          <div
            key={bit.metadata.name}
            className="rounded-xl border border-white/10 bg-[#0C0C0C] p-4"
          >
            <div className="text-base font-semibold text-white">
              {bit.metadata.name}
            </div>
            <p className="mt-2 text-sm text-white/70">
              {bit.metadata.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {bit.metadata.tags.map((tag) => {
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default BitsCatalog;
