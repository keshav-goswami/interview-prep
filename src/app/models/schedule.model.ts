import { Section } from './progress.model';

export interface WeekPlan {
  week: number;
  theme: string;
  days: DayPlan[];
}

export interface DayPlan {
  day: number;
  dayLabel: string;
  tasks: ScheduleTask[];
}

export interface ScheduleTask {
  id: string;
  section: Section;
  topicId: string;
  title: string;
  estimatedMinutes: number;
  type: 'study' | 'practice' | 'review' | 'mock';
}
