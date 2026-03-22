import { ExternalLink } from './dsa.model';

export type AwsCategory = 'compute' | 'storage' | 'database' | 'networking' | 'security' | 'messaging' | 'monitoring' | 'serverless' | 'containers';

export interface Comparison {
  against: string;
  criteria: string;
}

export interface AwsService {
  id: string;
  name: string;
  category: AwsCategory;
  order: number;
  oneLiner: string;
  whenToUse: string[];
  keyFeatures: string[];
  vsAlternatives: Comparison[];
  interviewTips: string[];
  resources: ExternalLink[];
}
