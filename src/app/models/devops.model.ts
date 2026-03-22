import { ExternalLink } from './dsa.model';

export type DevOpsCategory = 'full-stack-lifecycle' | 'docker' | 'kubernetes' | 'ci-cd' | 'iac';

export interface CommandSnippet {
  command: string;
  description: string;
}

export interface DevOpsTopic {
  id: string;
  title: string;
  category: DevOpsCategory;
  order: number;
  explanation: string;
  keyCommands: CommandSnippet[];
  bestPractices: string[];
  interviewQuestions: string[];
  resources: ExternalLink[];
}
