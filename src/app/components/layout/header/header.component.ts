import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme.service';
import { ProgressService } from '../../../services/progress.service';
import { ProfileService } from '../../../services/profile.service';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="header">
      <div class="header-left">
        <button class="hamburger" (click)="profileService.toggleMobileMenu()">
          ☰
        </button>
        <h2>Interview Preparation Tracker</h2>
      </div>
      <div class="header-right">
        <div class="overall-progress">
          <span class="progress-label">Overall</span>
          <div class="progress-bar-mini">
            <div class="progress-fill" [style.width.%]="getOverall().percentage"></div>
          </div>
          <span class="progress-pct">{{ getOverall().percentage }}%</span>
        </div>
        <button class="theme-toggle" (click)="themeService.toggle()" [title]="themeService.isDark() ? 'Switch to light' : 'Switch to dark'">
          {{ themeService.isDark() ? '☀' : '🌙' }}
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      height: var(--header-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 32px;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .header-left h2 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--color-text);
    }
    .hamburger {
      display: none;
      width: 40px;
      height: 40px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      cursor: pointer;
      font-size: 1.3rem;
      align-items: center;
      justify-content: center;
      color: var(--color-text);
      transition: all var(--transition);
      flex-shrink: 0;
    }
    .hamburger:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .overall-progress {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .progress-label {
      font-size: 0.8rem;
      color: var(--color-text-secondary);
      font-weight: 500;
    }
    .progress-bar-mini {
      width: 120px;
      height: 6px;
      background: var(--color-border);
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: var(--color-primary);
      border-radius: 3px;
      transition: width 0.3s ease;
    }
    .progress-pct {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-primary);
      min-width: 32px;
    }
    .theme-toggle {
      width: 36px;
      height: 36px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      cursor: pointer;
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition);
    }
    .theme-toggle:hover {
      border-color: var(--color-primary);
    }

    @media (max-width: 768px) {
      .header {
        padding: 0 16px;
      }
      .hamburger {
        display: flex;
      }
      .header-left h2 {
        font-size: 0.95rem;
      }
      .progress-label {
        display: none;
      }
      .progress-bar-mini {
        width: 60px;
      }
      .header-right {
        gap: 10px;
      }
    }
  `]
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  profileService = inject(ProfileService);
  private progressService = inject(ProgressService);

  getOverall() {
    return this.progressService.getOverallProgress();
  }
}
