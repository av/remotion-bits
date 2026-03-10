export interface RemotionBitCatalogSummary {
  exportName: string;
  id: string;
  name: string;
  description: string;
  tags: string[];
  duration: number;
  width?: number;
  height?: number;
  sourcePath: string;
  componentNames: string[];
  registryDependencies: string[];
}

export interface RemotionBitCatalogEntry extends RemotionBitCatalogSummary {
  sourceCode: string;
}

export interface FindBitsOptions {
  query?: string;
  tags?: string[];
  limit?: number;
}

export type BitCatalogResolutionReason = 'id' | 'name' | 'not-found' | 'ambiguous-name';

export interface BitCatalogResolution {
  entry: RemotionBitCatalogSummary | null;
  reason: BitCatalogResolutionReason;
  matches?: string[];
}

export interface SharedBitRegistryFile {
  path: string;
}

export interface SharedBitRegistryItem {
  name: string;
  title: string;
  description: string;
  type: 'bit';
  add: 'when-needed' | 'when-added';
  registryDependencies: string[];
  dependencies: string[];
  files: [SharedBitRegistryFile];
}

export interface SharedBitInventoryEntry extends RemotionBitCatalogSummary {
  registry: SharedBitRegistryItem;
}