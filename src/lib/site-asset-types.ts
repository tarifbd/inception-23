export type SiteAssetKind = 'image' | 'video' | 'animation' | 'font' | 'document' | 'system' | 'other';

export type SiteAssetSource = 'built-in' | 'uploaded';

export type SiteAsset = {
  id: string;
  name: string;
  fileName: string;
  url: string;
  mimeType: string;
  extension: string;
  size: number;
  altText: string;
  kind: SiteAssetKind;
  source: SiteAssetSource;
  readOnly: boolean;
  usage: string[];
  createdAt?: string;
};

