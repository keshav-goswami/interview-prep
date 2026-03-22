import { ExternalLink } from './dsa.model';

export type QueueCategory = 'fundamentals' | 'kafka' | 'patterns' | 'production' | 'alternatives';

export interface UseCaseExample {
  title: string;
  scenario: string;
  implementation: string;
}

export interface QueueTopic {
  id: string;
  title: string;
  category: QueueCategory;
  order: number;
  explanation: string;
  useCases: UseCaseExample[];
  keyCommands: { command: string; description: string }[];
  bestPractices: string[];
  interviewQuestions: string[];
  resources: ExternalLink[];
}
