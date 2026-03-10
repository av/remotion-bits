import type React from 'react';

export interface BitRegistryFile {
  path: string;
}

export interface BitRegistryMetadata {
  name?: string;
  title?: string;
  description?: string;
  type?: 'bit';
  add?: 'when-needed';
  registryDependencies?: string[];
  dependencies?: string[];
  files?: BitRegistryFile[];
}

export interface BitModuleMetadata {
  name: string;
  description: string;
  tags: string[];
  duration: number;
  width?: number;
  height?: number;
  registry?: BitRegistryMetadata;
}

export type ControlType = 'string' | 'number' | 'boolean' | 'color' | 'select';

export interface Control {
  key: string;
  type: ControlType;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: unknown }[];
}

export interface BitModule {
  metadata: BitModuleMetadata;
  Component: React.FC;
  props?: Record<string, unknown>;
  controls?: Control[];
}

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

export interface DocsBitCatalogData {
  items: RemotionBitCatalogSummary[];
  tags: string[];
  total: number;
  defaultOrder: string[];
}

export type BitCatalogResolutionReason = 'id' | 'name' | 'not-found' | 'ambiguous-name';

export interface BitCatalogResolution {
  entry: RemotionBitCatalogSummary | null;
  reason: BitCatalogResolutionReason;
  matches?: string[];
}