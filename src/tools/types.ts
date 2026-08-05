import { ComponentType, LazyExoticComponent } from 'react';

export type ToolCategory = 'convert' | 'edit' | 'security';

export interface FAQItem {
  qKey: string;
  aKey: string;
}

export interface ToolDefinition {
  slug: string;
  nameKey: string;
  shortDescKey: string;
  descriptionKey: string;
  icon: string;
  category: ToolCategory;
  keywords: string[];
  seoTitleKey: string;
  seoDescKey: string;
  component: LazyExoticComponent<ComponentType>;
  acceptTypes: string[];
  multiple: boolean;
  featuresKey: string;
  howToUseKey: string;
  whyUseKey: string;
  faqKey: string;
  gradient: string;
}
