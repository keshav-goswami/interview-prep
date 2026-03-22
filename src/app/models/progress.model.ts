export type ItemStatus = 'not-started' | 'in-progress' | 'completed' | 'needs-review';
export type Section = 'dsa' | 'system-design' | 'devops' | 'aws' | 'observability' | 'golang' | 'queues' | 'caching' | 'java';

export interface ProgressStore {
  version: number;
  lastUpdated: string;
  items: Record<string, ItemStatus>;
  schedule: Record<string, boolean>;
  notes: Record<string, string>;
}

export interface SectionProgress {
  section: Section;
  label: string;
  icon: string;
  total: number;
  completed: number;
  inProgress: number;
  needsReview: number;
  percentage: number;
}
