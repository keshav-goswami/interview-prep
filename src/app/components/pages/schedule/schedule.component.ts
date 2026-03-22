import { Component, inject, OnInit } from '@angular/core';
import { ProgressService } from '../../../services/progress.service';
import { ProgressBarComponent } from '../../shared/progress-bar/progress-bar.component';
import { WEEKLY_SCHEDULE } from '../../../data/weekly-schedule.data';
import { WeekPlan } from '../../../models/schedule.model';
import { Section } from '../../../models/progress.model';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [ProgressBarComponent],
  template: `
    <div class="schedule-page">
      <div class="section-header">
        <h1>12-Week Study Plan</h1>
        <span class="subtitle">{{ totalChecked }}/{{ totalTasks }} tasks completed</span>
      </div>

      @for (week of weeks; track week.week) {
        <div class="week-accordion" [class.expanded]="expandedWeek === week.week">

          <!-- Week Header -->
          <button class="week-header" (click)="toggleWeek(week.week)">
            <div class="week-header-left">
              <span class="week-chevron">{{ expandedWeek === week.week ? '\u25BC' : '\u25B6' }}</span>
              <span class="week-number">Week {{ week.week }}</span>
              <span class="week-theme">{{ week.theme }}</span>
            </div>
            <div class="week-header-right">
              <app-progress-bar
                [percentage]="getWeekProgress(week.week).percentage"
                color="var(--color-primary)"
                height="6px"
                [showLabel]="false"
              />
              <span class="week-pct">{{ getWeekProgress(week.week).percentage }}%</span>
            </div>
          </button>

          <!-- Week Body (days) -->
          @if (expandedWeek === week.week) {
            <div class="week-body">
              <div class="days-grid">
                @for (day of week.days; track day.day) {
                  <div class="day-card card-flat">
                    <div class="day-header">
                      <span class="day-label">{{ day.dayLabel }}</span>
                      <span class="day-number">Day {{ day.day }}</span>
                    </div>
                    <div class="task-list">
                      @for (task of day.tasks; track task.id) {
                        <label class="task-item" [class.checked]="isChecked(week.week, day.day, task.id)">
                          <input
                            type="checkbox"
                            [checked]="isChecked(week.week, day.day, task.id)"
                            (change)="toggleTask(week.week, day.day, task.id)"
                          />
                          <span class="task-dot" [style.background]="getSectionColor(task.section)"></span>
                          <span class="task-text">{{ task.title }}</span>
                          <span class="badge task-type" [class]="'badge-' + task.type">{{ task.type }}</span>
                          <span class="task-mins">{{ task.estimatedMinutes }}m</span>
                        </label>
                      }
                      @if (day.tasks.length === 0) {
                        <div class="no-tasks">Rest day</div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }

        </div>
      }
    </div>
  `,
  styles: [`
    .schedule-page {
      max-width: 1100px;
      margin: 0 auto;
    }

    .section-header {
      display: flex;
      align-items: baseline;
      gap: 16px;
      margin-bottom: 24px;
    }
    .subtitle {
      font-size: 0.9rem;
      color: var(--color-text-secondary);
    }

    /* Week accordion */
    .week-accordion {
      margin-bottom: 12px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      overflow: hidden;
      background: var(--color-surface);
    }
    .week-accordion.expanded {
      border-color: var(--color-primary);
      box-shadow: var(--shadow);
    }

    .week-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 16px 20px;
      border: none;
      background: none;
      cursor: pointer;
      font-family: inherit;
      font-size: inherit;
      color: var(--color-text);
      gap: 16px;
      transition: background var(--transition);
    }
    .week-header:hover {
      background: var(--color-surface-hover);
    }
    .week-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .week-chevron {
      font-size: 0.7rem;
      color: var(--color-text-muted);
      width: 14px;
      text-align: center;
    }
    .week-number {
      font-weight: 700;
      font-size: 0.95rem;
      white-space: nowrap;
    }
    .week-theme {
      color: var(--color-text-secondary);
      font-size: 0.9rem;
      white-space: nowrap;
    }
    .week-header-right {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 160px;
      flex-shrink: 0;
    }
    .week-pct {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-text-secondary);
      min-width: 36px;
      text-align: right;
    }

    /* Week body */
    .week-body {
      padding: 0 20px 20px;
    }

    /* Days grid */
    .days-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .day-card {
      padding: 16px;
    }
    .day-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--color-border-light);
    }
    .day-label {
      font-weight: 600;
      font-size: 0.95rem;
    }
    .day-number {
      font-size: 0.8rem;
      color: var(--color-text-muted);
    }

    /* Task list */
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .task-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: background var(--transition);
      font-size: 0.88rem;
    }
    .task-item:hover {
      background: var(--color-surface-hover);
    }
    .task-item.checked {
      opacity: 0.55;
    }
    .task-item.checked .task-text {
      text-decoration: line-through;
    }
    .task-item input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: var(--color-primary);
      cursor: pointer;
      flex-shrink: 0;
    }
    .task-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .task-text {
      flex: 1;
      line-height: 1.4;
    }
    .task-type {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      flex-shrink: 0;
    }
    .badge-study { background: var(--color-info-light); color: var(--color-info); }
    .badge-practice { background: var(--color-primary-light); color: var(--color-primary); }
    .badge-review { background: var(--color-warning-light); color: var(--color-warning); }
    .badge-mock { background: var(--color-danger-light); color: var(--color-danger); }
    .task-mins {
      font-size: 0.78rem;
      color: var(--color-text-muted);
      font-weight: 500;
      white-space: nowrap;
      flex-shrink: 0;
    }

    .no-tasks {
      padding: 12px;
      text-align: center;
      color: var(--color-text-muted);
      font-size: 0.85rem;
      font-style: italic;
    }

    @media (max-width: 768px) {
      .week-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      .week-header-right {
        width: 100%;
      }
      .task-item {
        flex-wrap: wrap;
      }
    }
  `]
})
export class ScheduleComponent implements OnInit {
  private progressService = inject(ProgressService);

  weeks: WeekPlan[] = WEEKLY_SCHEDULE;
  expandedWeek = 1;
  totalChecked = 0;
  totalTasks = 0;

  private sectionColors: Record<Section, string> = {
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
    // Initialize all schedule keys
    const keys: string[] = [];
    for (const week of this.weeks) {
      for (const day of week.days) {
        for (const task of day.tasks) {
          keys.push(`week-${week.week}:day-${day.day}:${task.id}`);
        }
      }
    }
    this.progressService.initializeSchedule(keys);
    this.refreshTotals();
  }

  getWeekProgress(week: number): { total: number; checked: number; percentage: number } {
    return this.progressService.getWeekProgress(week);
  }

  isChecked(week: number, day: number, taskId: string): boolean {
    return this.progressService.isTaskChecked(`week-${week}:day-${day}:${taskId}`);
  }

  toggleTask(week: number, day: number, taskId: string): void {
    this.progressService.toggleTask(`week-${week}:day-${day}:${taskId}`);
    this.refreshTotals();
  }

  toggleWeek(week: number): void {
    this.expandedWeek = this.expandedWeek === week ? 0 : week;
  }

  getSectionColor(section: Section): string {
    return this.sectionColors[section] || 'var(--color-text-muted)';
  }

  private refreshTotals(): void {
    let checked = 0;
    let total = 0;
    for (const week of this.weeks) {
      const wp = this.progressService.getWeekProgress(week.week);
      checked += wp.checked;
      total += wp.total;
    }
    this.totalChecked = checked;
    this.totalTasks = total;
  }
}
