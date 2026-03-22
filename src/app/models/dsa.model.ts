export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ExternalLink {
  label: string;
  url: string;
}

export interface DsaProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  links: ExternalLink[];
  tags: string[];
}

export interface DsaPattern {
  id: string;
  name: string;
  tier: number;
  order: number;
  category: string;
  explanation: string;
  whenToUse: string[];
  trick: string;
  codeTemplate: string;
  codeLanguage: string;
  problems: DsaProblem[];
  resources: ExternalLink[];
}
