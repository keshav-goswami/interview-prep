import { ExternalLink } from './dsa.model';

export type JavaCategory = 'core-java' | 'spring-boot' | 'spring-security' | 'spring-data' | 'spring-cloud' | 'api-docs' | 'rate-limiting' | 'validation' | 'tooling';

export interface CodeExample {
  title: string;
  code: string;
  explanation: string;
}

export interface JavaTopic {
  id: string;
  title: string;
  category: JavaCategory;
  order: number;
  explanation: string;
  codeExamples: CodeExample[];
  bestPractices: string[];
  commonMistakes: string[];
  interviewQuestions: string[];
  resources: ExternalLink[];
}
