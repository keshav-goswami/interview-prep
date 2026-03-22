import { ExternalLink } from './dsa.model';

export type CacheCategory = 'fundamentals' | 'redis' | 'patterns' | 'data-structures' | 'production' | 'alternatives';

export interface UseCaseExample {
  title: string;
  scenario: string;
  implementation: string;
}

export interface CacheTopic {
  id: string;
  title: string;
  category: CacheCategory;
  order: number;
  explanation: string;
  useCases: UseCaseExample[];
  keyCommands: { command: string; description: string }[];
  bestPractices: string[];
  interviewQuestions: string[];
  resources: ExternalLink[];
}
