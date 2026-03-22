import { ExternalLink } from './dsa.model';

export type ObsCategory = 'metrics' | 'logging' | 'tracing' | 'alerting' | 'performance' | 'practices';

export interface ToolInfo {
  name: string;
  purpose: string;
  keyFeatures: string[];
}

export interface ObservabilityTopic {
  id: string;
  title: string;
  category: ObsCategory;
  order: number;
  explanation: string;
  tools: ToolInfo[];
  bestPractices: string[];
  interviewQuestions: string[];
  resources: ExternalLink[];
}
