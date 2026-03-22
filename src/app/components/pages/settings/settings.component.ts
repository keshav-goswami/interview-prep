import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../services/profile.service';
import { ProgressService } from '../../../services/progress.service';
import { Section } from '../../../models/progress.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="settings-page">
      <h1>Profile & Settings</h1>
      <p class="subtitle">Customize your learning plan. Only enabled sections will appear in the sidebar and schedule.</p>

      <!-- Profile Name -->
      <div class="card-flat settings-section">
        <h3>Your Name</h3>
        <p class="hint">Personalize your dashboard greeting</p>
        <input
          type="text"
          class="name-input"
          [ngModel]="profileService.profile().name"
          (ngModelChange)="profileService.setName($event)"
          placeholder="Enter your name..."
        />
      </div>

      <!-- Section Selector -->
      <div class="card-flat settings-section">
        <h3>Learning Sections</h3>
        <p class="hint">Toggle which sections you want to study. Disabled sections won't appear in the sidebar.</p>
        <div class="section-grid">
          @for (sec of allSections; track sec.section) {
            <label class="section-toggle" [class.enabled]="isEnabled(sec.section)">
              <div class="toggle-left">
                <span class="toggle-icon">{{ sec.icon }}</span>
                <div class="toggle-info">
                  <span class="toggle-label">{{ sec.label }}</span>
                  <span class="toggle-desc">{{ sec.description }}</span>
                </div>
              </div>
              <div class="toggle-right">
                <span class="toggle-progress">{{ getProgress(sec.section) }}%</span>
                <div class="switch" [class.on]="isEnabled(sec.section)" (click)="toggle(sec.section)">
                  <div class="switch-thumb"></div>
                </div>
              </div>
            </label>
          }
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="card-flat settings-section">
        <h3>Quick Actions</h3>
        <div class="actions">
          <button class="btn" (click)="enableAll()">Enable All Sections</button>
          <button class="btn" (click)="disableExtras()">Interview Essentials Only</button>
          <button class="btn btn-danger" (click)="confirmReset()">Reset All Progress</button>
        </div>
        <p class="hint" style="margin-top: 12px">
          "Interview Essentials" enables: DSA, System Design, Golang, Caching, Queues
        </p>
      </div>

      <!-- Data Management -->
      <div class="card-flat settings-section">
        <h3>Data Management</h3>
        <p class="hint">Export your progress to share or back up. Import to restore.</p>
        <div class="actions">
          <button class="btn" (click)="exportProgress()">Export Progress (JSON)</button>
          <button class="btn" (click)="fileInput.click()">Import Progress</button>
          <input #fileInput type="file" accept=".json" (change)="importProgress($event)" style="display:none" />
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      max-width: 800px;
      margin: 0 auto;
    }
    .settings-page h1 { margin-bottom: 4px; }
    .subtitle {
      color: var(--color-text-secondary);
      margin-bottom: 28px;
      font-size: 0.9rem;
    }
    .settings-section {
      margin-bottom: 24px;
    }
    .settings-section h3 {
      margin-bottom: 4px;
    }
    .hint {
      font-size: 0.82rem;
      color: var(--color-text-muted);
      margin-bottom: 16px;
    }

    /* Name Input */
    .name-input {
      width: 100%;
      max-width: 400px;
      padding: 10px 14px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-sm);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: 0.95rem;
      font-family: var(--font-sans);
      outline: none;
      transition: border-color var(--transition);
    }
    .name-input:focus {
      border-color: var(--color-primary);
    }

    /* Section Grid */
    .section-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .section-toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius);
      cursor: pointer;
      transition: all var(--transition);
      background: var(--color-bg);
    }
    .section-toggle:hover {
      border-color: var(--color-primary);
    }
    .section-toggle.enabled {
      border-color: var(--color-primary);
      background: var(--color-primary-light);
    }
    .toggle-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .toggle-icon {
      font-size: 1.3rem;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--color-surface);
      border-radius: var(--radius-sm);
      flex-shrink: 0;
    }
    .toggle-info {
      display: flex;
      flex-direction: column;
    }
    .toggle-label {
      font-weight: 600;
      font-size: 0.9rem;
    }
    .toggle-desc {
      font-size: 0.78rem;
      color: var(--color-text-muted);
    }
    .toggle-right {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .toggle-progress {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text-secondary);
    }

    /* Toggle Switch */
    .switch {
      width: 44px;
      height: 24px;
      border-radius: 12px;
      background: var(--color-border);
      position: relative;
      transition: background var(--transition);
      flex-shrink: 0;
    }
    .switch.on {
      background: var(--color-primary);
    }
    .switch-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: transform var(--transition);
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    }
    .switch.on .switch-thumb {
      transform: translateX(20px);
    }

    /* Actions */
    .actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn-danger {
      color: var(--color-danger);
      border-color: var(--color-danger);
    }
    .btn-danger:hover {
      background: var(--color-danger);
      color: white;
    }

    @media (max-width: 600px) {
      .toggle-desc { display: none; }
      .toggle-progress { display: none; }
    }
  `]
})
export class SettingsComponent {
  profileService = inject(ProfileService);
  private progressService = inject(ProgressService);

  allSections = [
    { section: 'dsa' as Section, label: 'DSA Patterns', icon: '{ }', description: '27 patterns with LeetCode problems' },
    { section: 'system-design' as Section, label: 'System Design', icon: '☁', description: 'HLD & LLD interview problems' },
    { section: 'golang' as Section, label: 'Golang', icon: 'Go', description: 'Goroutines, GORM, best practices' },
    { section: 'caching' as Section, label: 'Caching (Redis)', icon: '⚡', description: 'Redis, caching patterns, strategies' },
    { section: 'queues' as Section, label: 'Queues (Kafka)', icon: '⇶', description: 'Kafka, messaging patterns, production' },
    { section: 'aws' as Section, label: 'AWS', icon: '△', description: '20 services with decision frameworks' },
    { section: 'devops' as Section, label: 'DevOps', icon: '⚙', description: 'Docker, K8s, CI/CD, pipelines' },
    { section: 'observability' as Section, label: 'Observability', icon: '◎', description: 'Metrics, logging, tracing, SRE' },
    { section: 'java' as Section, label: 'Java & Spring', icon: '☕', description: 'Spring Boot, Security, JPA, Lombok' },
  ];

  isEnabled(section: Section): boolean {
    return this.profileService.isSectionEnabled(section);
  }

  toggle(section: Section): void {
    this.profileService.toggleSection(section);
  }

  getProgress(section: Section): number {
    return this.progressService.getSectionProgress(section).percentage;
  }

  enableAll(): void {
    for (const sec of this.allSections) {
      if (!this.isEnabled(sec.section)) {
        this.profileService.toggleSection(sec.section);
      }
    }
  }

  disableExtras(): void {
    const essentials: Section[] = ['dsa', 'system-design', 'golang', 'caching', 'queues'];
    for (const sec of this.allSections) {
      const shouldBeEnabled = essentials.includes(sec.section);
      const isCurrentlyEnabled = this.isEnabled(sec.section);
      if (shouldBeEnabled !== isCurrentlyEnabled) {
        this.profileService.toggleSection(sec.section);
      }
    }
  }

  confirmReset(): void {
    if (confirm('Are you sure? This will reset ALL progress across every section. This cannot be undone.')) {
      this.progressService.resetAll();
    }
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

  importProgress(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const success = this.progressService.importProgress(reader.result as string);
      alert(success ? 'Progress imported successfully!' : 'Invalid progress file format.');
    };
    reader.readAsText(file);
  }
}
