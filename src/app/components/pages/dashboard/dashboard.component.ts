import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProgressService } from '../../../services/progress.service';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { Section, SectionProgress } from '../../../models/progress.model';
import { DSA_PATTERNS } from '../../../data/dsa-patterns.data';
import { SYSTEM_DESIGN_TOPICS } from '../../../data/system-design-topics.data';
import { DEVOPS_TOPICS } from '../../../data/devops-topics.data';
import { AWS_SERVICES } from '../../../data/aws-services.data';
import { OBSERVABILITY_TOPICS } from '../../../data/observability-topics.data';
import { GOLANG_TOPICS } from '../../../data/golang-topics.data';
import { QUEUE_TOPICS } from '../../../data/queue-topics.data';
import { CACHE_TOPICS } from '../../../data/cache-topics.data';
import { JAVA_TOPICS } from '../../../data/java-topics.data';
import { WEEKLY_SCHEDULE } from '../../../data/weekly-schedule.data';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, ProgressBarComponent],
  template: `
    <div class="dashboard">

      <!-- Overall Progress Hero -->
      <div class="hero card-flat">
        <div class="hero-content">
          <div class="hero-text">
            <h1>Interview Prep Dashboard</h1>
            <p class="hero-subtitle">Track your progress across all preparation areas</p>
          </div>
          <div class="hero-ring">
            <svg viewBox="0 0 120 120" class="ring-svg">
              <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-border)" stroke-width="10"/>
              <circle cx="60" cy="60" r="52"
                      fill="none"
                      stroke="var(--color-primary)"
                      stroke-width="10"
                      stroke-linecap="round"
                      [attr.stroke-dasharray]="ringCircumference"
                      [attr.stroke-dashoffset]="ringOffset"
                      transform="rotate(-90 60 60)"/>
            </svg>
            <span class="ring-label">{{ overall.percentage }}%</span>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-value">{{ overall.completed }}</span>
            <span class="stat-label">Completed</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ overall.total }}</span>
            <span class="stat-label">Total Items</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ totalDsaProblems }}</span>
            <span class="stat-label">DSA Problems</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ totalSdTopics }}</span>
            <span class="stat-label">SD Topics</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ scheduleChecked }}/{{ scheduleTotal }}</span>
            <span class="stat-label">Schedule Tasks</span>
          </div>
        </div>
      </div>

      <!-- Section Cards -->
      <h2 class="section-title">Sections</h2>
      <div class="grid-3 section-grid">
        @for (sec of sections; track sec.section) {
          <a [routerLink]="sec.route" class="card section-card">
            <div class="card-icon" [style.background]="sec.color + '18'" [style.color]="sec.color">
              {{ sec.icon }}
            </div>
            <div class="card-body">
              <h3>{{ sec.label }}</h3>
              <div class="card-counts">
                <span class="count-completed">{{ getProgress(sec.section).completed }}</span>
                <span class="count-sep">/</span>
                <span class="count-total">{{ getProgress(sec.section).total }}</span>
                <span class="count-label">completed</span>
              </div>
              <app-progress-bar
                [percentage]="getProgress(sec.section).percentage"
                [color]="sec.color"
                height="6px"
                [showLabel]="false"
              />
            </div>
            <div class="card-pct" [style.color]="sec.color">
              {{ getProgress(sec.section).percentage }}%
            </div>
          </a>
        }
      </div>

      <!-- Today's Focus -->
      @if (todayTasks.length > 0) {
        <h2 class="section-title">Today's Focus</h2>
        <div class="card-flat today-section">
          <div class="today-header">
            <span class="today-day">{{ todayLabel }}</span>
            <span class="today-week badge">Week {{ currentWeek }}</span>
          </div>
          <div class="today-tasks">
            @for (task of todayTasks; track task.id) {
              <div class="today-task">
                <span class="task-section-dot" [style.background]="getSectionColor(task.section)"></span>
                <span class="task-title">{{ task.title }}</span>
                <span class="badge task-type-badge" [class]="'badge-' + task.type">{{ task.type }}</span>
                <span class="task-time">{{ task.estimatedMinutes }}m</span>
              </div>
            }
          </div>
        </div>
      }

      <!-- Actions -->
      <div class="actions-row">
        <button class="btn" (click)="exportProgress()">Export Progress</button>
        <button class="btn" (click)="triggerImport()">Import Progress</button>
        <input #fileInput type="file" accept=".json" (change)="importProgress($event)" style="display:none"/>
      </div>

    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1100px;
      margin: 0 auto;
    }

    .hero {
      margin-bottom: 32px;
      padding: 28px 32px;
    }
    .hero-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 32px;
      margin-bottom: 24px;
    }
    .hero-text h1 {
      margin-bottom: 4px;
    }
    .hero-subtitle {
      color: var(--color-text-secondary);
      font-size: 0.95rem;
    }
    .hero-ring {
      position: relative;
      width: 100px;
      height: 100px;
      flex-shrink: 0;
    }
    .ring-svg {
      width: 100%;
      height: 100%;
    }
    .ring-label {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
    }
    .hero-stats {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .stat {
      flex: 1;
      min-width: 100px;
      text-align: center;
      padding: 12px 8px;
      background: var(--color-bg);
      border-radius: var(--radius-sm);
    }
    .stat-value {
      display: block;
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--color-text);
    }
    .stat-label {
      display: block;
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin-top: 2px;
    }

    .section-title {
      margin-bottom: 16px;
      margin-top: 8px;
    }

    .section-grid {
      margin-bottom: 32px;
    }

    .section-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
    }
    .section-card:hover {
      text-decoration: none;
    }
    .card-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .card-body {
      flex: 1;
      min-width: 0;
    }
    .card-body h3 {
      margin-bottom: 4px;
      font-size: 0.95rem;
    }
    .card-counts {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      margin-bottom: 8px;
    }
    .count-completed {
      font-weight: 600;
      color: var(--color-text);
    }
    .count-sep {
      margin: 0 2px;
    }
    .count-label {
      margin-left: 4px;
    }
    .card-pct {
      font-size: 1.1rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    /* Today's Focus */
    .today-section {
      margin-bottom: 32px;
    }
    .today-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .today-day {
      font-weight: 600;
      font-size: 1rem;
    }
    .today-tasks {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .today-task {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: var(--color-bg);
      border-radius: var(--radius-sm);
    }
    .task-section-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .task-title {
      flex: 1;
      font-size: 0.9rem;
    }
    .task-type-badge {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-study { background: var(--color-info-light); color: var(--color-info); }
    .badge-practice { background: var(--color-primary-light); color: var(--color-primary); }
    .badge-review { background: var(--color-warning-light); color: var(--color-warning); }
    .badge-mock { background: var(--color-danger-light); color: var(--color-danger); }
    .task-time {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      font-weight: 500;
      white-space: nowrap;
    }

    /* Actions */
    .actions-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .hero-content {
        flex-direction: column;
        text-align: center;
      }
      .hero-stats {
        flex-direction: column;
      }
      .section-card {
        flex-wrap: wrap;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private progressService = inject(ProgressService);

  sections = [
    { section: 'dsa' as Section, label: 'DSA Patterns', icon: '{ }', route: '/dsa', color: 'var(--color-primary)' },
    { section: 'system-design' as Section, label: 'System Design', icon: '\u2601', route: '/system-design', color: 'var(--color-info)' },
    { section: 'devops' as Section, label: 'DevOps', icon: '\u2699', route: '/devops', color: 'var(--color-success)' },
    { section: 'aws' as Section, label: 'AWS', icon: '\u25B3', route: '/aws', color: 'var(--color-warning)' },
    { section: 'observability' as Section, label: 'Observability', icon: '\u25CE', route: '/observability', color: 'var(--color-danger)' },
    { section: 'golang' as Section, label: 'Golang', icon: 'Go', route: '/golang', color: '#00ADD8' },
    { section: 'queues' as Section, label: 'Queues (Kafka)', icon: '\u21F6', route: '/queues', color: '#E04E39' },
    { section: 'caching' as Section, label: 'Caching (Redis)', icon: '\u26A1', route: '/caching', color: '#DC382D' },
    { section: 'java' as Section, label: 'Java & Spring', icon: '\u2615', route: '/java', color: '#E76F00' },
  ];

  overall = { total: 0, completed: 0, percentage: 0 };
  totalDsaProblems = 0;
  totalSdTopics = 0;
  scheduleChecked = 0;
  scheduleTotal = 0;

  todayTasks: { id: string; section: Section; title: string; estimatedMinutes: number; type: string }[] = [];
  todayLabel = '';
  currentWeek = 1;

  readonly ringCircumference = 2 * Math.PI * 52;
  ringOffset = this.ringCircumference;

  private sectionColorMap: Record<Section, string> = {
    'dsa': 'var(--color-primary)',
    'system-design': 'var(--color-info)',
    'devops': 'var(--color-success)',
    'aws': 'var(--color-warning)',
    'observability': 'var(--color-danger)',
    'golang': '#00ADD8',
    'queues': '#E04E39',
    'caching': '#DC382D',
    'java': '#E76F00',
  };

  ngOnInit(): void {
    this.initializeAllItems();
    this.refreshStats();
    this.loadTodayFocus();
  }

  getProgress(section: Section): SectionProgress {
    return this.progressService.getSectionProgress(section);
  }

  getSectionColor(section: Section): string {
    return this.sectionColorMap[section] || 'var(--color-text-muted)';
  }

  exportProgress(): void {
    const json = this.progressService.exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-prep-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  triggerImport(): void {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input?.click();
  }

  importProgress(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const success = this.progressService.importProgress(reader.result as string);
      if (success) {
        this.refreshStats();
      } else {
        alert('Invalid progress file format.');
      }
    };
    reader.readAsText(file);
  }

  private initializeAllItems(): void {
    // DSA: register each problem and each pattern as _topic
    const dsaItems: { topicId: string; itemId: string }[] = [];
    for (const pattern of DSA_PATTERNS) {
      dsaItems.push({ topicId: pattern.id, itemId: '_topic' });
      for (const problem of pattern.problems) {
        dsaItems.push({ topicId: pattern.id, itemId: problem.id });
      }
    }
    this.progressService.initializeItems('dsa', dsaItems);

    // System Design: each topic as _topic
    const sdItems = SYSTEM_DESIGN_TOPICS.map(t => ({ topicId: t.id, itemId: '_topic' }));
    this.progressService.initializeItems('system-design', sdItems);

    // DevOps: each topic as _topic
    const devopsItems = DEVOPS_TOPICS.map(t => ({ topicId: t.id, itemId: '_topic' }));
    this.progressService.initializeItems('devops', devopsItems);

    // AWS: each service as _topic
    const awsItems = AWS_SERVICES.map(s => ({ topicId: s.id, itemId: '_topic' }));
    this.progressService.initializeItems('aws', awsItems);

    // Observability: each topic as _topic
    const obsItems = OBSERVABILITY_TOPICS.map(t => ({ topicId: t.id, itemId: '_topic' }));
    this.progressService.initializeItems('observability', obsItems);

    // Golang: each topic as _topic
    const golangItems = GOLANG_TOPICS.map(t => ({ topicId: t.id, itemId: '_topic' }));
    this.progressService.initializeItems('golang', golangItems);

    // Queues: each topic as _topic
    const queueItems = QUEUE_TOPICS.map(t => ({ topicId: t.id, itemId: '_topic' }));
    this.progressService.initializeItems('queues', queueItems);

    // Caching: each topic as _topic
    const cacheItems = CACHE_TOPICS.map(t => ({ topicId: t.id, itemId: '_topic' }));
    this.progressService.initializeItems('caching', cacheItems);

    // Java: each topic as _topic
    const javaItems = JAVA_TOPICS.map(t => ({ topicId: t.id, itemId: '_topic' }));
    this.progressService.initializeItems('java', javaItems);

    // Initialize schedule keys
    const scheduleKeys: string[] = [];
    for (const week of WEEKLY_SCHEDULE) {
      for (const day of week.days) {
        for (const task of day.tasks) {
          scheduleKeys.push(`week-${week.week}:day-${day.day}:${task.id}`);
        }
      }
    }
    this.progressService.initializeSchedule(scheduleKeys);
  }

  private refreshStats(): void {
    this.overall = this.progressService.getOverallProgress();
    this.ringOffset = this.ringCircumference - (this.overall.percentage / 100) * this.ringCircumference;

    this.totalDsaProblems = DSA_PATTERNS.reduce((sum, p) => sum + p.problems.length, 0);
    this.totalSdTopics = SYSTEM_DESIGN_TOPICS.length;

    let checked = 0;
    let total = 0;
    for (const week of WEEKLY_SCHEDULE) {
      const wp = this.progressService.getWeekProgress(week.week);
      checked += wp.checked;
      total += wp.total;
    }
    this.scheduleChecked = checked;
    this.scheduleTotal = total;
  }

  private loadTodayFocus(): void {
    const dayOfWeek = new Date().getDay(); // 0=Sunday
    // Map to schedule day (1=Monday .. 7=Sunday)
    const scheduleDayIndex = dayOfWeek === 0 ? 7 : dayOfWeek;

    // Default to week 1
    this.currentWeek = 1;
    const weekPlan = WEEKLY_SCHEDULE.find(w => w.week === this.currentWeek);
    if (!weekPlan) return;

    const dayPlan = weekPlan.days.find(d => d.day === scheduleDayIndex);
    if (!dayPlan) return;

    this.todayLabel = dayPlan.dayLabel;
    this.todayTasks = dayPlan.tasks.map(t => ({
      id: t.id,
      section: t.section,
      title: t.title,
      estimatedMinutes: t.estimatedMinutes,
      type: t.type,
    }));
  }
}
