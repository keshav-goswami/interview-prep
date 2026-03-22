import { ExternalLink } from './dsa.model';

export type GolangCategory = 'fundamentals' | 'concurrency' | 'orm' | 'patterns' | 'testing' | 'performance';

export interface CodeExample {
  title: string;
  code: string;
  explanation: string;
}

export interface GolangTopic {
  id: string;
  title: string;
  category: GolangCategory;
  order: number;
  explanation: string;
  codeExamples: CodeExample[];
  bestPractices: string[];
  commonMistakes: string[];
  interviewQuestions: string[];
  resources: ExternalLink[];
}
