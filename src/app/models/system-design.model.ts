import { ExternalLink } from './dsa.model';

export type SdType = 'foundation' | 'hld' | 'lld';

export interface SystemDesignTopic {
  id: string;
  title: string;
  type: SdType;
  category: string;
  order: number;
  overview: string;
  framework: string[];
  keyComponents: string[];
  scaleConsiderations: string[];
  commonMistakes: string[];
  resources: ExternalLink[];
  relatedTopics: string[];
}
