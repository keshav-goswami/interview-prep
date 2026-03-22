import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ProgressService } from '../../../services/progress.service';
import { ProfileService } from '../../../services/profile.service';
import { Section } from '../../../models/progress.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="sidebar" [class.collapsed]="profileService.isCollapsed()">
      <div class="sidebar-brand">
        @if (!profileService.isCollapsed()) {
          <span class="brand-icon">&#x1f4da;</span>
          <span class="brand-text">InterviewPrep</span>
        }
        <button class="collapse-btn" (click)="profileService.toggleSidebar()" [title]="profileService.isCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'">
          {{ profileService.isCollapsed() ? '▶' : '◀' }}
        </button>
      </div>

      <div class="nav-section">
        @if (!profileService.isCollapsed()) {
          <span class="nav-label">Overview</span>
        }
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" title="Dashboard">
          <span class="nav-icon">&#9632;</span>
          @if (!profileService.isCollapsed()) {
            <span class="nav-text">Dashboard</span>
          }
        </a>
        <a routerLink="/schedule" routerLinkActive="active" class="nav-item" title="Schedule">
          <span class="nav-icon">&#128197;</span>
          @if (!profileService.isCollapsed()) {
            <span class="nav-text">Schedule</span>
          }
        </a>
      </div>

      <div class="nav-section">
        @if (!profileService.isCollapsed()) {
          <span class="nav-label">Sections</span>
        }
        @for (item of navItems; track item.route) {
          @if (profileService.isSectionEnabled(item.section)) {
            <a [routerLink]="item.route" routerLinkActive="active" class="nav-item" [title]="item.label">
              <span class="nav-icon">{{ item.icon }}</span>
              @if (!profileService.isCollapsed()) {
                <span class="nav-text">{{ item.label }}</span>
                <span class="nav-progress">{{ getProgress(item.section) }}%</span>
              }
            </a>
          }
        }
      </div>

      <div class="nav-section nav-bottom">
        <a routerLink="/settings" routerLinkActive="active" class="nav-item" title="Settings">
          <span class="nav-icon settings-icon">&#9881;</span>
          @if (!profileService.isCollapsed()) {
            <span class="nav-text">Settings</span>
          }
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      padding: 0;
      overflow-y: auto;
      z-index: 100;
      display: flex;
      flex-direction: column;
      transition: width 0.25s ease;
    }
    .sidebar.collapsed {
      width: 60px;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 16px 14px;
      border-bottom: 1px solid var(--color-border);
      min-height: 56px;
    }
    .collapsed .sidebar-brand {
      justify-content: center;
      padding: 16px 8px 14px;
    }
    .brand-icon { font-size: 1.4rem; }
    .brand-text { font-size: 1.1rem; font-weight: 700; color: var(--color-text); flex: 1; }
    .collapse-btn {
      width: 28px;
      height: 28px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-surface);
      color: var(--color-text-muted);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      flex-shrink: 0;
      transition: all var(--transition);
    }
    .collapse-btn:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .nav-section { padding: 12px 8px 4px; }
    .collapsed .nav-section { padding: 12px 6px 4px; }
    .nav-label {
      display: block;
      padding: 0 8px 8px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: var(--radius-sm);
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: all var(--transition);
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
    }
    .collapsed .nav-item {
      justify-content: center;
      padding: 9px 8px;
    }
    .nav-item:hover {
      background: var(--color-surface-hover);
      color: var(--color-text);
      text-decoration: none;
    }
    .nav-item.active {
      background: var(--color-primary-light);
      color: var(--color-primary);
      font-weight: 600;
    }
    .nav-icon { width: 20px; text-align: center; font-size: 1rem; flex-shrink: 0; }
    .settings-icon { font-size: 1.35rem; }
    .nav-text { flex: 1; }
    .nav-progress {
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--color-text-muted);
      background: var(--color-border-light);
      padding: 1px 6px;
      border-radius: 8px;
    }
    .nav-item.active .nav-progress {
      background: var(--color-primary);
      color: white;
    }
    .nav-bottom {
      margin-top: auto;
      border-top: 1px solid var(--color-border);
      padding-top: 8px;
      padding-bottom: 12px;
    }
  `]
})
export class SidebarComponent {
  private progressService = inject(ProgressService);
  profileService = inject(ProfileService);

  navItems = [
    { route: '/dsa', label: 'DSA Patterns', icon: '{ }', section: 'dsa' as Section },
    { route: '/system-design', label: 'System Design', icon: '☁', section: 'system-design' as Section },
    { route: '/golang', label: 'Golang', icon: 'Go', section: 'golang' as Section },
    { route: '/caching', label: 'Caching (Redis)', icon: '⚡', section: 'caching' as Section },
    { route: '/java', label: 'Java & Spring', icon: '☕', section: 'java' as Section },
    { route: '/queues', label: 'Queues (Kafka)', icon: '⇶', section: 'queues' as Section },
    { route: '/aws', label: 'AWS', icon: '△', section: 'aws' as Section },
    { route: '/devops', label: 'DevOps', icon: '⚙', section: 'devops' as Section },
    { route: '/observability', label: 'Observability', icon: '◎', section: 'observability' as Section },
  ];

  getProgress(section: Section): number {
    return this.progressService.getSectionProgress(section).percentage;
  }
}
